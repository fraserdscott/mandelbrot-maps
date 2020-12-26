import { Card, Typography, IconButton, Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CompareIcon from '@material-ui/icons/Compare';
import CachedIcon from '@material-ui/icons/Cached';
import React from 'react';
import { formatComplexNumber, similarPoints } from '../tansTheoremUtils';
import { warpToPoint } from '../../common/utils';
import { MisiurewiczInfoCardProps } from '../../common/info';
import { AnimationStatus } from './MisiurewiczModeDiv';

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

  const zs = similarPoints(props.focusedPoint);

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
        style={{ marginBottom: 8 }}
        classes={{ label: classes.iconButtonLabel }}
        onClick={() =>
          warpToPoint(props.mandelbrot, {
            xy: props.focusedPoint.point,
            z: props.focusedPoint.uMagnitude,
            theta: props.mandelbrot.rotCtrl[0].theta,
          })
        }
      >
        <ArrowForwardIcon />
        Go to
      </IconButton>
      <IconButton
        size="small"
        style={{ marginBottom: 8 }}
        classes={{ label: classes.iconButtonLabel }}
        onClick={() => props.setAnimationState(AnimationStatus.SHOW_ORBIT)}
      >
        <CachedIcon />
        Show orbit
      </IconButton>
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
          props.setFocusedPointJulia(zs[0]);
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
