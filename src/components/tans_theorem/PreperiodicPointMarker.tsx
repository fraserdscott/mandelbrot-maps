import React from 'react';
import { Tooltip } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import {
  complexToScreenCoordinate,
  distance,
  PreperiodicPoint,
  withinBoundingBox,
} from '../tansTheoremUtils';
import { animated } from 'react-spring';
import { XYType } from '../../common/types';
import { PreperiodicPointMarkerProps } from '../../common/info';
const MARKER_SIZE = 40;
const BUTTON_OFFSET_X = (3 * MARKER_SIZE) / 4;
const BUTTON_OFFSET_Y = MARKER_SIZE / 4;

export const handleJuliaSelection = (
  focusedPointJulia: PreperiodicPoint,
  setFocusedPointJulia: React.Dispatch<React.SetStateAction<PreperiodicPoint>>,
): void => {
  setFocusedPointJulia(focusedPointJulia);
};

const MisiurewiczPointMarker = (props: PreperiodicPointMarkerProps): JSX.Element => {
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
              z.getValue() >= props.show_threshold &&
              withinBoundingBox(
                props.preperiodicPoint.point,
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
        left: props.viewerControl.xyCtrl[0].xy.interpolate(
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
                props.preperiodicPoint.point,
              )[0] +
              props.offset[0] -
              BUTTON_OFFSET_X
            );
          },
        ),
        bottom: props.viewerControl.xyCtrl[0].xy.interpolate(
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
                props.preperiodicPoint.point,
              )[1] +
              props.offset[1] -
              BUTTON_OFFSET_Y
            );
          },
        ),
      }}
    >
      <Tooltip title={`${props.preperiodicPoint.toString()}`} placement="top">
        <IconButton
          style={{
            color:
              distance(props.preperiodicPoint.point, props.focusedPointJulia.point) < 0.01
                ? '#FF5588'
                : '#FF0000',
          }}
          onClick={() => {
            handleJuliaSelection(props.preperiodicPoint, props.setFocusedPointJulia);
          }}
        >
          <RoomIcon style={{ width: MARKER_SIZE, height: MARKER_SIZE }} />
        </IconButton>
      </Tooltip>
    </animated.div>
  );
};

export default MisiurewiczPointMarker;
