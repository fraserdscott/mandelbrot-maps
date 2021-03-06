import React, { useState, useEffect, useCallback } from 'react';
import { MisiurewiczModeFragmentProps } from '../../common/info';
import MisiurewiczPointMarker from './MisiurewiczPointMarker';
import { useWindowSize, warpToPoint } from '../../common/utils';
import { Button, Card, IconButton, Grow } from '@material-ui/core';
import {
  findNearestMisiurewiczPoint,
  similarPoints,
  PreperiodicPoint,
  withinBoundingBox,
} from '../tansTheoremUtils';
import PointsInfoCard from './MisiurewiczPointsMenu';
import SimilarityAnimationCard from './SimilarityAnimationCard';
import SimilarityMenu from './SimilarityMenu';
import PlayCard from './PlayCard';
import PreperiodicPointMarker from './PreperiodicPointMarker';
import ZoomMenu from './ZoomMenu';
import { misiurewiczPairs } from './MPoints';
import { XYType } from '../../common/types';
import ArrowBackwardIcon from '@material-ui/icons/ArrowBack';

export enum AnimationStatus {
  SELECT_MANDELBROT_POINT = 0,
  SELECT_JULIA_POINT = 1,
  ZOOM_M = 2,
  ZOOM_J = 3,
  ROTATE_M = 4,
  ROTATE_J = 5,
  PLAY = 6,
}

export const MISIUREWICZ_POINTS: PreperiodicPoint[] = misiurewiczPairs
  .slice(0, 200)
  .map((p) => new PreperiodicPoint(p, p))
  .sort((a, b) => a.uMagnitude - b.uMagnitude);

export const parsePoint = (s: string): XYType => {
  const commaSeperated = s.split(',');
  return [parseFloat(commaSeperated[0]), parseFloat(commaSeperated[1])];
};

const MAX_DEPTH = 4;

