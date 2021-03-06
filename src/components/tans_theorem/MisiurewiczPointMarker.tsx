import React from 'react';
import { Tooltip } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import { MisiurewiczPointMarkerProps } from '../../common/info';
import { complexToScreenCoordinate, distance } from '../tansTheoremUtils';

const BUTTON_SIZE = 40;
const BUTTON_OFFSET_X = (3 * BUTTON_SIZE) / 4;
const BUTTON_OFFSET_Y = BUTTON_SIZE / 4;
const FOCUSED_POINT_COLOR = '#FF5588';
const UNFOCUSED_POINT_COLOR = '#00FFFF';

const MisiurewiczPointMarker = (props: MisiurewiczPointMarkerProps): JSX.Element => {
  const [{ z }] = props.mandelbrotControl.zoomCtrl;
  const [{ theta }] = props.mandelbrotControl.rotCtrl;

  const ASPECT_RATIO = props.mapWidth / props.mapHeight;

  const coord = complexToScreenCoordinate(
    props.mandelbrotControl.xyCtrl[0].xy.getValue(),
    -theta.getValue(),
    z.getValue(),
    ASPECT_RATIO,
    props.mapHeight,
    props.m.point,
  );

  const isFocusedPoint =
    distance(props.m.point, props.focusedPointMandelbrot.point) < 0.01;

  return (
    <div
      style={{
        zIndex: 1400,
        position: 'absolute',
        visibility: 'visible',
        left: coord[0] - BUTTON_OFFSET_X,
        bottom: coord[1] - BUTTON_OFFSET_Y,
      }}
    >
      <Tooltip title={`${props.m.toString()}`} placement="top">
        <IconButton
          style={{
            color: isFocusedPoint ? FOCUSED_POINT_COLOR : UNFOCUSED_POINT_COLOR,
          }}
          onClick={() => {
            props.handleMandelbrotSelection(props.m, props.m);
          }}
        >
          <RoomIcon style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }} />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default MisiurewiczPointMarker;
