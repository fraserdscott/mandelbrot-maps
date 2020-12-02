import React, { Dispatch, SetStateAction } from 'react';
import { MisiurewiczModeDivProps } from '../../common/info';
import SelectMisiurewiczCard from './SelectMisiurewiczCard';
import { misiurewiczPoints } from './SelectMisiurewiczCard';
import MisiurewiczPointMarker, {
  animationNotTakingPlace,
} from './MisiurewiczPointMarker';
import { useWindowSize } from '../../common/utils';

import { Button } from '@material-ui/core';
import { screenScaleMultiplier } from '../../common/values';
import {
  complexNumbersEqual,
  findMisiurewicz,
  getSimilarsInJulia,
  magnitude,
  MisiurewiczPoint,
  orbit,
  orbitEigenvalue,
  orbitList,
} from '../tansTheoremUtils';
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

const MisiurewiczModeDiv = (props: MisiurewiczModeDivProps): JSX.Element => {
  const [mag, setMagState] = React.useState<number>(1);
  const [focusedPoint, setFocusedPoint]: [
    MisiurewiczPoint,
    Dispatch<SetStateAction<MisiurewiczPoint>>,
  ] = React.useState(misiurewiczPoints[0]);
  const [focusedPointJulia, setFocusedPointJulia]: [
    MisiurewiczPoint,
    Dispatch<SetStateAction<MisiurewiczPoint>>,
  ] = React.useState(misiurewiczPoints[0]);

  const handlePickDomain = () => {
    const mPoint = findMisiurewicz([
      props.mandelbrot.xyCtrl[0].xy.getValue()[0] * screenScaleMultiplier,
      props.mandelbrot.xyCtrl[0].xy.getValue()[1] * screenScaleMultiplier,
    ]);
    setFocusedPoint(new MisiurewiczPoint(mPoint, mPoint));
  };

  const size = useWindowSize();

  const similarPoints = getSimilarsInJulia(focusedPoint);

  return (
    <>
      {props.show && props.animationState === AnimationStatus.NO_ANIMATION ? (
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
      ) : null}
      {!props.shadeDomains && animationNotTakingPlace(props.animationState)
        ? misiurewiczPoints.map((m) => (
            <MisiurewiczPointMarker
              m={m}
              mapWidth={
                (size.width || 1) < (size.height || 0)
                  ? size.width || 1
                  : (size.width || 1) / 2
              }
              mapHeight={
                (size.width || 1) < (size.height || 0)
                  ? (size.height || 0) / 2
                  : size.height || 0
              }
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
              SHOW_POINT_THRESHOLD={7}
              color={
                complexNumbersEqual(m.point, focusedPoint.point) ? 'primary' : 'secondary'
              }
            />
          ))
        : null}
      {props.shadeDomains && animationNotTakingPlace(props.animationState) ? (
        <MisiurewiczPointMarker
          m={focusedPoint}
          mapWidth={
            (size.width || 1) < (size.height || 0)
              ? size.width || 1
              : (size.width || 1) / 2
          }
          mapHeight={
            (size.width || 1) < (size.height || 0)
              ? (size.height || 0) / 2
              : size.height || 0
          }
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
          SHOW_POINT_THRESHOLD={7}
          color={'primary'}
        />
      ) : null}

      {props.animationState === AnimationStatus.SELECT_JULIA_POINT
        ? similarPoints.map((m) => (
            <MisiurewiczPointMarker
              m={m}
              offsetX={(size.width || 1) < (size.height || 0) ? 0 : (size.width || 1) / 2}
              offsetY={
                (size.width || 1) < (size.height || 0) ? (size.height || 0) / 2 : 0
              }
              mapWidth={
                (size.width || 1) < (size.height || 0)
                  ? size.width || 1
                  : (size.width || 1) / 2
              }
              mapHeight={
                (size.width || 1) < (size.height || 0)
                  ? (size.height || 0) / 2
                  : size.height || 0
              }
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
      {/* {orbitList(
        [0, 0],
        focusedPoint.point,
        focusedPoint.prePeriod + focusedPoint.period,
      ).map((m) => (
        <MisiurewiczPointMarker
          m={new MisiurewiczPoint(focusedPoint.point, m)}
          mapWidth={
            (size.width || 1) < (size.height || 0)
              ? size.width || 1
              : (size.width || 1) / 2
          }
          mapHeight={
            (size.width || 1) < (size.height || 0)
              ? (size.height || 0) / 2
              : size.height || 0
          }
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
          SHOW_POINT_THRESHOLD={7}
          color={'default'}
        />
      ))} */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      >
        <SelectMisiurewiczCard
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
      </div>
    </>
  );
};

export default MisiurewiczModeDiv;
