import { Card, Grid, Divider, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import {
  magnificationMandelbrot,
  magnificationJulia,
  rotationMandelbrot,
  rotationJulia,
  prePeriod,
  findA,
  findU,
} from '../tansTheoremUtils';

function round(value: number, precision: number) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

const MisiurewiczPointInfoCard = (focusedPoint: [number, number]): JSX.Element => {
  return (
    <Card
      style={{
        width: '30vh',
        zIndex: 1300,
        position: 'relative',
        padding: 8,
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 1,
        // display: props.show ? 'block' : 'none',
        // borderRadius: 100,
      }}
    >
      <Grid container>
        <Typography style={{ fontWeight: 'bold' }}>
          {`M${prePeriod(focusedPoint)},${1} = ${round(focusedPoint[0], 3)}${
            focusedPoint[1] >= 0 ? '+' : ''
          }${round(focusedPoint[1], 3)}j`}
        </Typography>
      </Grid>
      <Grid container alignItems="center">
        <ListItemText
          primary="u'(c)"
          secondary={`${round(
            findU(focusedPoint, prePeriod(focusedPoint), 1)[0],
            1,
          )}+${round(findU(focusedPoint, prePeriod(focusedPoint), 1)[1], 1)}j`}
        />
        <Divider orientation="vertical" flexItem />
        <ListItemText
          primary="arg(u'(c))"
          secondary={`${-round((180 / Math.PI) * rotationMandelbrot(focusedPoint), 0)}°`}
        />
        <Divider orientation="vertical" flexItem />
        <ListItemText
          primary="|u'(c)|"
          secondary={`${round(magnificationMandelbrot(focusedPoint), 1)}`}
        />
      </Grid>
      <Grid container alignItems="center">
        <ListItemText
          primary="a"
          secondary={`${round(
            findA(focusedPoint, prePeriod(focusedPoint))[0],
            1,
          )}+${round(findA(focusedPoint, prePeriod(focusedPoint))[1], 1)}j`}
        />
        <Divider orientation="vertical" flexItem />
        <ListItemText
          primary="arg(a)"
          secondary={`${-round((180 / Math.PI) * rotationJulia(focusedPoint), 0)}°`}
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
