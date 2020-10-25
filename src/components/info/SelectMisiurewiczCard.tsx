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
  magnitude,
  findA,
  findU,
  complexNumbersEqual,
  formatMisiurewiczName,
  formatComplexNumber,
  orbit,
} from '../tansTheoremUtils';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

export const misiurewiczPoints: [number, number][] = [
  [-2, 0],
  [-1.543, 0],
  [-0.1011, 0.95629],
  [-1.7712568, 0.0661614],
  [-0.5621929, 0.6427984],
  [0.0016429, -0.8224842],
  [0.3482524, 0.5552302],
  [0.0135779, 0.6556269],
];

const gotoAlpha = true; // the point alpha has the same similairty properites

function getSteps() {
  return ['Translate M', 'Translate J', 'Zoom M', 'Rotate M', 'Rotate J'];
}

const SelectMisiurewiczCard = (props: SelectMisiurewiczCardProps): JSX.Element => {
  const translateMandelbrot = (c: [number, number]) => {
    props.setAnimationState(1);
    warpToPoint(props.mandelbrot, { xy: props.focusedPoint[0], z: 2, theta: 0 });
  };

  const translateJulia = () => {
    props.setAnimationState(2);
    warpToPoint(props.julia, { xy: props.focusedPointJulia[0], z: 2, theta: 0 });
  };

  const zoomMandelbrot = () => {
    props.setAnimationState(3);
    const u: [number, number] = findU(props.focusedPoint[0], props.focusedPoint[1], 1);
    const a: [number, number] = findA(props.focusedPoint[0], props.focusedPoint[1]);

    const zoomM: number = (magnitude(u) / magnitude(a)) * 2;

    warpToPoint(props.mandelbrot, { xy: props.focusedPoint[0], z: zoomM, theta: 0 });
  };

  const rotateMandelbrot = () => {
    props.setAnimationState(4);
    const u: [number, number] = findU(props.focusedPoint[0], props.focusedPoint[1], 1);
    const a: [number, number] = findA(props.focusedPoint[0], props.focusedPoint[1]);

    const zoomM: number = (magnitude(u) / magnitude(a)) * 2;
    const thetaM = -Math.atan2(u[1], u[0]);

    warpToPoint(props.mandelbrot, { xy: props.focusedPoint[0], z: zoomM, theta: thetaM });
  };

  const rotateJulia = () => {
    props.setAnimationState(5);
    const a: [number, number] = findA(
      props.focusedPointJulia[0],
      props.focusedPointJulia[1],
    );

    const zoomJ = 2;
    const thetaJ = -Math.atan2(a[1], a[0]);

    warpToPoint(props.julia, { xy: props.focusedPointJulia[0], z: zoomJ, theta: thetaJ });
  };

  const rotateAndZoom = (c: [number, number], mag: number, useAngle: boolean) => {
    const u: [number, number] = findU(props.focusedPoint[0], props.focusedPoint[1], 1);
    const a: [number, number] = findA(
      props.focusedPointJulia[0],
      props.focusedPointJulia[1],
    );

    const zoomM: number = (magnitude(u) / magnitude(a)) * mag;
    const zoomJ: number = mag;
    let thetaM = 0;
    let thetaJ = 0;
    if (useAngle === true) {
      thetaM = -Math.atan2(u[1], u[0]);
      thetaJ = -Math.atan2(a[1], a[0]);
    }

    warpToPoint(props.mandelbrot, { xy: props.focusedPoint[0], z: zoomM, theta: thetaM });
    warpToPoint(props.julia, { xy: props.focusedPointJulia[0], z: zoomJ, theta: thetaJ });
  };

  const handlePointSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
    const posStr = (event.target.value as string).split(',');
    const chosenPoint: [number, number] = [parseFloat(posStr[0]), parseFloat(posStr[1])];

    if (!complexNumbersEqual(chosenPoint, props.focusedPoint[0])) {
      props.setFocusedPoint([chosenPoint, prePeriod(chosenPoint)]);
      if (gotoAlpha) {
        props.setFocusedPointJulia([
          orbit(chosenPoint, chosenPoint, prePeriod(chosenPoint)),
          0,
        ]);
      } else {
        props.setFocusedPointJulia([chosenPoint, prePeriod(chosenPoint)]);
      }
      props.setMagState(1);
      props.setAnimationState(-1);
    }
  };

  const handleSetMagnification = (event: any, newValue: number | number[]) => {
    props.setMagState(newValue as number);

    rotateAndZoom(props.focusedPoint[0], newValue as number, true);
  };

  const steps = getSteps();

  return (
    <Grow in={props.show}>
      <Grid container direction="column" alignItems="flex-start">
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
              value={props.focusedPoint.toString()}
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
        {props.animationState === -1
          ? MisiurewiczPointInfoCard(props.focusedPoint[0], props.focusedPointJulia[0])
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
          {props.animationState === -1 ? (
            <Button
              fullWidth
              style={{ marginBottom: 8, marginTop: 8 }}
              onClick={() => props.setAnimationState(0)}
              startIcon={<ArrowForwardIcon />}
            >
              Start animation
            </Button>
          ) : null}
          {props.animationState >= 0 ? (
            <Card
              style={{
                width: 'auto',
                zIndex: 1300,
                position: 'relative',
                padding: 8,
                display: 'flex',
                marginTop: 8,
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
                style={{ marginBottom: 8, marginTop: 8 }}
                onClick={() => translateMandelbrot(props.focusedPoint[0])}
                startIcon={<ArrowForwardIcon />}
              >
                translate Mandelbrot set
              </Button>
            ) : null}
            {props.animationState === 1 ? (
              <Button
                fullWidth
                style={{ marginBottom: 8, marginTop: 8 }}
                onClick={() => translateJulia()}
                startIcon={<ThreeSixtyIcon />}
              >
                translate Julia set
              </Button>
            ) : null}
            {props.animationState === 2 ? (
              <Button
                fullWidth
                style={{ marginBottom: 8, marginTop: 8 }}
                onClick={() => zoomMandelbrot()}
                startIcon={<ThreeSixtyIcon />}
              >
                zoom Mandelbrot set
              </Button>
            ) : null}
            {props.animationState === 3 ? (
              <Button
                fullWidth
                style={{ marginBottom: 8, marginTop: 8 }}
                onClick={() => rotateMandelbrot()}
                startIcon={<ThreeSixtyIcon />}
              >
                rotate Mandelbrot set
              </Button>
            ) : null}
            {props.animationState === 4 ? (
              <Button
                fullWidth
                style={{ marginBottom: 8, marginTop: 8 }}
                onClick={() => rotateJulia()}
                startIcon={<ThreeSixtyIcon />}
              >
                rotate julia set
              </Button>
            ) : null}
          </Card>
        </div>
        {props.animationState === 5 ? (
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
                      height: '25vh',
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
