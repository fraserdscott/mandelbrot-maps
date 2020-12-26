import React from 'react';
import { Tooltip } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import { MisiurewiczPointMarkerProps } from '../../common/info';
import { MAX_DEPTH, PreperiodicPoint } from '../tansTheoremUtils';
import { animated } from 'react-spring';
import { AnimationStatus } from './MisiurewiczModeDiv';
import {
  colorBasedOnPreperiod,
  pointWithinBoundingBox,
  complexToScreen,
} from './OrbitMarker';
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
    animationState === AnimationStatus.SELECT_JULIA_POINT ||
    animationState === AnimationStatus.SHOW_ORBIT
  );
};

const MisiurewiczPointMarker = (props: MisiurewiczPointMarkerProps): JSX.Element => {
  const [{ z }] = props.viewerControl.zoomCtrl;
  const [{ theta }] = props.viewerControl.rotCtrl;

  const ASPECT_RATIO = props.mapWidth / props.mapHeight;

  return (
    <animated.div
      style={{
        zIndex: 100,
        position: 'absolute',
        visibility: props.viewerControl.xyCtrl[0].xy.interpolate(
          // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
          (x, y) => {
            const centre: XYType = [x, y];
            if (
              props.show &&
              pointWithinBoundingBox(
                props.m.point,
                centre,
                ASPECT_RATIO / z.getValue(),
                1 / z.getValue(),
                -theta.getValue(),
              ) &&
              props.SHOW_POINT_THRESHOLD <= z.getValue()
            ) {
              return 'visible';
            } else {
              return 'hidden';
            }
          },
        ),
        left: props.viewerControl.xyCtrl[0].xy.interpolate(
          // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
          (x, y) => {
            return (
              complexToScreen(
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
        bottom: props.viewerControl.xyCtrl[0].xy.interpolate(
          // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
          (x, y) => {
            return (
              complexToScreen(
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
      {props.offsetX === 0 ? (
        <Tooltip title={`${props.m.toString()}`} placement="top">
          <IconButton
            onClick={() => {
              if (props.offsetX === 0) {
                handleMandelbrotSelection(
                  props.m,
                  props.setFocusedPoint,
                  props.m,
                  props.setFocusedPointJulia,
                );
              } else {
                handleJuliaSelection(props.m, props.setFocusedPointJulia);
              }
            }}
            color={props.color}
          >
            <RoomIcon style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }} />
          </IconButton>
        </Tooltip>
      ) : null}
      {props.offsetX > 0 ? (
        <Tooltip title={`${props.m.toString()}`} placement="top">
          <IconButton
            style={{
              color: colorBasedOnPreperiod(props.m, MAX_DEPTH + 1), // fixme make the max the depth of search
            }}
            onClick={() => {
              if (props.offsetX === 0) {
                handleMandelbrotSelection(
                  props.m,
                  props.setFocusedPoint,
                  props.m,
                  props.setFocusedPointJulia,
                );
              } else {
                handleJuliaSelection(props.m, props.setFocusedPointJulia);
              }
            }}
            color={props.color}
          >
            <RoomIcon style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }} />
          </IconButton>
        </Tooltip>
      ) : null}
    </animated.div>
  );
};

export default MisiurewiczPointMarker;
