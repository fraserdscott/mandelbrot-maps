import React, { Dispatch, SetStateAction } from 'react';
import { MisiurewiczModeDivProps } from '../../common/info';
import SelectMisiurewiczCard from './SelectMisiurewiczCard';
import { misiurewiczPoints, MisiurewiczPoint } from './SelectMisiurewiczCard';
import MisiurewiczPointMarker from './MisiurewiczPointMarker';
import { screenScaleMultiplier } from '../../common/values';
import { animated } from 'react-spring';
import { useWindowSize } from '../../common/utils';

export enum AnimationStatus {
  NO_ANIMATION = -1,
  SELECT_JULIA_POINT = 45,
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

  const width = size.width ? size.width / 2 : -1; // this is the width of the mandelbrot box
  const height = size.height || -1;
  const [{ z }] = props.mandelbrot.zoomCtrl;

  return (
    <>
      <div
        style={{
          zIndex: 100,
        }}
      >
        {animationState === AnimationStatus.NO_ANIMATION
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
                        animationState === AnimationStatus.NO_ANIMATION &&
                        xPosition < width / height &&
                        yPosition < width / height &&
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
                        (((m.point[0] - x * screenScaleMultiplier) * Math.cos(-theta) -
                          (m.point[1] - y * screenScaleMultiplier) * Math.sin(-theta)) *
                          z.getValue() *
                          height +
                          width) /
                          2 -
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
                          (((m.point[0] - x * screenScaleMultiplier) * Math.sin(-theta) +
                            (m.point[1] - y * screenScaleMultiplier) * Math.cos(-theta)) *
                            z.getValue() +
                            1) -
                        1 * (40 / 4)
                      );
                    },
                  ),
                }}
              >
                <MisiurewiczPointMarker
                  m={m}
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
