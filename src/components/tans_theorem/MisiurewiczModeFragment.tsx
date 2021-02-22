import React, { useState, useEffect } from 'react';
import { MisiurewiczModeDivProps } from '../../common/info';
import MisiurewiczPointMarker from './MisiurewiczPointMarker';
import { useWindowSize } from '../../common/utils';
import { Button } from '@material-ui/core';
import {
  findNearestMisiurewiczPoint,
  similarPoints,
  PreperiodicPoint,
  distance,
  withinBoundingBox,
} from '../tansTheoremUtils';
import PointsInfoCard from './PointsInfoCard';
import SimilarityAnimationCard from './SimilarityAnimationCard';
import SimilarityMenu from './SimilarityMenu';
import PlayCard from './PlayCard';
import PreperiodicPointMarker from './PreperiodicPointMarker';
import DomainInfoCard from './DomainInfoCard';
import { misiurewiczPairs } from './MPoints';
import { XYType } from '../../common/types';

export enum AnimationStatus {
  NO_ANIMATION = -2,
  SELECT_JULIA_POINT = -1,
  TRANSLATE_M = 0,
  TRANSLATE_J = 1,
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

const defaultMisiurewiczPoint = new PreperiodicPoint(
  [-0.10109636384562218, +0.9562865108091414],
  [-0.10109636384562218, +0.9562865108091414],
);

const MisiurewiczModeFragment = (props: MisiurewiczModeDivProps): JSX.Element => {
  const [focusedPointMandelbrot, setFocusedPointMandelbrot] = useState(
    defaultMisiurewiczPoint,
  );
  const [focusedPointJulia, setFocusedPointJulia] = useState(defaultMisiurewiczPoint);
  const [similarPointsJulia, setSimilarPointsJulia] = useState(
    similarPoints(focusedPointJulia, 4).sort((a, b) => a.prePeriod - b.prePeriod),
  );

  const size = useWindowSize();

  const mapWidth = (size.w || 1) < (size.h || 0) ? size.w || 1 : (size.w || 1) / 2;
  const mapHeight = (size.w || 1) < (size.h || 0) ? (size.h || 0) / 2 : size.h || 0;

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
          focusedPointMandelbrot={focusedPointMandelbrot}
          setFocusedPointMandelbrot={setFocusedPointMandelbrot}
          setFocusedPointJulia={setFocusedPointJulia}
          setSimilarPointsJulia={setSimilarPointsJulia}
          offsetX={0}
          offsetY={0}
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
          offset={[
            (size.w || 1) < (size.h || 0) ? 0 : (size.w || 1) / 2,
            (size.w || 1) < (size.h || 0) ? (size.h || 0) / 2 : 0,
          ]}
          mapWidth={mapWidth}
          mapHeight={mapHeight}
          viewerControl={props.julia}
          focusedPointJulia={focusedPointJulia}
          setFocusedPointJulia={setFocusedPointJulia}
        />
      );
    }),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (!props.show) {
        return;
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
                offset={[
                  (size.w || 1) < (size.h || 0) ? 0 : (size.w || 1) / 2,
                  (size.w || 1) < (size.h || 0) ? (size.h || 0) / 2 : 0,
                ]}
                mapWidth={mapWidth}
                mapHeight={mapHeight}
                viewerControl={props.julia}
                focusedPointJulia={focusedPointJulia}
                setFocusedPointJulia={setFocusedPointJulia}
              />,
            );
          }
        }
        setJuliaMarkers(visibleJuliaPoints);
      }

      if (props.animationState === AnimationStatus.NO_ANIMATION) {
        const visiblePoints = [];

        const boxCentre = props.mandelbrot.xyCtrl[0].xy.getValue();
        const boxWidth = ASPECT_RATIO / props.mandelbrot.zoomCtrl[0].z.getValue();
        const boxHeight = 1 / props.mandelbrot.zoomCtrl[0].z.getValue();
        const boxAngle = props.mandelbrot.rotCtrl[0].theta.getValue();

        for (let i = 0; i < MISIUREWICZ_POINTS.length; i++) {
          const show_threshold = MISIUREWICZ_POINTS[i].uMagnitude;

          if (
            visiblePoints.length === 5 ||
            props.mandelbrot.zoomCtrl[0].z.getValue() < show_threshold
          )
            break;

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
                focusedPointMandelbrot={focusedPointMandelbrot}
                setFocusedPointMandelbrot={setFocusedPointMandelbrot}
                setFocusedPointJulia={setFocusedPointJulia}
                setSimilarPointsJulia={setSimilarPointsJulia}
                offsetX={0}
                offsetY={0}
              />,
            );
          }
        }
        setMisiurewiczMarkers(visiblePoints);
      } else {
        setMisiurewiczMarkers([]);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [
    ASPECT_RATIO,
    focusedPointJulia,
    focusedPointMandelbrot,
    mapHeight,
    mapWidth,
    props.animationState,
    props.julia,
    props.mandelbrot,
    props.show,
    similarPointsJulia,
    size.h,
    size.w,
  ]);

  return (
    <>
      {props.show &&
      props.animationState === AnimationStatus.NO_ANIMATION &&
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
            setFocusedPointMandelbrot(new PreperiodicPoint(mPoint, mPoint));
          }}
        >
          Select nearest Misiurewicz point
        </Button>
      ) : null}
      {props.show &&
      !props.shadeDomains &&
      (props.animationState === AnimationStatus.NO_ANIMATION ||
        props.animationState === AnimationStatus.SELECT_JULIA_POINT)
        ? misiurewiczMarkers
        : null}

      {props.animationState === AnimationStatus.SELECT_JULIA_POINT ? juliaMarkers : null}

      {props.animationState === AnimationStatus.NO_ANIMATION && !props.shadeDomains ? (
        <PointsInfoCard
          show={props.show}
          shadeDomains={props.shadeDomains}
          mandelbrot={props.mandelbrot}
          julia={props.julia}
          animationState={props.animationState}
          setAnimationState={props.setAnimationState}
          focusedPoint={focusedPointMandelbrot}
          setFocusedPoint={setFocusedPointMandelbrot}
          focusedPointJulia={focusedPointJulia}
          setFocusedPointJulia={setFocusedPointJulia}
        ></PointsInfoCard>
      ) : null}
      {props.animationState === AnimationStatus.NO_ANIMATION && props.shadeDomains ? (
        <DomainInfoCard
          show={props.show}
          shadeDomains={props.shadeDomains}
          mandelbrot={props.mandelbrot}
          julia={props.julia}
          animationState={props.animationState}
          setAnimationState={props.setAnimationState}
          focusedPoint={focusedPointMandelbrot}
          setFocusedPoint={setFocusedPointMandelbrot}
          focusedPointJulia={focusedPointJulia}
          setFocusedPointJulia={setFocusedPointJulia}
        ></DomainInfoCard>
      ) : null}
      {props.animationState === AnimationStatus.SELECT_JULIA_POINT ? (
        <SimilarityMenu
          show={props.show}
          shadeDomains={props.shadeDomains}
          mandelbrot={props.mandelbrot}
          julia={props.julia}
          animationState={props.animationState}
          setAnimationState={props.setAnimationState}
          focusedPoint={focusedPointMandelbrot}
          setFocusedPoint={setFocusedPointMandelbrot}
          focusedPointJulia={focusedPointJulia}
          setFocusedPointJulia={setFocusedPointJulia}
          similarPointsJulia={similarPointsJulia}
        />
      ) : null}
      {props.animationState === AnimationStatus.PLAY ? (
        <PlayCard
          mandelbrot={props.mandelbrot}
          julia={props.julia}
          setAnimationState={props.setAnimationState}
          focusedPointMandelbrot={focusedPointMandelbrot}
          focusedPointJulia={focusedPointJulia}
        />
      ) : null}
      {props.animationState === AnimationStatus.TRANSLATE_M ||
      props.animationState === AnimationStatus.TRANSLATE_J ||
      props.animationState === AnimationStatus.ZOOM_M ||
      props.animationState === AnimationStatus.ZOOM_J ||
      props.animationState === AnimationStatus.ROTATE_M ||
      props.animationState === AnimationStatus.ROTATE_J ? (
        <SimilarityAnimationCard
          show={props.show}
          mandelbrot={props.mandelbrot}
          julia={props.julia}
          animationState={props.animationState}
          setAnimationState={props.setAnimationState}
          focusedPoint={focusedPointMandelbrot}
          setFocusedPoint={setFocusedPointMandelbrot}
          focusedPointJulia={focusedPointJulia}
          setFocusedPointJulia={setFocusedPointJulia}
        ></SimilarityAnimationCard>
      ) : null}
    </>
  );
};

export default MisiurewiczModeFragment;
