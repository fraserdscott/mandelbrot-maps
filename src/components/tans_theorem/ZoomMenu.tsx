import { Button, Typography } from '@material-ui/core';
import React from 'react';
import { InfoCardProps } from '../../common/info';
import { AnimationStatus } from './MisiurewiczModeFragment';
import { warpToPoint } from '../../common/utils';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { ThetaType, ZoomType } from '../../common/types';

const ZoomMenu = (props: InfoCardProps): JSX.Element => {
  const INITIAL_ZOOM = 1;

  const zoomMandelbrot = () => {
    props.setAnimationState(AnimationStatus.ZOOM_J);
    const zoomM: ZoomType = props.focusedPointMandelbrot.uMagnitude * INITIAL_ZOOM;

    warpToPoint(props.mandelbrot, {
      xy: props.focusedPointMandelbrot.point,
      z: zoomM,
      theta: 0,
    });
  };

  const zoomJulia = () => {
    props.setAnimationState(AnimationStatus.ROTATE_M);

    const zoomJ: ZoomType = props.focusedPointJulia.aMagnitude * INITIAL_ZOOM;

    warpToPoint(props.julia, { xy: props.focusedPointJulia.point, z: zoomJ, theta: 0 });
  };

  const rotateMandelbrot = () => {
    props.setAnimationState(AnimationStatus.ROTATE_J);

    const zoomM: ZoomType = props.focusedPointMandelbrot.uMagnitude * INITIAL_ZOOM;
    const thetaM: ThetaType = -props.focusedPointMandelbrot.uAngle;

    warpToPoint(props.mandelbrot, {
      xy: props.focusedPointMandelbrot.point,
      z: zoomM,
      theta: thetaM,
    });
  };

  const rotateJulia = () => {
    props.setAnimationState(AnimationStatus.PLAY);

    const zoomJ: ZoomType = props.focusedPointJulia.aMagnitude * INITIAL_ZOOM;
    const thetaJ: ThetaType = -props.focusedPointJulia.aAngle;

    warpToPoint(props.julia, {
      xy: props.focusedPointJulia.point,
      z: zoomJ,
      theta: thetaJ,
    });
  };

  return (
    <>
      <Typography
        style={{
          marginBottom: 8,
        }}
        variant="h6"
        gutterBottom
      ></Typography>
      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          switch (props.animationState) {
            case AnimationStatus.ZOOM_M:
              zoomMandelbrot();
              break;
            case AnimationStatus.ZOOM_J:
              zoomJulia();
              break;
            case AnimationStatus.ROTATE_M:
              rotateMandelbrot();
              break;
            case AnimationStatus.ROTATE_J:
              rotateJulia();
              break;
            default:
              break;
          }
        }}
        startIcon={<ArrowForwardIcon />}
      >
        Next
      </Button>
    </>
  );
};

export default ZoomMenu;
