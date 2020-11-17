import React, { Dispatch, SetStateAction } from 'react';
import { MisiurewiczModeDivProps } from '../../common/info';
import SelectMisiurewiczCard from './SelectMisiurewiczCard';
import { misiurewiczPoints, MisiurewiczPoint } from './SelectMisiurewiczCard';
import MisiurewiczPointMarker from './MisiurewiczPointMarker';
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

  const width = window.innerWidth / 2; // this is the width of the mandelbrot box
  const height = window.innerHeight;
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
                  visibility: props.mandelbrot.xyCtrl[0].xy.interpolate(
                    // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
                    (x, y) => {
                      const theta = props.mandelbrot.rotCtrl[0].theta.getValue();
                      const xPosition: number =
                        Math.abs(
                          (m.point[0] - x * screenScaleMultiplier) * Math.cos(-theta) -
                            (m.point[1] - y * screenScaleMultiplier) * Math.sin(-theta),
                        ) * z.getValue();
                      const yPosition: number =
                        Math.abs(
                          (m.point[0] - x * screenScaleMultiplier) * Math.sin(-theta) +
                            (m.point[1] - y * screenScaleMultiplier) * Math.cos(-theta),
                        ) * z.getValue();

                      if (
                        animationState === -1 &&
                        xPosition < 1 &&
                        yPosition < 1 &&
                        m.uMagnitude < z.getValue() * 8
                      ) {
                        return 'visible';
                      } else {
                        return 'hidden';
                      }
                    },
                  ),
                  position: 'absolute',
                  left: props.mandelbrot.xyCtrl[0].xy.interpolate(
                    // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
                    (x, y) => {
                      const theta = props.mandelbrot.rotCtrl[0].theta.getValue();

                      return (
                        (width / 2) *
                          (1 +
                            ((m.point[0] - x * screenScaleMultiplier) * Math.cos(-theta) -
                              (m.point[1] - y * screenScaleMultiplier) *
                                Math.sin(-theta)) *
                              z.getValue()) -
                        3 * (40 / 4)
                      );
                    },
                  ),
                  bottom: props.mandelbrot.xyCtrl[0].xy.interpolate(
                    // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
                    (x, y) => {
                      const theta = props.mandelbrot.rotCtrl[0].theta.getValue();

                      return (
                        (height / 2) *
                          (1 +
                            ((m.point[0] - x * screenScaleMultiplier) * Math.sin(-theta) +
                              (m.point[1] - y * screenScaleMultiplier) *
                                Math.cos(-theta)) *
                              z.getValue()) -
                        1 * (40 / 4)
                      );
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
