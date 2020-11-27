import React, { Dispatch, SetStateAction } from 'react';
import { MisiurewiczModeDivProps } from '../../common/info';
import SelectMisiurewiczCard, { getBack } from './SelectMisiurewiczCard';
import { misiurewiczPoints, MisiurewiczPoint } from './SelectMisiurewiczCard';
import MisiurewiczPointMarker from './MisiurewiczPointMarker';
import { useWindowSize } from '../../common/utils';

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

  const size = useWindowSize();

  const similarPoints = getBack(focusedPoint);

  return (
    <>
      {!props.canon &&
      (props.animationState === AnimationStatus.NO_ANIMATION ||
        props.animationState === AnimationStatus.SELECT_JULIA_POINT)
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
              offsetX={0}
              offsetY={0}
              SHOW_POINT_THRESHOLD={7}
            />
          ))
        : null}
      {props.canon &&
      (props.animationState === AnimationStatus.NO_ANIMATION ||
        props.animationState === AnimationStatus.SELECT_JULIA_POINT) ? (
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
          offsetX={0}
          offsetY={0}
          SHOW_POINT_THRESHOLD={7}
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
              SHOW_POINT_THRESHOLD={100000}
            />
          ))
        : null}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      >
        <SelectMisiurewiczCard
          show={props.show}
          canon={props.canon}
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
