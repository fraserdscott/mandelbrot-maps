import { Card, Grid, Divider, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import {
  magnificationMandelbrot,
  magnificationJulia,
  rotationMandelbrot,
  rotationJulia,
  prePeriod,
} from '../tansTheoremUtils';

function round(value: number, precision: number) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

const MisiurewiczPointInfoCard = (focusedPoint: [number, number]): JSX.Element => {
  return (
    <Card
      style={{
        width: 'auto',
        zIndex: 1300,
        position: 'relative',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 1,
        // display: props.show ? 'block' : 'none',
        // borderRadius: 100,
      }}
    >
      <Grid container>
        <Typography style={{ fontWeight: 'bold' }}>
          M{prePeriod(focusedPoint)}, 1
        </Typography>
      </Grid>
      <Grid container alignItems="center">
        <ListItemText
          primary="arg(u'(c))"
          secondary={`${round((180 / Math.PI) * rotationMandelbrot(focusedPoint), 0)}°`}
        />
        <Divider orientation="vertical" flexItem />
        <ListItemText
          primary="arg(a)"
          secondary={`${round((180 / Math.PI) * rotationJulia(focusedPoint), 0)}°`}
        />
      </Grid>
      <Grid container alignItems="center">
        <ListItemText
          primary="|u'(c)|"
          secondary={`${round(magnificationMandelbrot(focusedPoint), 1)}`}
        />
        <Divider orientation="vertical" flexItem />
        <ListItemText
          primary="|a|"
          secondary={`${round(magnificationJulia(focusedPoint), 1)}`}
        />
      </Grid>
    </Card>
  );
};

export default MisiurewiczPointInfoCard;
