import React, { Dispatch, SetStateAction } from 'react';
import { MisiurewiczModeDivProps } from '../../common/info';
import SelectMisiurewiczCard from './SelectMisiurewiczCard';
import { misiurewiczPoints } from './SelectMisiurewiczCard';
import MisiurewiczPointMarker from './MisiurewiczPointMarker';

const MisiurewiczModeDiv = (props: MisiurewiczModeDivProps): JSX.Element => {
  const [animationState, setAnimationState] = React.useState(0);
  const [mag, setMagState] = React.useState<number>(1);
  const [focusedPoint, setFocusedPoint]: [
    [number, number],
    Dispatch<SetStateAction<[number, number]>>,
  ] = React.useState(misiurewiczPoints[0]);

  return (
    <>
      {misiurewiczPoints.map((m) => (
        <MisiurewiczPointMarker
          m={m}
          show={animationState !== 1}
          mandelbrot={props.mandelbrot}
          julia={props.julia}
          animationState={animationState}
          setAnimationState={setAnimationState}
          focusedPoint={focusedPoint}
          setFocusedPoint={setFocusedPoint}
          mag={mag}
          setMagState={setMagState}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 'auto',
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
          mag={mag}
          setMagState={setMagState}
        />
      </div>
    </>
  );
};

export default MisiurewiczModeDiv;
