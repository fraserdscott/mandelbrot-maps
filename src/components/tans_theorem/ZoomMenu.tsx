import { Button, Typography, Card, Grid, Tooltip } from '@material-ui/core';
import React from 'react';
import { ZoomCardProps } from '../../common/info';
import { AnimationStatus } from './MisiurewiczModeFragment';
import { warpToPoint } from '../../common/utils';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import { ThetaType, ZoomType } from '../../common/types';
import { formatComplexNumber } from '../../common/complex_number_utils';
import { formatAngle } from '../tansTheoremUtils';

const INITIAL_ZOOM = 1;

const ZoomMenu = (props: ZoomCardProps): JSX.Element => {
  const zoomMandelbrot = () => {
    props.setAnimationState(AnimationStatus.ZOOM_J);
    const zoomM: ZoomType = props.focusedPointMandelbrot.uMagnitude * INITIAL_ZOOM;

    warpToPoint(props.mandelbrot, {
      xy: props.focusedPointMandelbrot.point,
      z: zoomM,
      theta: 0,
    });
  };

  const icons = {
    0: 'null',
    1: 'null',
    2: <ZoomInIcon />,
    3: <ZoomInIcon />,
    4: <RotateRightIcon />,
    5: <RotateRightIcon />,
    6: 'null',
  };

  const messages = {
    0: 'null',
    1: 'null',
    2: 'Magnify M by',
    3: 'Magnify J by',
    4: 'Rotate M by',
    5: 'Rotate J by',
    6: 'null',
  };

  const messages2 = {
    0: 'null',
    1: 'null',
    2: `|${formatComplexNumber(props.focusedPointMandelbrot.u, 1)}| = ${Math.round(
      props.focusedPointMandelbrot.uMagnitude,
    )}x`,
    3: `|${formatComplexNumber(props.focusedPointJulia.a, 1)}| = ${Math.round(
      props.focusedPointJulia.aMagnitude,
    )}x`,
    4: `arg(${formatComplexNumber(props.focusedPointMandelbrot.u, 1)}) = ${formatAngle(
      props.focusedPointMandelbrot.uAngle,
    )}`,
    5: `arg(${formatComplexNumber(props.focusedPointJulia.a, 1)}) = ${formatAngle(
      props.focusedPointJulia.aAngle,
    )}`,
    6: 'null',
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
    <Card
      style={{
        padding: 12,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 1,
        position: 'absolute',
        left: 0,
        top: 0,
      }}
    >
      <Grid container>
        <Grid item>{props.backButton()}</Grid>
        <Grid item>
          <Typography
            style={{
              marginBottom: 8,
            }}
            variant="h6"
            gutterBottom
          >
            {messages[props.animationState]}
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={1}>
        <Grid item>
          <Typography
            gutterBottom
            style={{
              fontSize: '1.2rem',
            }}
          >
            {messages2[props.animationState]}
          </Typography>
        </Grid>
        <Grid item>
          <Tooltip title="Coming soon!">
            <Button
              style={{
                fontSize: '0.5rem',
              }}
              color="primary"
            >
              How is this <br /> calculated?
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      <Button
        fullWidth
        variant="contained"
        style={{ marginTop: 8 }}
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
        startIcon={icons[props.animationState]}
      ></Button>
    </Card>
  );
};

export default ZoomMenu;
