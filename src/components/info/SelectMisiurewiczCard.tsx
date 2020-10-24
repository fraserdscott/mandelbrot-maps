import { Button, Card, Grid, Grow, Slider, InputLabel, Select } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
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
} from '../tansTheoremUtils';

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

const SelectMisiurewiczCard = (props: SelectMisiurewiczCardProps): JSX.Element => {
  const rotateAndZoom = (c: [number, number], mag: number, useAngle: boolean) => {
    const u: [number, number] = findU(c, props.focusedPoint[1], 1);
    const a: [number, number] = findA(c, props.focusedPoint[1]);

    const zoomM: number = (magnitude(u) / magnitude(a)) * mag;
    const zoomJ: number = mag;
    let thetaM = 0;
    let thetaJ = 0;
    if (useAngle === true) {
      thetaM = -Math.atan2(u[1], u[0]);
      thetaJ = -Math.atan2(a[1], a[0]);
    }

    warpToPoint(props.mandelbrot, { xy: c, z: zoomM, theta: thetaM });
    warpToPoint(props.julia, { xy: c, z: zoomJ, theta: thetaJ });
  };

  const handlePointSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
    const posStr = (event.target.value as string).split(',');
    const chosenPoint: [number, number] = [parseFloat(posStr[0]), parseFloat(posStr[1])];

    if (!complexNumbersEqual(chosenPoint, props.focusedPoint[0])) {
      props.setAnimationState(1);
      props.setFocusedPoint([chosenPoint, prePeriod(chosenPoint)]);
      props.setMagState(1);

      rotateAndZoom(chosenPoint, 1, false);
    }
  };

  const handleGoto = () => {
    props.setAnimationState(1);
    props.setMagState(1);

    rotateAndZoom(props.focusedPoint[0], 1, false);
  };

  const handleAlignViews = () => {
    props.setAnimationState(2);
    rotateAndZoom(props.focusedPoint[0], props.mag, true);
  };

  const handleSetMagnification = (event: any, newValue: number | number[]) => {
    props.setMagState(newValue as number);

    rotateAndZoom(props.focusedPoint[0], newValue as number, true);
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
                onClick={() => handleGoto()}
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
