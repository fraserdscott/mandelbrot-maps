import { Card, Typography, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CompareIcon from '@material-ui/icons/Compare';
import React from 'react';
import { formatComplexNumber } from '../tansTheoremUtils';
import { warpToPoint } from '../../common/utils';
import { MisiurewiczInfoCardProps } from '../../common/info';
import { AnimationStatus } from './MisiurewiczModeDiv';
import { getBack, MisiurewiczPoint } from './SelectMisiurewiczCard';

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

  const similarPoints = getBack(props.focusedPoint);
  const selectPointInJulia2 = (x: MisiurewiczPoint) => {
    props.setFocusedPointJulia(x);
  };

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
      <Typography variant="h4" component="h5" gutterBottom>
        {props.focusedPoint.toString()}
      </Typography>
      <Typography variant="h6" gutterBottom>
        = {formatComplexNumber(props.focusedPoint.point)}
      </Typography>
      <IconButton
        size="small"
        classes={{ label: classes.iconButtonLabel }}
        onClick={() =>
          warpToPoint(props.mandelbrot, {
            xy: props.focusedPoint.point,
            z: props.focusedPoint.uMagnitude,
            theta: props.mandelbrot.rotCtrl[0].theta.getValue(),
          })
        }
      >
        <ArrowForwardIcon />
        Go to
      </IconButton>
      <IconButton
        size="small"
        classes={{ label: classes.iconButtonLabel }}
        onClick={() => {
          selectPointInJulia2(similarPoints[0]);
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
