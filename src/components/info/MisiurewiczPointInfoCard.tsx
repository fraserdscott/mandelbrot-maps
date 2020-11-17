import {
  Card,
  Divider,
  ListItemText,
  Typography,
  List,
  ListItem,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CompareIcon from '@material-ui/icons/Compare';
import React from 'react';
import { formatComplexNumber, orbit } from '../tansTheoremUtils';
import { warpToPoint } from '../../common/utils';
import { MisiurewiczInfoCardProps } from '../../common/info';
import { MisiurewiczPoint } from './SelectMisiurewiczCard';
import { AnimationStatus } from './MisiurewiczModeDiv';

const useStyles = makeStyles(() => ({
  iconButtonLabel: {
    width: 60,
    display: 'flex',
    flexDirection: 'column',
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
        goto
      </IconButton>
      <IconButton
        size="small"
        classes={{ label: classes.iconButtonLabel }}
        onClick={() => {
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
