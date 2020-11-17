import React from 'react';
import { Grow, Tooltip } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import { MisiurewiczPointMarkerProps } from '../../common/info';
import { complexNumbersEqual } from '../tansTheoremUtils';

const MisiurewiczPointMarker = (props: MisiurewiczPointMarkerProps): JSX.Element => {
  return (
    <Grow in={props.show}>
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
          <RoomIcon style={{ width: 40, height: 40 }} />
        </IconButton>
      </Tooltip>
    </Grow>
  );
};

export default MisiurewiczPointMarker;
