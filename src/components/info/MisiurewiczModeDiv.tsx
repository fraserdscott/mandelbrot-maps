import React, { Dispatch, SetStateAction } from 'react';
import { MisiurewiczModeDivProps } from '../../common/info';
import SelectMisiurewiczCard from './SelectMisiurewiczCard';
import { misiurewiczPoints, MisiurewiczPoint } from './SelectMisiurewiczCard';
import MisiurewiczPointMarker from './MisiurewiczPointMarker';
import { magnitude } from '../tansTheoremUtils';
import { screenScaleMultiplier } from '../../common/values';
import { animated } from 'react-spring';

const MisiurewiczModeDiv = (props: MisiurewiczModeDivProps): JSX.Element => {
  const [animationState, setAnimationState] = React.useState(-1);
  const [mag, setMagState] = React.useState<number>(1);
  const [focusedPoint, setFocusedPoint]: [
    MisiurewiczPoint,
    Dispatch<SetStateAction<MisiurewiczPoint>>,
  ] = React.useState(misiurewiczPoints[0]);
  const [focusedPointJulia, setFocusedPointJulia]: [
    MisiurewiczPoint,
    Dispatch<SetStateAction<MisiurewiczPoint>>,
  ] = React.useState(misiurewiczPoints[0]);

  const width = 640;
  const height = 610;
  const [{ z }] = props.mandelbrot.zoomCtrl;

  return (
    <>
      <div
        style={{
          zIndex: 100,
        }}
      >
        {animationState === -1
          ? misiurewiczPoints.map((m) => (
              <animated.div
                style={{
                  position: 'absolute',
                  left: props.mandelbrot.xyCtrl[0].xy.interpolate(
                    // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
                    (x, y) => {
                      const xPosition: number =
                        (width / 2) *
                          (1 + (m.point[0] - x * screenScaleMultiplier) * z.getValue()) -
                        3 * (40 / 4);
                      const yPosition: number =
                        (m.point[1] - y * screenScaleMultiplier) * z.getValue();

                      if (
                        xPosition < width &&
                        xPosition > 0 &&
                        yPosition < 1 &&
                        yPosition > -1 &&
                        magnitude(m.u) < z.getValue() * 8
                      ) {
                        return xPosition;
                      } else {
                        return -1000;
                      }
                    },
                  ),
                  bottom: props.mandelbrot.xyCtrl[0].xy.interpolate(
                    // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
                    (x, y) => {
                      const yPosition: number =
                        (height / 2) *
                          (1 + (m.point[1] - y * screenScaleMultiplier) * z.getValue()) -
                        1 * (40 / 4);
                      return yPosition;
                    },
                  ),
                }}
              >
                <MisiurewiczPointMarker
                  m={m.point}
                  show={props.show}
                  focusedPoint={focusedPoint}
                  setFocusedPoint={setFocusedPoint}
                />
              </animated.div>
            ))
          : null}
      </div>
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
