import React, { Dispatch, SetStateAction } from 'react';
import { MisiurewiczModeDivProps } from '../../common/info';
import { misiurewiczPoints } from './SelectMisiurewiczCard';
import MisiurewiczPointMarker, {
  animationNotTakingPlace,
} from './MisiurewiczPointMarker';
import { useWindowSize } from '../../common/utils';

import { Button } from '@material-ui/core';
import {
  complexNumbersEqual,
  findMisiurewicz,
  similarPoints,
  magnitude,
  PreperiodicPoint,
  orbit,
  orbitEigenvalue,
  orbitList,
} from '../tansTheoremUtils';
import OrbitMarker from './OrbitMarker';
import InfoCard from './InfoCard';
import SimilarityAnimationCard from './SimilarityAnimationCard';
import OrbitCard from './OrbitCard';
import SimilarityMenu from './SimilarityMenu';
import PlayCard from './PlayCard';
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

const MisiurewiczModeDiv = (props: MisiurewiczModeDivProps): JSX.Element => {
  const [mag, setMagState] = React.useState<number>(1);
  const [focusedPoint, setFocusedPoint]: [
    PreperiodicPoint,
    Dispatch<SetStateAction<PreperiodicPoint>>,
  ] = React.useState(
    new PreperiodicPoint(
      [-0.10109636384562218, +0.9562865108091414],
      [-0.10109636384562218, +0.9562865108091414],
    ),
  );
  const [focusedPointJulia, setFocusedPointJulia]: [
    PreperiodicPoint,
    Dispatch<SetStateAction<PreperiodicPoint>>,
  ] = React.useState(focusedPoint);

  const handlePickDomain = () => {
    const mPoint = findMisiurewicz(props.mandelbrot.xyCtrl[0].xy.getValue());
    setFocusedPoint(new PreperiodicPoint(mPoint, mPoint));
  };

  const pickDomainButton = () => {
    return (
      <Button
        style={{
          visibility:
            props.shadeDomains && props.animationState === AnimationStatus.NO_ANIMATION
              ? 'visible'
              : 'hidden',
          position: 'absolute',
          bottom: 0,
          left: (size.width || 1) / 4 - 100,
          zIndex: 1000,
        }}
        variant="contained"
        onClick={() => handlePickDomain()}
      >
        SELECT NEAREST MISIUREWICZ POINT
      </Button>
    );
  };

  const size = useWindowSize();

  const zs = similarPoints(focusedPoint);

  const mapWidth =
    (size.width || 1) < (size.height || 0) ? size.width || 1 : (size.width || 1) / 2;

  const mapHeight =
    (size.width || 1) < (size.height || 0) ? (size.height || 0) / 2 : size.height || 0;

  return (
    <>
      {props.show && animationNotTakingPlace(props.animationState)
        ? pickDomainButton()
        : null}
      {!props.shadeDomains &&
      animationNotTakingPlace(props.animationState) &&
      props.animationState !== AnimationStatus.SHOW_ORBIT
        ? misiurewiczPoints.map((m) => (
            <MisiurewiczPointMarker
              key={m.point.toString()}
              m={m}
              mapWidth={mapWidth}
              mapHeight={mapHeight}
              show={props.show}
              viewerControl={props.mandelbrot}
              mandelbrotControl={props.mandelbrot}
              animationState={props.animationState}
              setAnimationState={props.setAnimationState}
              focusedPoint={focusedPoint}
              setFocusedPoint={setFocusedPoint}
              setFocusedPointJulia={setFocusedPointJulia}
              offsetX={0}
              offsetY={0}
              SHOW_POINT_THRESHOLD={m.uMagnitude * 0.5}
              color={
                complexNumbersEqual(m.point, focusedPoint.point) ? 'primary' : 'secondary'
              }
            />
          ))
        : null}
      {props.shadeDomains && animationNotTakingPlace(props.animationState) ? (
        <MisiurewiczPointMarker
          m={focusedPoint}
          mapWidth={mapWidth}
          mapHeight={mapHeight}
          show={props.show}
          viewerControl={props.mandelbrot}
          mandelbrotControl={props.mandelbrot}
          animationState={props.animationState}
          setAnimationState={props.setAnimationState}
          focusedPoint={focusedPoint}
          setFocusedPoint={setFocusedPoint}
          setFocusedPointJulia={setFocusedPointJulia}
          offsetX={0}
          offsetY={0}
          SHOW_POINT_THRESHOLD={9999999}
          color={'primary'}
        />
      ) : null}

      {props.animationState === AnimationStatus.SELECT_JULIA_POINT
        ? zs.map((m) => (
            <MisiurewiczPointMarker
              key={m.point.toString()}
              m={m}
              offsetX={(size.width || 1) < (size.height || 0) ? 0 : (size.width || 1) / 2}
              offsetY={
                (size.width || 1) < (size.height || 0) ? (size.height || 0) / 2 : 0
              }
              mapWidth={mapWidth}
              mapHeight={mapHeight}
              show={props.show}
              viewerControl={props.julia}
              mandelbrotControl={props.mandelbrot}
              animationState={props.animationState}
              setAnimationState={props.setAnimationState}
              focusedPoint={focusedPointJulia}
              setFocusedPoint={setFocusedPointJulia}
              setFocusedPointJulia={setFocusedPointJulia}
              SHOW_POINT_THRESHOLD={
                30 *
                (1 /
                  magnitude(
                    orbitEigenvalue(
                      orbit(
                        focusedPoint.point,
                        focusedPoint.point,
                        focusedPoint.prePeriod,
                      ),
                      focusedPoint.point,
                      focusedPoint.period,
                    ),
                  ))
              }
              color={
                complexNumbersEqual(m.point, focusedPointJulia.point)
                  ? 'primary'
                  : 'secondary'
              }
            />
          ))
        : null}
      {orbitList(
        [0, 0],
        focusedPoint.point,
        focusedPoint.prePeriod + focusedPoint.period + 1, // add one to include 0
      ).map((m) => (
        <OrbitMarker
          key={m.toString()}
          c={new PreperiodicPoint(focusedPoint.point, m)}
          mapWidth={mapWidth}
          mapHeight={mapHeight}
          show={props.show && props.animationState === AnimationStatus.SHOW_ORBIT}
          mandelbrotControl={props.mandelbrot}
        />
      ))}

      {props.animationState === AnimationStatus.NO_ANIMATION ? (
        <InfoCard
          show={props.show}
          shadeDomains={props.shadeDomains}
          mandelbrot={props.mandelbrot}
          julia={props.julia}
          animationState={props.animationState}
          setAnimationState={props.setAnimationState}
          focusedPoint={focusedPoint}
          setFocusedPoint={setFocusedPoint}
          focusedPointJulia={focusedPointJulia}
          setFocusedPointJulia={setFocusedPointJulia}
          mag={mag}
          setMagState={setMagState}
        ></InfoCard>
      ) : null}
      {props.animationState === AnimationStatus.SHOW_ORBIT ? (
        <OrbitCard
          setAnimationState={props.setAnimationState}
          focusedPoint={focusedPoint}
        />
      ) : null}
      {props.animationState === AnimationStatus.SELECT_JULIA_POINT ? (
        <SimilarityMenu
          show={props.show}
          shadeDomains={props.shadeDomains}
          mandelbrot={props.mandelbrot}
          julia={props.julia}
          animationState={props.animationState}
          setAnimationState={props.setAnimationState}
          focusedPoint={focusedPoint}
          setFocusedPoint={setFocusedPoint}
          focusedPointJulia={focusedPointJulia}
          setFocusedPointJulia={setFocusedPointJulia}
          mag={mag}
          setMagState={setMagState}
        />
      ) : null}
      {props.animationState === AnimationStatus.PLAY ? (
        <PlayCard
          mandelbrot={props.mandelbrot}
          julia={props.julia}
          setAnimationState={props.setAnimationState}
          focusedPoint={focusedPoint}
          focusedPointJulia={focusedPointJulia}
          mag={mag}
          setMagState={setMagState}
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
          focusedPoint={focusedPoint}
          setFocusedPoint={setFocusedPoint}
          focusedPointJulia={focusedPointJulia}
          setFocusedPointJulia={setFocusedPointJulia}
        ></SimilarityAnimationCard>
      ) : null}
    </>
  );
};

export default MisiurewiczModeDiv;
