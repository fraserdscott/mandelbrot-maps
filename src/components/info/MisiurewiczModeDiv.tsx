import React, { Dispatch, SetStateAction } from 'react';
import { MisiurewiczModeDivProps } from '../../common/info';
import SelectMisiurewiczCard from './SelectMisiurewiczCard';
import { misiurewiczPoints } from './SelectMisiurewiczCard';
import MisiurewiczPointMarker from './MisiurewiczPointMarker';
import { findU, prePeriod } from '../tansTheoremUtils';

const MisiurewiczModeDiv = (props: MisiurewiczModeDivProps): JSX.Element => {
  const [animationState, setAnimationState] = React.useState(-1);
  const [mag, setMagState] = React.useState<number>(1);
  const [focusedPoint, setFocusedPoint]: [
    [[number, number], number],
    Dispatch<SetStateAction<[[number, number], number]>>,
  ] = React.useState([misiurewiczPoints[0], prePeriod(misiurewiczPoints[0])]);
  const [focusedPointJulia, setFocusedPointJulia]: [
    [[number, number], number],
    Dispatch<SetStateAction<[[number, number], number]>>,
  ] = React.useState([misiurewiczPoints[0], prePeriod(misiurewiczPoints[0])]);

  return (
    <>
      {misiurewiczPoints.map((m) => (
        <MisiurewiczPointMarker
          m={m}
          show={props.show && animationState === -1}
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
      ))}
      <MisiurewiczPointMarker
        m={findU(focusedPoint[0], focusedPoint[1], 1)}
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
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          margin: 20,
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
