import React from 'react';
import { Tooltip } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import { MisiurewiczPointMarkerProps } from '../../common/info';
import {
  complexToScreenCoordinate,
  distance,
  PreperiodicPoint,
  similarPoints,
} from '../tansTheoremUtils';

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

const MisiurewiczPointMarker = (props: MisiurewiczPointMarkerProps): JSX.Element => {
  const [{ z }] = props.mandelbrotControl.zoomCtrl;
  const [{ theta }] = props.mandelbrotControl.rotCtrl;

  const ASPECT_RATIO = props.mapWidth / props.mapHeight;

  const coord = complexToScreenCoordinate(
    props.mandelbrotControl.xyCtrl[0].xy.getValue()[0],
    props.mandelbrotControl.xyCtrl[0].xy.getValue()[1],
    -theta.getValue(),
    z.getValue(),
    ASPECT_RATIO,
    props.mapHeight,
    props.m.point,
  );

  return (
    <div
      style={{
        zIndex: 100,
        position: 'absolute',
        left: coord[0] + props.offsetX - BUTTON_OFFSET_X,
        bottom: coord[1] + props.offsetY - BUTTON_OFFSET_Y,
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
            props.setSimilarPointsJulia(
              similarPoints(props.m, 4).sort((a, b) => a.prePeriod - b.prePeriod),
            );
          }}
        >
          <RoomIcon style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }} />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default MisiurewiczPointMarker;
