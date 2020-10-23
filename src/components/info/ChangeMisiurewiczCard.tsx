import {
  Button,
  Card,
  Grid,
  Grow,
  Typography,
  Slider,
  InputLabel,
  Select,
} from '@material-ui/core';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import React, { Dispatch, SetStateAction } from 'react';
import { ChangeMisiurewiczCardProps } from '../../common/info';
import MisiurewiczPointInfoCard from './MisiurewiczPointInfoCard';
import { misiurewiczPoints } from '../../App';
import { warpToPoint } from '../utils';
import {
  prePeriod,
  magnificationMandelbrot,
  magnificationJulia,
  rotationMandelbrot,
  rotationJulia,
} from '../compute_factors';

function round(value: number, precision: number) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

const ChangeMisiurewiczCard = (props: ChangeMisiurewiczCardProps): JSX.Element => {
  const [animationState, setAnimationState] = React.useState(0);
  const [mag, setMagnification] = React.useState<number>(1);
  const [focusedPoint, setFocusedPoint]: [
    [number, number],
    Dispatch<SetStateAction<[number, number]>>,
  ] = React.useState(misiurewiczPoints[0]);

  const handlePointSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
    const posStr = (event.target.value as string).split(',');
    const chosenPoint: [number, number] = [parseFloat(posStr[0]), parseFloat(posStr[1])];

    if (chosenPoint[0] !== focusedPoint[0] && chosenPoint[1] !== focusedPoint[1]) {
      setAnimationState(0);
      setFocusedPoint(chosenPoint);
      setMagnification(1);

      const zoomM: number = magnificationMandelbrot(focusedPoint) * 1;
      const zoomJ: number = magnificationJulia(focusedPoint) * 1;

      warpToPoint(props.mandelbrot, { xy: chosenPoint, z: zoomM, theta: 0 });
      warpToPoint(props.julia, { xy: chosenPoint, z: zoomJ, theta: 0 });
    }
  };

  const handleAlignViews = () => {
    setAnimationState(1);

    const zoomM: number = magnificationMandelbrot(focusedPoint) * mag;
    const zoomJ: number = magnificationJulia(focusedPoint) * mag;
    const thetaM: number = rotationMandelbrot(focusedPoint);
    const thetaJ = rotationJulia(focusedPoint);

    warpToPoint(props.mandelbrot, { xy: focusedPoint, z: zoomM, theta: thetaM });
    warpToPoint(props.julia, { xy: focusedPoint, z: zoomJ, theta: thetaJ });
  };

  const handleSetMagnification = (event: any, newValue: number | number[]) => {
    setMagnification(newValue as number);

    const zoomM: number = magnificationMandelbrot(focusedPoint) * (newValue as number);
    const zoomJ: number = magnificationJulia(focusedPoint) * (newValue as number);
    const thetaM: number = rotationMandelbrot(focusedPoint);
    const thetaJ = rotationJulia(focusedPoint);

    warpToPoint(props.mandelbrot, { xy: focusedPoint, z: zoomM, theta: thetaM });
    warpToPoint(props.julia, { xy: focusedPoint, z: zoomJ, theta: thetaJ });
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
            // display: props.show ? 'block' : 'none',
            // borderRadius: 100,
          }}
        >
          <Grid container direction="column" alignItems="center">
            <InputLabel htmlFor="select-multiple-native">Misiurewicz points</InputLabel>
            <Select
              native
              value={focusedPoint.toString()}
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
        <Card
          style={{
            width: '30vh',
            zIndex: 1300,
            position: 'relative',
            padding: 8,
            display: 'flex',
            marginTop: 8,
            flexDirection: 'column',
            flexShrink: 1,
          }}
        >
          {MisiurewiczPointInfoCard(focusedPoint)}
          {animationState === 0 ? (
            <Button
              fullWidth
              style={{ marginBottom: 8, marginTop: 8 }}
              onClick={() => handleAlignViews()}
              startIcon={<ThreeSixtyIcon />}
            >
              Align views
            </Button>
          ) : null}
          {animationState === 1 ? (
            <Grid container alignItems="center">
              <Typography id="continuous-slider" gutterBottom style={{ marginTop: 8 }}>
                Magnify
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <ZoomOutIcon />
                </Grid>
                <Grid item xs>
                  <Slider
                    value={mag}
                    onChange={handleSetMagnification}
                    min={1}
                    max={1000}
                    aria-labelledby="continuous-slider"
                    valueLabelDisplay="auto"
                  />{' '}
                </Grid>
                <Grid item>
                  <ZoomInIcon />
                </Grid>
              </Grid>
            </Grid>
          ) : null}
        </Card>
      </Grid>
    </Grow>
  );
};

export default ChangeMisiurewiczCard;
