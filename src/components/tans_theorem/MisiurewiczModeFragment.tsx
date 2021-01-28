import React, { Dispatch, SetStateAction } from 'react';
import { MisiurewiczModeDivProps } from '../../common/info';
import MisiurewiczPointMarker, {
  animationNotTakingPlace,
} from './MisiurewiczPointMarker';
import { useWindowSize } from '../../common/utils';
import { Button } from '@material-ui/core';
import {
  findNearestMisiurewiczPoint,
  similarPoints,
  PreperiodicPoint,
  distance,
} from '../tansTheoremUtils';
import PointsInfoCard from './PointsInfoCard';
import SimilarityAnimationCard from './SimilarityAnimationCard';
import OrbitCard from './OrbitCard';
import SimilarityMenu from './SimilarityMenu';
import PlayCard from './PlayCard';
import PreperiodicPointMarker from './PreperiodicPointMarker';
import DomainInfoCard from './DomainInfoCard';
import { misiurewiczPairs } from '../MPoints';
import { XYType } from '../../common/types';
import Clock from './Clock';

export enum AnimationStatus {
  SHOW_ORBIT = -3,
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
  .slice(0, 25)
  .map((p) => new PreperiodicPoint(p, p));

export const parsePoint = (s: string): XYType => {
  const commaSeperated = s.split(',');
  return [parseFloat(commaSeperated[0]), parseFloat(commaSeperated[1])];
};

const MisiurewiczModeFragment = (props: MisiurewiczModeDivProps): JSX.Element => {
  const defaultMisiurewiczPoint = new PreperiodicPoint(
    [-0.10109636384562218, +0.9562865108091414],
    [-0.10109636384562218, +0.9562865108091414],
  );
  const [focusedPointMandelbrot, setFocusedPointMandelbrot]: [
    PreperiodicPoint,
    Dispatch<SetStateAction<PreperiodicPoint>>,
  ] = React.useState(defaultMisiurewiczPoint);
  const [focusedPointJulia, setFocusedPointJulia]: [
    PreperiodicPoint,
    Dispatch<SetStateAction<PreperiodicPoint>>,
  ] = React.useState(defaultMisiurewiczPoint);

  const selectDomainButton = () => {
    return (
      <Button
        style={{
          position: 'absolute',
          bottom: 0,
          left: (size.width || 1) / 4 - 100,
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
    );
  };

  const similarPointsJulia = similarPoints(focusedPointMandelbrot);

  const size = useWindowSize();

  const mapWidth =
    (size.width || 1) < (size.height || 0) ? size.width || 1 : (size.width || 1) / 2;

  const mapHeight =
    (size.width || 1) < (size.height || 0) ? (size.height || 0) / 2 : size.height || 0;

  return (
    <>
      {props.show && props.animationState === AnimationStatus.SHOW_ORBIT ? (
        <Clock
          mandelbrot={props.mandelbrot}
          mapWidth={mapWidth}
          mapHeight={mapHeight}
          setAnimationState={props.setAnimationState}
          focusedPointMandelbrot={focusedPointMandelbrot}
        ></Clock>
      ) : null}
      {props.show &&
      props.animationState === AnimationStatus.NO_ANIMATION &&
      props.shadeDomains
        ? selectDomainButton()
        : null}
      {props.show &&
      !props.shadeDomains &&
      (props.animationState === AnimationStatus.NO_ANIMATION ||
        props.animationState === AnimationStatus.SELECT_JULIA_POINT)
        ? MISIUREWICZ_POINTS.map((m) => {
            let show_threshold: number;
            if (distance(m.point, focusedPointMandelbrot.point) < 0.01) {
              show_threshold = 0;
            } else {
              show_threshold = m.uMagnitude * 0.5;
            }
            return (
              <MisiurewiczPointMarker
                key={m.point.toString()}
                m={m}
                mapWidth={mapWidth}
                mapHeight={mapHeight}
                show={props.show}
                mandelbrotControl={props.mandelbrot}
                animationState={props.animationState}
                focusedPointMandelbrot={focusedPointMandelbrot}
                setFocusedPointMandelbrot={setFocusedPointMandelbrot}
                setFocusedPointJulia={setFocusedPointJulia}
                offsetX={0}
                offsetY={0}
                show_threshold={show_threshold}
              />
            );
          })
        : null}
      {props.show &&
      props.shadeDomains &&
      animationNotTakingPlace(props.animationState) ? (
        <MisiurewiczPointMarker
          m={focusedPointMandelbrot}
          mapWidth={mapWidth}
          mapHeight={mapHeight}
          show={props.show}
          mandelbrotControl={props.mandelbrot}
          animationState={props.animationState}
          focusedPointMandelbrot={focusedPointMandelbrot}
          setFocusedPointMandelbrot={setFocusedPointMandelbrot}
          setFocusedPointJulia={setFocusedPointJulia}
          offsetX={0}
          offsetY={0}
          show_threshold={0}
        />
      ) : null}

      {props.animationState === AnimationStatus.SELECT_JULIA_POINT
        ? similarPointsJulia.map((m) => {
            let show_threshold: number;
            if (distance(m.point, focusedPointJulia.point) < 0.01) {
              show_threshold = 0;
            } else {
              show_threshold = m.prePeriod / 5;
            }
            return (
              <PreperiodicPointMarker
                key={m.point.toString()}
                preperiodicPoint={m}
                offset={[
                  (size.width || 1) < (size.height || 0) ? 0 : (size.width || 1) / 2,
                  (size.width || 1) < (size.height || 0) ? (size.height || 0) / 2 : 0,
                ]}
                mapWidth={mapWidth}
                mapHeight={mapHeight}
                show={props.show}
                viewerControl={props.julia}
                focusedPointJulia={focusedPointJulia}
                setFocusedPointJulia={setFocusedPointJulia}
                show_threshold={show_threshold}
              />
            );
          })
        : null}

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
