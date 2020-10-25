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

const PERIOD = 1;

const MisiurewiczPointInfoCard = (
  focusedPoint: [number, number],
  focusedPointJulia: [number, number],
): JSX.Element => {
  const u = findU(focusedPoint, prePeriod(focusedPoint), PERIOD);
  const a = findA(focusedPointJulia, focusedPointJulia, prePeriod(focusedPointJulia));

  const points: [[number, number], string][] = [[u, `u'(c)`]];
  return (
    <Card
      style={{
        width: 'auto',
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

          <Tooltip
            title={'The angle of the branch'}
            aria-label="add"
            placement="top-start"
          >
            <ListItemText
              primary={`arg(${m[1]})`}
              secondary={formatAngle(Math.atan2(m[0][1], m[0][0]))}
            />
          </Tooltip>
          <Divider orientation="vertical" flexItem />
          <Tooltip
            title={'1/The size of the branch'}
            aria-label="add"
            placement="top-start"
          >
            <ListItemText
              primary={`|${m[1]}|`}
              secondary={`${round(magnitude(m[0]), 1)}`}
            />
          </Tooltip>
        </Grid>
      ))}
    </Card>
  );
};

export default MisiurewiczPointInfoCard;
