import React from 'react';
import { Tooltip } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import { complexToScreenCoordinate, distance } from '../tansTheoremUtils';
import { PreperiodicPointMarkerProps } from '../../common/info';
const MARKER_SIZE = 40;
const BUTTON_OFFSET_X = (3 * MARKER_SIZE) / 4;
const BUTTON_OFFSET_Y = MARKER_SIZE / 4;

const MisiurewiczPointMarker = (props: PreperiodicPointMarkerProps): JSX.Element => {
  const [{ z }] = props.viewerControl.zoomCtrl;
  const [{ theta }] = props.viewerControl.rotCtrl;

  const ASPECT_RATIO = props.mapWidth / props.mapHeight;

  const coord = complexToScreenCoordinate(
    props.viewerControl.xyCtrl[0].xy.getValue(),
    -theta.getValue(),
    z.getValue(),
    ASPECT_RATIO,
    props.mapHeight,
    props.preperiodicPoint.point,
  );

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
      <Tooltip title={`${props.preperiodicPoint.toString()}`} placement="top">
        <IconButton
          style={{
            color:
              distance(props.preperiodicPoint.point, props.focusedPointJulia.point) < 0.01
                ? '#FF5588'
                : '#FF0000',
          }}
          onClick={() => {
            props.handleSimilarPointSelection(props.preperiodicPoint);
          }}
        >
          <RoomIcon style={{ width: MARKER_SIZE, height: MARKER_SIZE }} />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default MisiurewiczPointMarker;
