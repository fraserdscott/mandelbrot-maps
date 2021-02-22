import { Card, Typography, IconButton, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CompareIcon from '@material-ui/icons/Compare';
import React from 'react';
import { formatComplexNumber } from '../tansTheoremUtils';
import { warpToPoint } from '../../common/utils';
import { MisiurewiczInfoCardProps } from '../../common/info';
import { AnimationStatus } from './MisiurewiczModeFragment';

const useStyles = makeStyles(() => ({
  iconButtonLabel: {
    width: 120,
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10,
  },
}));

const MisiurewiczPointInfoCard = (props: MisiurewiczInfoCardProps): JSX.Element => {
  const classes = useStyles();

  return (
    <Card
      style={{
        width: 'auto',
        zIndex: 1300,
        position: 'relative',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography component="span" variant="h6">
        {formatComplexNumber(props.focusedPoint.point)}
      </Typography>
      <Divider style={{ marginTop: 8, marginBottom: 8 }}></Divider>
      <IconButton
        size="small"
        classes={{ label: classes.iconButtonLabel }}
        onClick={() => {
          warpToPoint(props.mandelbrot, {
            xy: props.focusedPoint.point,
            z: props.focusedPoint.uMagnitude,
            theta: 0,
          });
          warpToPoint(props.julia, {
            xy: [0, 0],
            z: 0.5,
            theta: 0,
          });
          props.setAnimationState(AnimationStatus.SELECT_JULIA_POINT);
        }}
      >
        <CompareIcon />
        Compare Mandelbrot and Julia set
      </IconButton>
    </Card>
  );
};

export default MisiurewiczPointInfoCard;