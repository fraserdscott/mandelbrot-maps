import React from 'react';
import { Grow, Tooltip } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import { MisiurewiczPointMarkerProps } from '../../common/info';
import {
  prePeriod,
  complexNumbersEqual,
  formatMisiurewiczName,
  orbit,
} from '../tansTheoremUtils';

const gotoAlpha = false;

const MisiurewiczPointMarker = (props: MisiurewiczPointMarkerProps): JSX.Element => {
  const handlePointSelection = (chosenPoint: [number, number]) => {
    if (
      !complexNumbersEqual(chosenPoint, props.focusedPoint[0]) ||
      props.animationState === 0
    ) {
      if (gotoAlpha) {
        const alpha = orbit(chosenPoint, chosenPoint, prePeriod(chosenPoint));
        props.setFocusedPointJulia([alpha, 0]);
      } else {
        props.setFocusedPointJulia([chosenPoint, prePeriod(chosenPoint)]);
      }
      props.setAnimationState(-1);
      props.setFocusedPoint([chosenPoint, prePeriod(chosenPoint)]);
    }
  };

  return (
    <Grow in={props.show}>
      <Tooltip title={formatMisiurewiczName(props.m)} placement="top">
        <IconButton
          onClick={() => {
            handlePointSelection(props.m);
          }}
          color={
            complexNumbersEqual(props.m, props.focusedPoint[0]) ? 'primary' : 'secondary'
          }
        >
          <RoomIcon style={{ width: 40, height: 40 }} />
        </IconButton>
      </Tooltip>
    </Grow>
  );
};

export default MisiurewiczPointMarker;
