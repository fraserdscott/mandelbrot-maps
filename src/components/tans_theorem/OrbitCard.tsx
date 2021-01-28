import { Card, IconButton, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { AnimationStatus } from './MisiurewiczModeFragment';
import ArrowBackwardIcon from '@material-ui/icons/ArrowBack';
import { formatComplexNumber } from '../tansTheoremUtils';
import { OrbitCardProps } from '../../common/info';

const OrbitCard = (props: OrbitCardProps): JSX.Element => {
  return (
    <Card
      style={{
        width: 'auto',
        zIndex: 1300,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        left: 0,
        top: 0,
      }}
    >
      <IconButton
        onClick={() => {
          props.setAnimationState(AnimationStatus.NO_ANIMATION);
        }}
      >
        <ArrowBackwardIcon />
      </IconButton>
      <Typography component="span" variant="h6">
        Orbit for {formatComplexNumber(props.focusedPoint.point)}
      </Typography>
      <Grid id="top-row" container spacing={8}>
        <Grid item xs={4}>
          <Typography component="span" variant="body1" color="textSecondary">
            Preperiod
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography component="span" variant="body1" color="textPrimary">
            {props.focusedPoint.prePeriod}
          </Typography>
        </Grid>
      </Grid>
      <Grid id="bottom-row" container spacing={8}>
        <Grid item xs={4}>
          <Typography component="span" variant="body1" color="textSecondary">
            Period
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography component="span" variant="body1" color="textPrimary">
            {props.focusedPoint.period}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default OrbitCard;
