import React from 'react';
import { Tooltip } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import { MisiurewiczPointMarkerProps } from '../../common/info';
import {
  complexToScreenCoordinate,
  distance,
  PreperiodicPoint,
  withinBoundingBox,
} from '../tansTheoremUtils';
import { animated } from 'react-spring';
import { AnimationStatus } from './MisiurewiczModeFragment';
import { XYType } from '../../common/types';
const BUTTON_SIZE = 40;
const BUTTON_OFFSET_Y = BUTTON_SIZE / 4;
const BUTTON_OFFSET_X = (3 * BUTTON_SIZE) / 4;

export const handleJuliaSelection = (
  focusedPointJulia: PreperiodicPoint,
  setFocusedPointJulia: React.Dispatch<React.SetStateAction<PreperiodicPoint>>,
): void => {
  setFocusedPointJulia(focusedPointJulia);
};

export const handleMandelbrotSelection = (
  focusedPointMandelbrot: PreperiodicPoint,
  setFocusedPointMandelbrot: React.Dispatch<React.SetStateAction<PreperiodicPoint>>,
  focusedPointJulia: PreperiodicPoint,
  setFocusedPointJulia: React.Dispatch<React.SetStateAction<PreperiodicPoint>>,
): void => {
  setFocusedPointMandelbrot(focusedPointMandelbrot);
  setFocusedPointJulia(
    new PreperiodicPoint(focusedPointMandelbrot.point, focusedPointJulia.point),
  );
};

export const animationNotTakingPlace = (animationState: AnimationStatus): boolean => {
  return (
    animationState === AnimationStatus.NO_ANIMATION ||
    animationState === AnimationStatus.SELECT_JULIA_POINT
  );
};

const MisiurewiczPointMarker = (props: MisiurewiczPointMarkerProps): JSX.Element => {
  const [{ z }] = props.mandelbrotControl.zoomCtrl;
  const [{ theta }] = props.mandelbrotControl.rotCtrl;

  const ASPECT_RATIO = props.mapWidth / props.mapHeight;

  return (
    <animated.div
      style={{
        zIndex: 100,
        position: 'absolute',
        visibility: props.mandelbrotControl.xyCtrl[0].xy.interpolate(
          // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
          (x, y) => {
            const centre: XYType = [x, y];
            if (
              z.getValue() >= props.show_threshold &&
              withinBoundingBox(
                props.m.point,
                centre,
                ASPECT_RATIO / z.getValue(),
                1 / z.getValue(),
                -theta.getValue(),
              )
            ) {
              return 'visible';
            } else {
              return 'hidden';
            }
          },
        ),
        left: props.mandelbrotControl.xyCtrl[0].xy.interpolate(
          // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
          (x, y) => {
            return (
              complexToScreenCoordinate(
                x,
                y,
                -theta.getValue(),
                z.getValue(),
                ASPECT_RATIO,
                props.mapHeight,
                props.m.point,
              )[0] +
              props.offsetX -
              BUTTON_OFFSET_X
            );
          },
        ),
        bottom: props.mandelbrotControl.xyCtrl[0].xy.interpolate(
          // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
          (x, y) => {
            return (
              complexToScreenCoordinate(
                x,
                y,
                -theta.getValue(),
                z.getValue(),
                ASPECT_RATIO,
                props.mapHeight,
                props.m.point,
              )[1] +
              props.offsetY -
              BUTTON_OFFSET_Y
            );
          },
        ),
      }}
    >
      <Tooltip title={`${props.m.toString()}`} placement="top">
        <IconButton
          style={{
            color:
              distance(props.m.point, props.focusedPointMandelbrot.point) < 0.01
                ? '#FF5588'
                : '#00FFFF',
          }}
          onClick={() => {
            handleMandelbrotSelection(
              props.m,
              props.setFocusedPointMandelbrot,
              props.m,
              props.setFocusedPointJulia,
            );
          }}
        >
          <RoomIcon style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }} />
        </IconButton>
      </Tooltip>
    </animated.div>
  );
};

export default MisiurewiczPointMarker;
