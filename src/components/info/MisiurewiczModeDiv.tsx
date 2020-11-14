import React, { Dispatch, SetStateAction } from 'react';
import { MisiurewiczModeDivProps } from '../../common/info';
import SelectMisiurewiczCard from './SelectMisiurewiczCard';
import { misiurewiczPoints } from './SelectMisiurewiczCard';
import MisiurewiczPointMarker from './MisiurewiczPointMarker';
import { findU, magnitude, prePeriod, period } from '../tansTheoremUtils';
import { screenScaleMultiplier } from '../../common/values';
import { animated } from 'react-spring';

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
        {misiurewiczPoints.map((m) => (
          <animated.div
            style={{
              position: 'absolute',
              left: props.mandelbrot.xyCtrl[0].xy.interpolate(
                // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
                (x, y) => {
                  const xPosition: number =
                    (width / 2) *
                      (1 + (m[0] - x * screenScaleMultiplier) * z.getValue()) -
                    3 * (40 / 4);
                  const visiblePoints: [number, number][] = misiurewiczPoints.filter(
                    (c) => {
                      const xPosition: number =
                        (width / 2) *
                          (1 + (c[0] - x * screenScaleMultiplier) * z.getValue()) -
                        3 * (40 / 4);
                      const yPosition: number =
                        (height / 2) *
                          (1 + (c[1] - y * screenScaleMultiplier) * z.getValue()) -
                        1 * (40 / 4);
                      return (
                        xPosition < width &&
                        xPosition > 0 &&
                        yPosition < height &&
                        yPosition > 0
                      );
                    },
                  );
                  if (visiblePoints.length === 0) return -1000;
                  visiblePoints.sort(function (c: [number, number]) {
                    return magnitude(findU(c, prePeriod(c), period(c)));
                  });
                  const rank = visiblePoints.findIndex(
                    (elem) => elem[0] === m[0] && elem[1] === m[1],
                  );
                  if (
                    rank !== -1 &&
                    magnitude(findU(m, prePeriod(m), period(m))) < z.getValue() * 12
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
                      (1 +
                        (m[1] -
                          props.mandelbrot.xyCtrl[0].xy.getValue()[1] *
                            screenScaleMultiplier) *
                          z.getValue()) -
                    1 * (40 / 4);
                  return yPosition;
                },
              ),
            }}
          >
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
          </animated.div>
        ))}
      </div>
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
