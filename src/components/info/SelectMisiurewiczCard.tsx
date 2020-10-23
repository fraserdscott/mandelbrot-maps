import { Button, Card, Grid, Grow, Slider, InputLabel, Select } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import React from 'react';
import MisiurewiczPointInfoCard from './MisiurewiczPointInfoCard';
import { SelectMisiurewiczCardProps } from '../../common/info';
import { warpToPoint } from '../utils';
import { prePeriod, magnitude, findA, findU } from '../tansTheoremUtils';

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

function round(value: number, precision: number) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

function complexNumbersEqual(a: [number, number], b: [number, number]) {
  return a[0] === b[0] && a[1] === b[1];
}

function formatComplexNumber(c: [number, number]) {
  return `${round(c[0], 3)}${c[1] >= 0 ? '+' : ''}${round(c[1], 3)}j`;
}

function formatMisiurewiczName(c: [number, number]) {
  return `M${prePeriod(c)},${1}`;
}

const SelectMisiurewiczCard = (props: SelectMisiurewiczCardProps): JSX.Element => {
  const handlePointSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
    const posStr = (event.target.value as string).split(',');
    const chosenPoint: [number, number] = [parseFloat(posStr[0]), parseFloat(posStr[1])];

    if (!complexNumbersEqual(chosenPoint, props.focusedPoint[0])) {
      props.setAnimationState(1);
      props.setFocusedPoint([chosenPoint, prePeriod(chosenPoint)]);
      props.setMagState(1);

      const u: [number, number] = findU(props.focusedPoint[0], props.focusedPoint[1], 1);
      const a: [number, number] = findA(props.focusedPoint[0], props.focusedPoint[1]);

      const zoomM: number = magnitude(u) * 1;
      const zoomJ: number = magnitude(a) * 1;

      warpToPoint(props.mandelbrot, { xy: chosenPoint, z: zoomM, theta: 0 });
      warpToPoint(props.julia, { xy: chosenPoint, z: zoomJ, theta: 0 });
    }
  };

  const handleAlignViews = () => {
    props.setAnimationState(2);

    const u: [number, number] = findU(props.focusedPoint[0], props.focusedPoint[1], 1);
    const a: [number, number] = findA(props.focusedPoint[0], props.focusedPoint[1]);

    const zoomM: number = magnitude(u) * props.mag;
    const zoomJ: number = magnitude(a) * props.mag;
    const thetaM: number = -Math.atan2(u[1], u[0]);
    const thetaJ = -Math.atan2(a[1], a[0]);

    warpToPoint(props.mandelbrot, { xy: props.focusedPoint[0], z: zoomM, theta: thetaM });
    warpToPoint(props.julia, { xy: props.focusedPoint[0], z: zoomJ, theta: thetaJ });
  };

  const handleSetMagnification = (event: any, newValue: number | number[]) => {
    props.setMagState(newValue as number);

    const u: [number, number] = findU(props.focusedPoint[0], props.focusedPoint[1], 1);
    const a: [number, number] = findA(props.focusedPoint[0], props.focusedPoint[1]);

    const zoomM: number = magnitude(u) * (newValue as number);
    const zoomJ: number = magnitude(a) * (newValue as number);
    const thetaM: number = -Math.atan2(u[1], u[0]);
    const thetaJ = -Math.atan2(a[1], a[0]);

    warpToPoint(props.mandelbrot, { xy: props.focusedPoint[0], z: zoomM, theta: thetaM });
    warpToPoint(props.julia, { xy: props.focusedPoint[0], z: zoomJ, theta: thetaJ });
  };

  const HandleGoto = () => {
    props.setAnimationState(1);
    props.setMagState(1);

    const u: [number, number] = findU(props.focusedPoint[0], props.focusedPoint[1], 1);
    const a: [number, number] = findA(props.focusedPoint[0], props.focusedPoint[1]);

    const zoomM: number = magnitude(u) * 1;
    const zoomJ: number = magnitude(a) * 1;

    warpToPoint(props.mandelbrot, { xy: props.focusedPoint[0], z: zoomM, theta: 0 });
    warpToPoint(props.julia, { xy: props.focusedPoint[0], z: zoomJ, theta: 0 });
  };

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
        {MisiurewiczPointInfoCard(props.focusedPoint[0])}
        {props.animationState >= 0 ? (
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
            {props.animationState === 0 ? (
              <Button
                fullWidth
                style={{ marginBottom: 8, marginTop: 8 }}
                onClick={() => HandleGoto()}
                startIcon={<ArrowForwardIcon />}
              >
                Goto
              </Button>
            ) : null}
            {props.animationState === 1 ? (
              <Button
                fullWidth
                style={{ marginBottom: 8, marginTop: 8 }}
                onClick={() => handleAlignViews()}
                startIcon={<ThreeSixtyIcon />}
              >
                Align views
              </Button>
            ) : null}
            {props.animationState === 2 ? (
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
            ) : null}
          </Card>
        ) : null}
      </Grid>
    </Grow>
  );
};

export default SelectMisiurewiczCard;
