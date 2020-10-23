import React from 'react';
import { Grow } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import { screenScaleMultiplier } from '../../common/values';
import { MisiurewiczPointMarkerProps } from '../../common/info';
import { animated } from 'react-spring';
import { warpToPoint } from '../utils';
import { magnificationMandelbrot, magnificationJulia } from '../tansTheoremUtils';

const MisiurewiczPointMarker = (props: MisiurewiczPointMarkerProps): JSX.Element => {
  const [{ z }, setControlZoom] = props.mandelbrot.zoomCtrl;
  const width = 640;
  const height = 610;

  const handlePointSelection = (chosenPoint: [number, number]) => {
    if (
      (chosenPoint[0] !== props.focusedPoint[0] &&
        chosenPoint[1] !== props.focusedPoint[1]) ||
      props.animationState === 0
    ) {
      props.setAnimationState(0);
      props.setFocusedPoint(chosenPoint);
      props.setMagState(1);

      const zoomM: number = magnificationMandelbrot(props.focusedPoint) * 1;
      const zoomJ: number = magnificationJulia(props.focusedPoint) * 1;

      warpToPoint(props.mandelbrot, { xy: chosenPoint, z: zoomM, theta: 0 });
      warpToPoint(props.julia, { xy: chosenPoint, z: zoomJ, theta: 0 });
    }
  };

  return (
    <Grow in={props.show}>
      <animated.div
        style={{
          position: 'absolute',
          left: props.mandelbrot.xyCtrl[0].xy.interpolate(
            // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
            (x, y) =>
              width / 2 +
              (width / 2) * (props.m[0] - x * screenScaleMultiplier) * z.getValue() -
              3 * (40 / 4),
          ),
          bottom: props.mandelbrot.xyCtrl[0].xy.interpolate(
            // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
            (x, y) =>
              height / 2 +
              (height / 2) * (props.m[1] - y * screenScaleMultiplier) * z.getValue() -
              40 / 4,
          ),
          width: 'auto',
        }}
      >
        <div
          style={{
            width: 'auto',
            zIndex: 100,
            position: 'relative',
          }}
        >
          <IconButton
            onClick={() => {
              handlePointSelection(props.m);
            }}
            color={
              props.m[0] === props.focusedPoint[0] && props.m[1] === props.focusedPoint[1]
                ? 'secondary'
                : 'primary'
            }
          >
            <RoomIcon style={{ width: 40, height: 40 }} />
          </IconButton>
        </div>
      </animated.div>
    </Grow>
  );
};

export default MisiurewiczPointMarker;
