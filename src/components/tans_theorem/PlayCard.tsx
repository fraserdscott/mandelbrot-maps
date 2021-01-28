import { Card, IconButton, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { PlayCardProps } from '../../common/info';
import { warpToPoint } from '../../common/utils';
import { AnimationStatus } from './MisiurewiczModeFragment';
import ZoomBar from './ZoomBar';
import ArrowBackwardIcon from '@material-ui/icons/ArrowBack';

const PlayCard = (props: PlayCardProps): JSX.Element => {
  const [mag, setMagState] = React.useState<number>(1);

  return (
    <div
      style={{
        zIndex: 1300,
        position: 'absolute',
        left: 0,
        top: 0,
      }}
    >
      <Card
        style={{
          zIndex: 1300,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 1,
        }}
      >
        <Grid id="top-row" container spacing={4}>
          <Grid item>
            <IconButton
              onClick={() => {
                props.setAnimationState(AnimationStatus.SELECT_JULIA_POINT);
                warpToPoint(props.mandelbrot, {
                  xy: props.focusedPointMandelbrot.point,
                  z: props.focusedPointMandelbrot.uMagnitude,
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
          </Grid>
          <Grid item>
            <Typography component="span">
              The Mandelbrot and Julia set movement controls are now synchronised!
            </Typography>
          </Grid>
        </Grid>
        {/* <Grid id="bottom-row" container spacing={8}>
          <Grid item>
            <Typography component="span">Magnitication Mandelbrot: Mag: Julia</Typography>
          </Grid>
        </Grid> */}
      </Card>
      <ZoomBar
        mandelbrot={props.mandelbrot}
        julia={props.julia}
        focusedPoint={props.focusedPointMandelbrot}
        focusedPointJulia={props.focusedPointJulia}
        mag={mag}
        setMagState={setMagState}
      />
    </div>
  );
};

export default PlayCard;
