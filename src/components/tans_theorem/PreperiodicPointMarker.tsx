import React from 'react';
import { Tooltip } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import {
  complexToScreenCoordinate,
  distance,
  PreperiodicPoint,
} from '../tansTheoremUtils';
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

  const coord = complexToScreenCoordinate(
    props.viewerControl.xyCtrl[0].xy.getValue()[0],
    props.viewerControl.xyCtrl[0].xy.getValue()[1],
    -theta.getValue(),
    z.getValue(),
    ASPECT_RATIO,
    props.mapHeight,
    props.preperiodicPoint.point,
  );

  return (
    <div
      style={{
        zIndex: 100,
        position: 'absolute',
        left: coord[0] + props.offset[0] - BUTTON_OFFSET_X,
        bottom: coord[1] + props.offset[1] - BUTTON_OFFSET_Y,
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
    </div>
  );
};

export default MisiurewiczPointMarker;
