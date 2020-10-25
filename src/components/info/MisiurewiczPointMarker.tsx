import React from 'react';
import { Grow, Tooltip } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import { screenScaleMultiplier } from '../../common/values';
import { MisiurewiczPointMarkerProps } from '../../common/info';
import { animated } from 'react-spring';
import {
  prePeriod,
  complexNumbersEqual,
  formatMisiurewiczName,
  orbit,
} from '../tansTheoremUtils';

const gotoAlpha = false;

const MisiurewiczPointMarker = (props: MisiurewiczPointMarkerProps): JSX.Element => {
  const [{ z }, setControlZoom] = props.mandelbrot.zoomCtrl;
  const width = 640;
  const height = 610;

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

  const complexToScreenCoord = (center: number, point: number, measure: number) => {
    return (measure / 2) * (1 + (point - center * screenScaleMultiplier) * z.getValue());
  };

  return (
    <Grow in={props.show}>
      <animated.div
        style={{
          position: 'absolute',
          left: props.mandelbrot.xyCtrl[0].xy.interpolate(
            // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
            (x, y) => complexToScreenCoord(x, props.m[0], width) - (3 * 40) / 4,
          ),
          bottom: props.mandelbrot.xyCtrl[0].xy.interpolate(
            // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
            (x, y) => complexToScreenCoord(y, props.m[1], height) - 40 / 4,
          ),
          width: 'auto',
        }}
      >
        <div
          style={{
            zIndex: 100,
            position: 'relative',
          }}
        >
          <Tooltip
            title={formatMisiurewiczName(props.m)}
            aria-label="add"
            placement="top"
          >
            <IconButton
              onClick={() => {
                handlePointSelection(props.m);
              }}
              color={
                complexNumbersEqual(props.m, props.focusedPoint[0])
                  ? 'secondary'
                  : 'primary'
              }
            >
              <RoomIcon style={{ width: 40, height: 40 }} />
            </IconButton>
          </Tooltip>
        </div>
      </animated.div>
    </Grow>
  );
};

export default MisiurewiczPointMarker;
