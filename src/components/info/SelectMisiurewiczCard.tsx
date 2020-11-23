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
  Typography,
  Tooltip,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackwardIcon from '@material-ui/icons/ArrowBack';
import InfoIcon from '@material-ui/icons/Info';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import React from 'react';
import MisiurewiczPointInfoCard from './MisiurewiczPointInfoCard';
import { SelectMisiurewiczCardProps } from '../../common/info';
import { warpToPoint } from '../../common/utils';
import { AnimationStatus } from './MisiurewiczModeDiv';
import {
  prePeriod,
  period,
  magnitude,
  magnificationRotationJulia,
  magnificationRotationMandelbrot,
  formatComplexNumber,
  round,
  formatAngle,
  orbit,
} from '../tansTheoremUtils';
import { ThetaType, XYType, ZoomType } from '../../common/types';
import { misiurewiczPairs } from '../MPoints';

const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
export class MisiurewiczPoint {
  point: XYType;
  u: XYType;
  a: XYType;
  prePeriod: number;
  period: number;
  uMagnitude: number;
  uAngle: number;
  aMagnitude: number;
  aAngle: number;

  constructor(c: XYType, iters: number) {
    this.point = orbit([0, 0], c, iters);

    this.prePeriod = prePeriod(this.point, c);
    this.period = period(this.point, c);

    this.u = magnificationRotationMandelbrot(c, this.prePeriod, this.period);
    this.uMagnitude = magnitude(this.u);
    this.uAngle = Math.atan2(this.u[1], this.u[0]);

    this.a = magnificationRotationJulia(c, this.point, this.prePeriod);
    this.aMagnitude = magnitude(this.a);
    this.aAngle = Math.atan2(this.a[1], this.a[0]);
  }

  toString(): string {
    let pre = `M${this.prePeriod},${this.period}`;
    for (let i = 0; i < 10; i++) {
      pre = pre.replaceAll(i.toString(), subscripts[i]);
    }
    return pre;
  }
}

export const misiurewiczPoints: MisiurewiczPoint[] = misiurewiczPairs
  .slice(0, 300)
  .map((p) => new MisiurewiczPoint(p, 1));

const INITIAL_ZOOM: ZoomType = 1;

function getSteps(c: MisiurewiczPoint, cj: MisiurewiczPoint) {
  return [
    ['Translate M', `to ${formatComplexNumber(c.point)}`],
    ['Translate J', `to ${formatComplexNumber(cj.point)}`],
    ['Zoom M', `by ${round(c.uMagnitude, 1)}x`],
    ['Zoom J', `by ${round(magnitude(cj.a), 1)}x`],
    ['Rotate M', `by ${formatAngle(c.uAngle)}`],
    ['Rotate J', `by ${formatAngle(cj.aAngle)}`],
  ];
}

