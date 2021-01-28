import { Card, Stepper, StepLabel, Step, Button, IconButton } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import React from 'react';
import {
  formatAngle,
  formatComplexNumber,
  PreperiodicPoint,
  round,
} from '../tansTheoremUtils';
import { warpToPoint } from '../../common/utils';
import { MisiurewiczInfoCardProps } from '../../common/info';
import { AnimationStatus } from './MisiurewiczModeFragment';
import { ThetaType, ZoomType } from '../../common/types';
import ArrowBackwardIcon from '@material-ui/icons/ArrowBack';

function getSteps(c: PreperiodicPoint, cj: PreperiodicPoint) {
  return [
    ['Translate Mandelbrot', `to ${formatComplexNumber(c.point)}`],
    ['Translate Julia', `to ${formatComplexNumber(cj.point)}`],
    ['Zoom Mandelbrot', `by ${round(c.uMagnitude, 1)}x`],
    ['Zoom Julia', `by ${round(cj.aMagnitude, 1)}x`],
    ['Rotate Mandelbrot', `by ${formatAngle(c.uAngle)}`],
    ['Rotate Julia', `by ${formatAngle(cj.aAngle)}`],
  ];
}

const INITIAL_ZOOM = 1;

const SimilarityAnimationCard = (props: MisiurewiczInfoCardProps): JSX.Element => {
  const steps = getSteps(props.focusedPoint, props.focusedPointJulia);

  const translateMandelbrot = () => {
    props.setAnimationState(AnimationStatus.TRANSLATE_J);
    warpToPoint(props.mandelbrot, {
      xy: props.focusedPoint.point,
      z: INITIAL_ZOOM,
      theta: 0,
    });
  };

  const translateJulia = () => {
    props.setAnimationState(AnimationStatus.ZOOM_M);
    warpToPoint(props.julia, {
      xy: props.focusedPointJulia.point,
      z: INITIAL_ZOOM,
      theta: 0,
    });
  };

  const zoomMandelbrot = () => {
    props.setAnimationState(AnimationStatus.ZOOM_J);
    const zoomM: ZoomType = props.focusedPoint.uMagnitude * INITIAL_ZOOM;

    warpToPoint(props.mandelbrot, { xy: props.focusedPoint.point, z: zoomM, theta: 0 });
  };

  const zoomJulia = () => {
    props.setAnimationState(AnimationStatus.ROTATE_M);

    const zoomJ: ZoomType = props.focusedPointJulia.aMagnitude * INITIAL_ZOOM;

    warpToPoint(props.julia, { xy: props.focusedPointJulia.point, z: zoomJ, theta: 0 });
  };

  const rotateMandelbrot = () => {
    props.setAnimationState(AnimationStatus.ROTATE_J);

    const zoomM: ZoomType = props.focusedPoint.uMagnitude * INITIAL_ZOOM;
    const thetaM: ThetaType = -props.focusedPoint.uAngle;

    warpToPoint(props.mandelbrot, {
      xy: props.focusedPoint.point,
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
        zIndex: 1300,
        position: 'absolute',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 1,
      }}
    >
      <IconButton
        onClick={() => {
          props.setAnimationState(AnimationStatus.SELECT_JULIA_POINT);
          warpToPoint(props.mandelbrot, {
            xy: props.focusedPoint.point,
            z: props.focusedPoint.uMagnitude,
            theta: 0,
          });
          warpToPoint(props.julia, {
            xy: [0, 0],
            z: 0.5,
            theta: 0,
          });
        }}
      >
        <ArrowBackwardIcon />
      </IconButton>
      <Stepper activeStep={props.animationState.valueOf()} orientation="vertical">
        {steps.map((label) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          labelProps.optional = label[1];
          return (
            <Step key={label[0]} {...stepProps}>
              <StepLabel {...labelProps}>{label[0]}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          switch (props.animationState) {
            case AnimationStatus.TRANSLATE_M:
              translateMandelbrot();
              break;
            case AnimationStatus.TRANSLATE_J:
              translateJulia();
              break;
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
        {`Next`}
      </Button>
    </Card>
  );
};

export default SimilarityAnimationCard;
