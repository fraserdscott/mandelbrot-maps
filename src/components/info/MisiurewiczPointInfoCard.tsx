import {
  Card,
  Grid,
  Divider,
  ListItemText,
  Typography,
  Tooltip,
} from '@material-ui/core';
import React from 'react';
import {
  magnitude,
  prePeriod,
  findA,
  findU,
  formatComplexNumber,
  formatMisiurewiczName,
  round,
  formatAngle,
} from '../tansTheoremUtils';

const MisiurewiczPointInfoCard = (focusedPoint: [number, number]): JSX.Element => {
  const a = findA(focusedPoint, prePeriod(focusedPoint));
  const u = findU(focusedPoint, prePeriod(focusedPoint), 1);

  const points: [[number, number], string][] = [
    [u, `u'(c)`],
    [a, 'a'],
  ];
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
      }}
    >
      <Grid container>
        <Typography style={{ fontWeight: 'bold' }}>
          {formatMisiurewiczName(focusedPoint)} = {formatComplexNumber(focusedPoint)}
        </Typography>
      </Grid>
      {points.map((m) => (
        <Grid container alignItems="center">
          <ListItemText primary={m[1]} secondary={formatComplexNumber(m[0])} />
          <Divider orientation="vertical" flexItem />
          <ListItemText
            primary={`arg(${m[1]})`}
            secondary={formatAngle(Math.atan2(m[0][1], m[0][0]))}
          />
          {/* <Divider orientation="vertical" flexItem />
          <ListItemText
            primary={`|${m[1]}|`}
            secondary={`${round(magnitude(m[0]), 1)}`}
          /> */}
        </Grid>
      ))}
      <Tooltip
        title={'The size of Mandelbrot vs Julia'}
        aria-label="add"
        placement="top-start"
      >
        <ListItemText
          primary={`Scale factor`}
          secondary={`${round(magnitude(u) / magnitude(a), 1)}`}
        />
      </Tooltip>
    </Card>
  );
};

export default MisiurewiczPointInfoCard;