const SelectMisiurewiczCard = (props: SelectMisiurewiczCardProps): JSX.Element => {
  const iterates = [...Array(props.focusedPoint.prePeriod + 1).keys()].slice(1);

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

  const rotateAndZoom = (mag: ZoomType) => {
    props.setMagState(mag);

    const zoomM: ZoomType = props.focusedPoint.uMagnitude * mag;
    const zoomJ: ZoomType = props.focusedPointJulia.aMagnitude * mag;
    const thetaM: ThetaType = -props.focusedPoint.uAngle;
    const thetaJ: ThetaType = -props.focusedPointJulia.aAngle;

    warpToPoint(props.mandelbrot, {
      xy: props.focusedPoint.point,
      z: zoomM,
      theta: thetaM,
    });
    warpToPoint(props.julia, {
      xy: props.focusedPointJulia.point,
      z: zoomJ,
      theta: thetaJ,
    });
  };

  const handleMandelbrotPointSelection = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const posStr = (event.target.value as string).split(',');
    const chosenPoint: XYType = [parseFloat(posStr[0]), parseFloat(posStr[1])];

    const chosenMisiurewicz = new MisiurewiczPoint(chosenPoint, 1);
    props.setFocusedPoint(chosenMisiurewicz);
    props.setMagState(1);

    props.setFocusedPointJulia(
      new MisiurewiczPoint(chosenMisiurewicz.point, iterates[0]),
    );
    warpToPoint(props.mandelbrot, {
      xy: chosenMisiurewicz.point,
      z: chosenMisiurewicz.uMagnitude,
      theta: 0,
    });
  };

  const handleJuliaPointSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
    const posStr = event.target.value as string;

    props.setFocusedPointJulia(
      new MisiurewiczPoint(props.focusedPoint.point, parseFloat(posStr)),
    );
  };

  const handleSetMagnification = (event: any, newValue: number | number[]) => {
    rotateAndZoom(newValue as ZoomType);
  };

  const steps = getSteps(props.focusedPoint, props.focusedPointJulia);

  return (
    <Grow in={props.show}>
      <Grid container direction="column" alignItems="flex-start">
        {props.animationState === AnimationStatus.NO_ANIMATION ? (
          <Grid container direction="column" alignItems="center">
            <Card
              style={{
                width: 'auto',
                zIndex: 1300,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 1,
              }}
            >
              <Card
                style={{
                  padding: 8,
                  backgroundColor: 'DeepSkyBlue',
                }}
              >
                <InputLabel
                  htmlFor="select-native"
                  style={{
                    color: 'white',
                  }}
                >
                  Misiurewicz points
                </InputLabel>
                <Select
                  native
                  value={props.focusedPoint.point}
                  onChange={handleMandelbrotPointSelection}
                  inputProps={{
                    name: 'mandelbrot',
                    id: 'select-multiple-native',
                  }}
                >
                  {misiurewiczPoints.map((m) => (
                    <option value={m.point.toString()}>
                      {m.toString()} = {formatComplexNumber(m.point)}
                    </option>
                  ))}
                </Select>
              </Card>

              <MisiurewiczPointInfoCard
                show={props.show}
                mandelbrot={props.mandelbrot}
                julia={props.julia}
                animationState={props.animationState}
                setAnimationState={props.setAnimationState}
                focusedPoint={props.focusedPoint}
                setFocusedPoint={props.setFocusedPoint}
                focusedPointJulia={props.focusedPointJulia}
                setFocusedPointJulia={props.setFocusedPointJulia}
              ></MisiurewiczPointInfoCard>
            </Card>
          </Grid>
        ) : null}
        <div>
          {props.animationState !== AnimationStatus.NO_ANIMATION ? (
            <Card
              style={{
                zIndex: 1300,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 1,
              }}
            >
              <IconButton
                onClick={() => {
                  props.setAnimationState(
                    props.animationState === AnimationStatus.SELECT_JULIA_POINT
                      ? AnimationStatus.NO_ANIMATION
                      : AnimationStatus.SELECT_JULIA_POINT,
                  );
                }}
              >
                <ArrowBackwardIcon />
              </IconButton>
              {props.animationState === AnimationStatus.SELECT_JULIA_POINT ? (
                <Card
                  style={{
                    width: 250,
                    padding: 8,
                    zIndex: 1300,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 1,
                  }}
                >
                  <div
                    style={{
                      marginBottom: 8,
                      display: 'flex',
                      flexDirection: 'row',
                      flexShrink: 1,
                    }}
                  >
                    <Typography variant="h5" gutterBottom>
                      Show me the similarity between...
                    </Typography>
                    <Tooltip
                      title={`There are at least ${
                        iterates.length
                      } points in the Julia set for ${props.focusedPoint.toString()} that are similar to the point ${props.focusedPoint.toString()} in the Mandelbrot set!`}
                      placement="top"
                    >
                      <InfoIcon />
                    </Tooltip>
                  </div>
                  <Select
                    native
                    value={props.focusedPoint.point}
                    onChange={handleMandelbrotPointSelection}
                    inputProps={{
                      name: 'mandelbrot',
                      id: 'select-multiple-native',
                    }}
                  >
                    {misiurewiczPoints.map((m) => (
                      <option value={m.point.toString()}>
                        {m.toString()} = {formatComplexNumber(m.point)}
                      </option>
                    ))}
                  </Select>
                  <div style={{ marginBottom: 12 }}>in the Mandelbrot set</div>
                  <Typography variant="h6" component="h5" gutterBottom>
                    and
                  </Typography>
                  <Select
                    native
                    value={
                      props.focusedPoint.prePeriod - props.focusedPointJulia.prePeriod + 1
                    }
                    onChange={handleJuliaPointSelection}
                    inputProps={{
                      id: 'select-multiple-native',
                    }}
                  >
                    {iterates.map((m) => (
                      <option value={m}>
                        {formatComplexNumber(
                          new MisiurewiczPoint(props.focusedPoint.point, m).point,
                        )}
                      </option>
                    ))}
                  </Select>
                  <div style={{ marginBottom: 12 }}>in the Julia set</div>
                  <Button
                    variant="contained"
                    onClick={() => {
                      props.setAnimationState(AnimationStatus.TRANSLATE_M);
                    }}
                  >
                    GO
                  </Button>
                </Card>
              ) : null}
              {props.animationState !== AnimationStatus.SELECT_JULIA_POINT &&
              props.animationState !== AnimationStatus.PLAY ? (
                <Card>
                  <Stepper
                    activeStep={props.animationState.valueOf()}
                    orientation="vertical"
                  >
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
              ) : null}
              {props.animationState === AnimationStatus.PLAY ? (
                <Card
                  style={{
                    width: 'auto',
                    zIndex: 1300,
                    position: 'relative',
                    padding: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 1,
                  }}
                >
                  <Grid container direction="column" alignItems="center">
                    <Grid item>
                      <ZoomInIcon />
                    </Grid>
                    <Grid item xs>
                      <Slider
                        value={props.mag}
                        onChange={handleSetMagnification}
                        style={{
                          height: '60vh',
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
                </Card>
              ) : null}
            </Card>
          ) : null}
        </div>
      </Grid>
    </Grow>
  );
};

export default SelectMisiurewiczCard;
