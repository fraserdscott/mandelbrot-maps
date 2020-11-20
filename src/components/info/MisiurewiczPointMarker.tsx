import React from 'react';
import { Grow, Tooltip } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import { MisiurewiczPointMarkerProps } from '../../common/info';
import { complexNumbersEqual } from '../tansTheoremUtils';
import { animated } from 'react-spring';
import { screenScaleMultiplier } from '../../common/values';
import { AnimationStatus } from './MisiurewiczModeDiv';
import { ThetaType } from '../../common/types';

const MisiurewiczPointMarker = (props: MisiurewiczPointMarkerProps): JSX.Element => {
  const [{ z }] = props.mandelbrot.zoomCtrl;

  const BUTTON_SIZE = 40;

  return (
    <animated.div
      style={{
        zIndex: 100,
        visibility: props.mandelbrot.xyCtrl[0].xy.interpolate(
          // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
          (x, y) => {
            const theta = props.mandelbrot.rotCtrl[0].theta.getValue();
            const xPosition: number =
              Math.abs(
                (props.m.point[0] - x * screenScaleMultiplier) * Math.cos(-theta) -
                  (props.m.point[1] - y * screenScaleMultiplier) * Math.sin(-theta),
              ) * z.getValue();
            const yPosition: number =
              Math.abs(
                (props.m.point[0] - x * screenScaleMultiplier) * Math.sin(-theta) +
                  (props.m.point[1] - y * screenScaleMultiplier) * Math.cos(-theta),
              ) * z.getValue();

            if (
              props.animationState === AnimationStatus.NO_ANIMATION &&
              xPosition < props.width / props.height &&
              yPosition < props.width / props.height &&
              props.m.uMagnitude * props.m.period < z.getValue() * 7
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
              (((props.m.point[0] - x * screenScaleMultiplier) * Math.cos(-theta) -
                (props.m.point[1] - y * screenScaleMultiplier) * Math.sin(-theta)) *
                z.getValue() *
                props.height +
                props.width) /
                2 -
              3 * (BUTTON_SIZE / 4)
            );
          },
        ),
        bottom: props.mandelbrot.xyCtrl[0].xy.interpolate(
          // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
          (x, y) => {
            const theta: ThetaType = props.mandelbrot.rotCtrl[0].theta.getValue();

            return (
              (props.height / 2) *
                (((props.m.point[0] - x * screenScaleMultiplier) * Math.sin(-theta) +
                  (props.m.point[1] - y * screenScaleMultiplier) * Math.cos(-theta)) *
                  z.getValue() +
                  1) -
              1 * (BUTTON_SIZE / 4)
            );
          },
        ),
      }}
    >
      <Tooltip title={props.m.toString()} placement="top">
        <IconButton
          onClick={() => {
            props.setFocusedPoint(props.m);
          }}
          color={
            complexNumbersEqual(props.m.point, props.focusedPoint.point)
              ? 'primary'
              : 'secondary'
          }
        >
          <RoomIcon style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }} />
        </IconButton>
      </Tooltip>
    </animated.div>
  );
};

export default MisiurewiczPointMarker;