const MisiurewiczModeFragment = (props: MisiurewiczModeFragmentProps): JSX.Element => {
  const [similarPointsJulia, setSimilarPointsJulia] = useState(
    similarPoints(props.focusedPointJulia, MAX_DEPTH).sort(
      (a, b) => a.prePeriod - b.prePeriod,
    ),
  );

  const handleMisiurewiczPointSelection = useCallback(
    (pointM: PreperiodicPoint, pointJ: PreperiodicPoint): void => {
      props.setFocusedPointMandelbrot(pointM);
      props.setFocusedPointJulia(new PreperiodicPoint(pointM.point, pointJ.point));
      setSimilarPointsJulia(
        similarPoints(pointM, MAX_DEPTH).sort((a, b) => a.prePeriod - b.prePeriod),
      );
    },
    [props],
  );

  const handleSimilarPointSelection = useCallback(
    (pointJ: PreperiodicPoint): void => {
      props.setFocusedPointJulia(pointJ);
    },
    [props],
  );

  const BackButton = () => {
    return (
      <IconButton
        style={{ width: 50 }}
        onClick={() => {
          props.setAnimationState(AnimationStatus.SELECT_MANDELBROT_POINT);
          warpToPoint(props.mandelbrot, {
            xy: props.focusedPointMandelbrot.point,
            z: props.focusedPointMandelbrot.uMagnitude,
            theta: 0,
          });
          warpToPoint(props.julia, {
            xy: [0, 0],
            z: 0.5,
            theta: 0,
          });
        }}
      >
        <ArrowBackwardIcon />
      </IconButton>
    );
  };
  const size = useWindowSize();

  const isVertical = (size.w || 1) < (size.h || 0);

  const mapWidth = isVertical ? size.w || 1 : (size.w || 1) / 2;
  const mapHeight = isVertical ? (size.h || 0) / 2 : size.h || 0;

  const juliaOffset = [
    isVertical ? 0 : (size.w || 1) / 2,
    isVertical ? -(size.h || 0) / 2 : 0,
  ];

  const ASPECT_RATIO = mapWidth / mapHeight;

  const [misiurewiczMarkers, setMisiurewiczMarkers] = useState(
    MISIUREWICZ_POINTS.slice(0, 1).map((m) => {
      return (
        <MisiurewiczPointMarker
          key={m.point.toString()}
          m={m}
          mapWidth={mapWidth}
          mapHeight={mapHeight}
          mandelbrotControl={props.mandelbrot}
          focusedPointMandelbrot={props.focusedPointMandelbrot}
          handleMandelbrotSelection={handleMisiurewiczPointSelection}
        />
      );
    }),
  );
  const [juliaMarkers, setJuliaMarkers] = useState(
    similarPointsJulia.slice(0, 1).map((m) => {
      return (
        <PreperiodicPointMarker
          key={m.point.toString()}
          preperiodicPoint={m}
          mapWidth={mapWidth}
          mapHeight={mapHeight}
          viewerControl={props.julia}
          focusedPointJulia={props.focusedPointJulia}
          handleSimilarPointSelection={handleSimilarPointSelection}
        />
      );
    }),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (!props.show) {
        return;
      }

      if (props.animationState === AnimationStatus.SELECT_MANDELBROT_POINT) {
        const visiblePoints = [];

        const boxCentre = props.mandelbrot.xyCtrl[0].xy.getValue();
        const boxWidth = ASPECT_RATIO / props.mandelbrot.zoomCtrl[0].z.getValue();
        const boxHeight = 1 / props.mandelbrot.zoomCtrl[0].z.getValue();
        const boxAngle = props.mandelbrot.rotCtrl[0].theta.getValue();

        for (let i = 0; i < MISIUREWICZ_POINTS.length; i++) {
          if (visiblePoints.length === 5) break;

          if (
            withinBoundingBox(
              MISIUREWICZ_POINTS[i].point,
              boxCentre,
              boxWidth,
              boxHeight,
              boxAngle,
            )
          ) {
            visiblePoints.push(
              <MisiurewiczPointMarker
                key={MISIUREWICZ_POINTS[i].point.toString()}
                m={MISIUREWICZ_POINTS[i]}
                mapWidth={mapWidth}
                mapHeight={mapHeight}
                mandelbrotControl={props.mandelbrot}
                focusedPointMandelbrot={props.focusedPointMandelbrot}
                handleMandelbrotSelection={handleMisiurewiczPointSelection}
              />,
            );
          }
        }
        setMisiurewiczMarkers(visiblePoints);
      }

      if (props.animationState === AnimationStatus.SELECT_JULIA_POINT) {
        const visibleJuliaPoints: JSX.Element[] = [];

        const boxCentre = props.julia.xyCtrl[0].xy.getValue();
        const boxWidth = ASPECT_RATIO / props.julia.zoomCtrl[0].z.getValue();
        const boxHeight = 1 / props.julia.zoomCtrl[0].z.getValue();
        const boxAngle = props.julia.rotCtrl[0].theta.getValue();

        for (let i = 0; i < similarPointsJulia.length; i++) {
          if (visibleJuliaPoints.length === 5) break;

          if (
            withinBoundingBox(
              similarPointsJulia[i].point,
              boxCentre,
              boxWidth,
              boxHeight,
              boxAngle,
            )
          ) {
            visibleJuliaPoints.push(
              <PreperiodicPointMarker
                key={similarPointsJulia[i].point.toString()}
                preperiodicPoint={similarPointsJulia[i]}
                mapWidth={mapWidth}
                mapHeight={mapHeight}
                viewerControl={props.julia}
                focusedPointJulia={props.focusedPointJulia}
                handleSimilarPointSelection={handleSimilarPointSelection}
              />,
            );
          }
        }
        setJuliaMarkers(visibleJuliaPoints);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [
    ASPECT_RATIO,
    handleMisiurewiczPointSelection,
    handleSimilarPointSelection,
    mapHeight,
    mapWidth,
    props.animationState,
    props.focusedPointJulia,
    props.focusedPointMandelbrot,
    props.julia,
    props.mandelbrot,
    props.show,
    similarPointsJulia,
  ]);

  return (
    <>
      {props.show &&
      props.animationState === AnimationStatus.SELECT_MANDELBROT_POINT &&
      props.shadeDomains ? (
        <Button
          style={{
            position: 'absolute',
            bottom: 0,
            left: (size.w || 1) / 4 - 100,
            zIndex: 1000,
          }}
          variant="contained"
          onClick={() => {
            const mPoint = findNearestMisiurewiczPoint(
              props.mandelbrot.xyCtrl[0].xy.getValue(),
            );
            props.setFocusedPointMandelbrot(new PreperiodicPoint(mPoint, mPoint));
          }}
        >
          Select nearest Misiurewicz point
        </Button>
      ) : null}
      {props.show && props.animationState === AnimationStatus.SELECT_MANDELBROT_POINT ? (
        <div
          style={{
            zIndex: 100,
            position: 'fixed',
            visibility: 'hidden',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
          }}
        >
          {misiurewiczMarkers}
        </div>
      ) : null}

      {props.animationState === AnimationStatus.SELECT_JULIA_POINT ? (
        <div
          style={{
            zIndex: 100,
            position: 'fixed',
            visibility: 'hidden',
            width: '100%',
            height: '100%',
            left: juliaOffset[0],
            top: juliaOffset[1],
          }}
        >
          {juliaMarkers}
        </div>
      ) : null}

      {props.animationState === AnimationStatus.SELECT_MANDELBROT_POINT ? (
        <PointsInfoCard
          show={props.show}
          mandelbrot={props.mandelbrot}
          julia={props.julia}
          animationState={props.animationState}
          setAnimationState={props.setAnimationState}
          focusedPointMandelbrot={props.focusedPointMandelbrot}
          focusedPointJulia={props.focusedPointJulia}
          handleMandelbrotSelection={handleMisiurewiczPointSelection}
        />
      ) : null}
      {props.animationState === AnimationStatus.SELECT_JULIA_POINT ? (
        <Card
          style={{
            width: 200,
            padding: 12,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 1,
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        >
          <>{BackButton()}</>
          <SimilarityMenu
            show={props.show}
            shadeDomains={props.shadeDomains}
            mandelbrot={props.mandelbrot}
            julia={props.julia}
            animationState={props.animationState}
            setAnimationState={props.setAnimationState}
            focusedPoint={props.focusedPointMandelbrot}
            focusedPointJulia={props.focusedPointJulia}
            similarPointsJulia={similarPointsJulia}
            handleMandelbrotSelection={handleMisiurewiczPointSelection}
            handleSimilarPointSelection={handleSimilarPointSelection}
          />
        </Card>
      ) : null}
      {props.animationState === AnimationStatus.PLAY ? (
        <>
          <Card
            style={{
              padding: 12,
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 1,
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          >
            <>{BackButton()}</>
          </Card>
          {/* <PlayCard
            mandelbrot={props.mandelbrot}
            julia={props.julia}
            setAnimationState={props.setAnimationState}
            focusedPointMandelbrot={props.focusedPointMandelbrot}
            focusedPointJulia={props.focusedPointJulia}
            magnification={props.magnification}
          /> */}
        </>
      ) : null}
      {[
        AnimationStatus.SELECT_MANDELBROT_POINT,
        AnimationStatus.SELECT_JULIA_POINT,
        AnimationStatus.ZOOM_M,
        AnimationStatus.ZOOM_J,
        AnimationStatus.ROTATE_M,
        AnimationStatus.ROTATE_J,
      ].includes(props.animationState) ? (
        <SimilarityAnimationCard
          show={props.show}
          mandelbrot={props.mandelbrot}
          julia={props.julia}
          animationState={props.animationState}
          setAnimationState={props.setAnimationState}
          focusedPoint={props.focusedPointMandelbrot}
          focusedPointJulia={props.focusedPointJulia}
        />
      ) : null}
      {[
        AnimationStatus.ZOOM_M,
        AnimationStatus.ZOOM_J,
        AnimationStatus.ROTATE_M,
        AnimationStatus.ROTATE_J,
      ].includes(props.animationState) ? (
        <Card
          style={{
            width: 200,
            padding: 12,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 1,
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        >
          <>{BackButton()}</>
          <ZoomMenu
            show={props.show}
            mandelbrot={props.mandelbrot}
            julia={props.julia}
            animationState={props.animationState}
            setAnimationState={props.setAnimationState}
            focusedPointMandelbrot={props.focusedPointMandelbrot}
            focusedPointJulia={props.focusedPointJulia}
            handleMandelbrotSelection={handleMisiurewiczPointSelection}
          />
        </Card>
      ) : null}
    </>
  );
};

export default MisiurewiczModeFragment;
