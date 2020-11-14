import {
  Button,
  Card,
  Grid,
  Grow,
  Slider,
  InputLabel,
  Select,
  Step,
  StepLabel,
  Stepper,
  IconButton,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import CancelIcon from '@material-ui/icons/Cancel';
import React from 'react';
import MisiurewiczPointInfoCard from './MisiurewiczPointInfoCard';
import { SelectMisiurewiczCardProps } from '../../common/info';
import { warpToPoint } from '../utils';
import {
  prePeriod,
  period,
  magnitude,
  findA,
  findU,
  complexNumbersEqual,
  formatMisiurewiczName,
  formatComplexNumber,
  orbit,
  round,
  formatAngle,
} from '../tansTheoremUtils';

export const misiurewiczPoints: [number, number][] = [
  [-2, 0],
  [0, 1],
  [-1.543, 0],
  [-0.1011, 0.95629],
  [-1.7712568, 0.0661614],
  [-0.5621929, 0.6427984],
  [0.3482524, 0.5552302],
  [0.0135779, 0.6556269],
  [-0.3739735, 0.6597704],
  [-1.1623416, 0.2923689],
  [-1.3537332, 0.0563214],
  [-0.2984863, 0.6584332],
  [-0.258307, 0.6562222],
  [-0.2333882, 0.6545567],
  [-0.216439, 0.6534318],
  [-0.3482979, 0.661152],
  [-0.3578942, 0.6777376],
  [-0.3763498, 0.6755535],
  [-0.3915179, 0.6778884],
  [0.4653340747035333, +0.34699996757740714],
];

const ITERATEFORJULIA = 0; // c0 is similar to all of it's iterates in the Mandelbrot set
// I'm not sure if this holds for p > 1 as the derivative will be computed differently.
const INITIALZOOM = 1;

function getSteps() {
  return ['Translate M', 'Translate J', 'Zoom M', 'Zoom J', 'Rotate M', 'Rotate J'];
}

const SelectMisiurewiczCard = (props: SelectMisiurewiczCardProps): JSX.Element => {
  const translateMandelbrot = () => {
    props.setAnimationState(1);
    warpToPoint(props.mandelbrot, {
      xy: props.focusedPoint[0],
      z: INITIALZOOM,
      theta: 0,
    });
  };

  const translateJulia = () => {
    props.setAnimationState(2);
    warpToPoint(props.julia, {
      xy: props.focusedPointJulia[0],
      z: INITIALZOOM,
      theta: 0,
    });
  };

  const zoomMandelbrot = () => {
    props.setAnimationState(3);
    const u: [number, number] = findU(
      props.focusedPoint[0],
      props.focusedPoint[1],
      period(props.focusedPoint[0]),
    );

    const zoomM: number = magnitude(u) * INITIALZOOM;

    warpToPoint(props.mandelbrot, { xy: props.focusedPoint[0], z: zoomM, theta: 0 });
  };

  const zoomJulia = () => {
    props.setAnimationState(4);
    const a: [number, number] = findA(
      props.focusedPoint[0],
      props.focusedPointJulia[0],
      props.focusedPointJulia[1],
    );

    const zoomJ: number = magnitude(a) * INITIALZOOM;

    warpToPoint(props.julia, { xy: props.focusedPointJulia[0], z: zoomJ, theta: 0 });
  };

  const rotateMandelbrot = () => {
    props.setAnimationState(5);
    const u: [number, number] = findU(
      props.focusedPoint[0],
      props.focusedPoint[1],
      period(props.focusedPoint[0]),
    );

    const zoomM: number = magnitude(u) * INITIALZOOM;
    const thetaM = -Math.atan2(u[1], u[0]);

    warpToPoint(props.mandelbrot, { xy: props.focusedPoint[0], z: zoomM, theta: thetaM });
  };

  const rotateJulia = () => {
    props.setAnimationState(6);
    const a: [number, number] = findA(
      props.focusedPoint[0],
      props.focusedPointJulia[0],
      props.focusedPointJulia[1],
    );

    const zoomJ: number = magnitude(a) * INITIALZOOM;
    const thetaJ = -Math.atan2(a[1], a[0]);

    warpToPoint(props.julia, {
      xy: props.focusedPointJulia[0],
      z: zoomJ,
      theta: thetaJ,
    });
  };

  const rotateAndZoom = (mag: number) => {
    props.setMagState(mag);

    const u: [number, number] = findU(
      props.focusedPoint[0],
      props.focusedPoint[1],
      period(props.focusedPoint[0]),
    );
    const a: [number, number] = findA(
      props.focusedPoint[0],
      props.focusedPointJulia[0],
      props.focusedPointJulia[1],
    );

    const zoomM: number = magnitude(u) * mag;
    const zoomJ: number = magnitude(a) * mag;
    const thetaM = -Math.atan2(u[1], u[0]);
    const thetaJ = -Math.atan2(a[1], a[0]);

    warpToPoint(props.mandelbrot, { xy: props.focusedPoint[0], z: zoomM, theta: thetaM });
    warpToPoint(props.julia, { xy: props.focusedPointJulia[0], z: zoomJ, theta: thetaJ });
  };

  const handlePointSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
    const posStr = (event.target.value as string).split(',');
    const chosenPoint: [number, number] = [parseFloat(posStr[0]), parseFloat(posStr[1])];

    if (!complexNumbersEqual(chosenPoint, props.focusedPoint[0])) {
      props.setFocusedPoint([chosenPoint, prePeriod(chosenPoint)]);
      props.setFocusedPointJulia([
        orbit(chosenPoint, chosenPoint, ITERATEFORJULIA),
        prePeriod(chosenPoint) - ITERATEFORJULIA,
      ]);
      props.setMagState(1);
      props.setAnimationState(-1);
    }
  };

  const handleSetMagnification = (event: any, newValue: number | number[]) => {
    rotateAndZoom(newValue as number);
  };

  const steps = getSteps();

  return (
    <Grow in={props.show}>
      <Grid container direction="column" alignItems="flex-start">
        {props.animationState === -1 ? (
          <Card
            style={{
              width: 'auto',
              zIndex: 1300,
              position: 'relative',
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 1,
              marginRight: 8,
            }}
          >
            <Grid container direction="column" alignItems="center">
              <InputLabel htmlFor="select-multiple-native">Misiurewicz points</InputLabel>
              <Select
                native
                onChange={handlePointSelection}
                inputProps={{
                  id: 'select-multiple-native',
                }}
              >
                {misiurewiczPoints.map((m) => (
                  <option key={m.toString()} value={m.toString()}>
                    {formatMisiurewiczName(m)} = {formatComplexNumber(m)}
                  </option>
                ))}
              </Select>
            </Grid>
          </Card>
        ) : null}
        {props.animationState === -1
          ? MisiurewiczPointInfoCard(
              props.focusedPoint[0],
              props.setAnimationState,
              props.mandelbrot,
            )
          : null}
        <div
          style={{
            width: 'auto',
            zIndex: 1300,
            position: 'relative',
            padding: 8,
            display: 'flex',
            marginTop: 8,
            flexDirection: 'column',
            flexShrink: 1,
          }}
        >
          {props.animationState >= 0 ? (
            <Card
              style={{
                width: 'auto',
                zIndex: 1300,
                position: 'relative',
                padding: 8,
                display: 'flex',
                flexDirection: 'row',
                flexShrink: 1,
              }}
            >
              <Stepper activeStep={props.animationState}>
                {steps.map((label, index) => {
                  const stepProps: { completed?: boolean } = {};
                  const labelProps: { optional?: React.ReactNode } = {};
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <IconButton onClick={() => props.setAnimationState(-1)}>
                <CancelIcon />
              </IconButton>
            </Card>
          ) : null}

          <Card>
            {props.animationState === 0 ? (
              <Button
                fullWidth
                onClick={() => translateMandelbrot()}
                startIcon={<ArrowForwardIcon />}
              >
                {`Translate Mandelbrot set to ${formatComplexNumber(
                  props.focusedPoint[0],
                )}`}
              </Button>
            ) : null}
            {props.animationState === 1 ? (
              <Button
                fullWidth
                onClick={() => translateJulia()}
                startIcon={<ArrowForwardIcon />}
              >
                {`Translate Julia set to ${formatComplexNumber(
                  props.focusedPointJulia[0],
                )}`}
              </Button>
            ) : null}
            {props.animationState === 2 ? (
              <Button
                fullWidth
                onClick={() => zoomMandelbrot()}
                startIcon={<ZoomInIcon />}
              >
                {`zoom Mandelbrot set by ${round(
                  magnitude(
                    findU(
                      props.focusedPoint[0],
                      props.focusedPoint[1],
                      period(props.focusedPoint[0]),
                    ),
                  ),
                  1,
                )}x`}
              </Button>
            ) : null}
            {props.animationState === 3 ? (
              <Button fullWidth onClick={() => zoomJulia()} startIcon={<ZoomInIcon />}>
                {`Zoom Julia set by ${round(
                  magnitude(
                    findA(
                      props.focusedPoint[0],
                      props.focusedPointJulia[0],
                      props.focusedPointJulia[1],
                    ),
                  ),
                  1,
                )}x`}
              </Button>
            ) : null}
            {props.animationState === 4 ? (
              <Button
                fullWidth
                onClick={() => rotateMandelbrot()}
                startIcon={<ThreeSixtyIcon />}
              >
                {`rotate Mandelbrot set by ${formatAngle(
                  Math.atan2(
                    findU(
                      props.focusedPoint[0],
                      props.focusedPoint[1],
                      period(props.focusedPoint[0]),
                    )[1],
                    findU(
                      props.focusedPoint[0],
                      props.focusedPoint[1],
                      period(props.focusedPoint[0]),
                    )[0],
                  ),
                )}`}
              </Button>
            ) : null}
            {props.animationState === 5 ? (
              <Button
                fullWidth
                style={{ marginBottom: 8, marginTop: 8 }}
                onClick={() => rotateJulia()}
                startIcon={<ThreeSixtyIcon />}
              >
                {`rotate julia set by ${formatAngle(
                  Math.atan2(
                    findA(
                      props.focusedPoint[0],
                      props.focusedPointJulia[0],
                      props.focusedPointJulia[1],
                    )[1],
                    findA(
                      props.focusedPoint[0],
                      props.focusedPointJulia[0],
                      props.focusedPointJulia[1],
                    )[0],
                  ),
                )}`}
              </Button>
            ) : null}
          </Card>
        </div>
        {props.animationState === 6 ? (
          <Card
            style={{
              width: 'auto',
              zIndex: 1300,
              position: 'relative',
              padding: 8,
              display: 'flex',
              marginTop: 8,
              flexDirection: 'column',
              flexShrink: 1,
            }}
          >
            <Grid container direction="column" alignItems="center">
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <ZoomInIcon />
                </Grid>
                <Grid item xs>
                  <Slider
                    value={props.mag}
                    onChange={handleSetMagnification}
                    style={{
                      height: '40vh',
                    }}
                    min={1}
                    max={1000}
                    track={false}
                    orientation="vertical"
                    aria-labelledby="continuous-slider"
                    valueLabelDisplay="auto"
                  />{' '}
                </Grid>
                <Grid item>
                  <ZoomOutIcon />
                </Grid>
              </Grid>
            </Grid>
          </Card>
        ) : null}
      </Grid>
    </Grow>
  );
};

export default SelectMisiurewiczCard;
