import React from 'react';
import { Tooltip } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { MisiurewiczPointMarkerProps } from '../../common/info';
import { formatComplexNumber, prePeriod, PreperiodicPoint } from '../tansTheoremUtils';
import { animated } from 'react-spring';
import { screenScaleMultiplier } from '../../common/values';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import { XYType } from '../../common/types';
const BUTTON_SIZE = 40;
const BUTTON_SIZE_OVER_4 = BUTTON_SIZE / 4;
const THREE_BUTTON_SIZE_OVER_4 = 3 * BUTTON_SIZE_OVER_4;

//https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
const scale = (
  num: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number,
): number => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

export const colorBasedOnPreperiod = (
  m: PreperiodicPoint,
  highestPreperiod: number,
): string => {
  const redness = Math.round(scale(m.prePeriod, 0, highestPreperiod, 25, 255)).toString(
    16,
  );
  return `#E6${redness}00`;
};

export const complexNumberWithinView = (
  x: number,
  y: number,
  angle: number,
  zoom: number,
  boxWidth: number,
  boxHeight: number,
  c: XYType,
): boolean => {
  const distanceX = c[0] - x * screenScaleMultiplier;
  const distanceY = c[1] - y * screenScaleMultiplier;

  const horizontalDistanceFromCentre: number =
    zoom * Math.abs(distanceX * Math.cos(angle) - distanceY * Math.sin(angle));
  const verticalDistanceFromCentre: number =
    zoom * Math.abs(distanceX * Math.sin(angle) + distanceY * Math.cos(angle));

  return (
    horizontalDistanceFromCentre < boxWidth && verticalDistanceFromCentre < boxHeight
  );
};

export const complexToScreen = (
  x: number,
  y: number,
  angle: number,
  zoom: number,
  boxWidth: number,
  boxHeight: number,
  c: XYType,
): XYType => {
  const distanceX = c[0] - x * screenScaleMultiplier;
  const distanceY = c[1] - y * screenScaleMultiplier;
  return [
    (boxHeight / 2) *
      ((distanceX * Math.cos(angle) - distanceY * Math.sin(angle)) * zoom + boxWidth),
    (boxHeight / 2) *
      ((distanceX * Math.sin(angle) + distanceY * Math.cos(angle)) * zoom + 1),
  ];
};

const OrbitMarker = (props: MisiurewiczPointMarkerProps): JSX.Element => {
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
            if (
              props.show &&
              complexNumberWithinView(
                x,
                y,
                -theta.getValue(),
                z.getValue(),
                ASPECT_RATIO,
                1,
                props.m.point,
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
              THREE_BUTTON_SIZE_OVER_4
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
              BUTTON_SIZE_OVER_4
            );
          },
        ),
      }}
    >
      <Tooltip title={`${formatComplexNumber(props.m.point)}`} placement="top">
        <IconButton
          style={{
            color: colorBasedOnPreperiod(props.m, prePeriod([0, 0], props.m.c)),
          }}
        >
          {props.m.prePeriod === 0 ? (
            <FiberManualRecordOutlinedIcon
              style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
            />
          ) : (
            <FiberManualRecordIcon style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }} />
          )}
        </IconButton>
      </Tooltip>
    </animated.div>
  );
};

export default OrbitMarker;
