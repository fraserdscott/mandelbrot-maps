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
  magnificationMandelbrot,
  magnificationJulia,
  rotationMandelbrot,
  rotationJulia,
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

function round(value: number, precision: number) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

const SelectMisiurewiczCard = (props: SelectMisiurewiczCardProps): JSX.Element => {
  const handlePointSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
    const posStr = (event.target.value as string).split(',');
    const chosenPoint: [number, number] = [parseFloat(posStr[0]), parseFloat(posStr[1])];

    if (
      chosenPoint[0] !== props.focusedPoint[0] &&
      chosenPoint[1] !== props.focusedPoint[1]
    ) {
      props.setAnimationState(1);
      props.setFocusedPoint(chosenPoint);
      props.setMagState(1);

      const zoomM: number = magnificationMandelbrot(props.focusedPoint) * 1;
      const zoomJ: number = magnificationJulia(props.focusedPoint) * 1;

      warpToPoint(props.mandelbrot, { xy: chosenPoint, z: zoomM, theta: 0 });
      warpToPoint(props.julia, { xy: chosenPoint, z: zoomJ, theta: 0 });
    }
  };

  const handleAlignViews = () => {
    props.setAnimationState(2);

    const zoomM: number = magnificationMandelbrot(props.focusedPoint) * props.mag;
    const zoomJ: number = magnificationJulia(props.focusedPoint) * props.mag;
    const thetaM: number = rotationMandelbrot(props.focusedPoint);
    const thetaJ = rotationJulia(props.focusedPoint);

    warpToPoint(props.mandelbrot, { xy: props.focusedPoint, z: zoomM, theta: thetaM });
    warpToPoint(props.julia, { xy: props.focusedPoint, z: zoomJ, theta: thetaJ });
  };

  const handleSetMagnification = (event: any, newValue: number | number[]) => {
    props.setMagState(newValue as number);

    const zoomM: number =
      magnificationMandelbrot(props.focusedPoint) * (newValue as number);
    const zoomJ: number = magnificationJulia(props.focusedPoint) * (newValue as number);
    const thetaM: number = rotationMandelbrot(props.focusedPoint);
    const thetaJ = rotationJulia(props.focusedPoint);

    warpToPoint(props.mandelbrot, { xy: props.focusedPoint, z: zoomM, theta: thetaM });
    warpToPoint(props.julia, { xy: props.focusedPoint, z: zoomJ, theta: thetaJ });
  };

  const HandleGoto = () => {
    props.setAnimationState(1);
    props.setMagState(1);

    const zoomM: number = magnificationMandelbrot(props.focusedPoint) * 1;
    const zoomJ: number = magnificationJulia(props.focusedPoint) * 1;

    warpToPoint(props.mandelbrot, { xy: props.focusedPoint, z: zoomM, theta: 0 });
    warpToPoint(props.julia, { xy: props.focusedPoint, z: zoomJ, theta: 0 });
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
                  {`M${prePeriod(m)},${1} = ${round(m[0], 3)}+${round(m[1], 3)}j`}
                </option>
              ))}
            </Select>
          </Grid>
        </Card>
        {MisiurewiczPointInfoCard(props.focusedPoint)}
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
