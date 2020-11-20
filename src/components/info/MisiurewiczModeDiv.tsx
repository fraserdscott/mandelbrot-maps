import React, { Dispatch, SetStateAction } from 'react';
import { MisiurewiczModeDivProps } from '../../common/info';
import SelectMisiurewiczCard from './SelectMisiurewiczCard';
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
  const [animationState, setAnimationState] = React.useState(
    AnimationStatus.NO_ANIMATION,
  );
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

  return (
    <>
      {animationState === AnimationStatus.NO_ANIMATION
        ? misiurewiczPoints.map((m) => (
            <MisiurewiczPointMarker
              m={m}
              width={
                (size.width || 1) < (size.height || 0)
                  ? size.width || 1
                  : (size.width || 1) / 2
              }
              height={
                (size.width || 1) < (size.height || 0)
                  ? (size.height || 0) / 2
                  : size.height || 0
              }
              show={props.show}
              mandelbrot={props.mandelbrot}
              julia={props.julia}
              animationState={animationState}
              setAnimationState={setAnimationState}
              focusedPoint={focusedPoint}
              setFocusedPoint={setFocusedPoint}
              focusedPointJulia={focusedPointJulia}
              setFocusedPointJulia={setFocusedPointJulia}
              mag={mag}
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
          mandelbrot={props.mandelbrot}
          julia={props.julia}
          animationState={animationState}
          setAnimationState={setAnimationState}
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
