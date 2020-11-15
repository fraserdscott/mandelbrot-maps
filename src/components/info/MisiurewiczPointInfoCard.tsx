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
import {
  formatComplexNumber,
  formatMisiurewiczName,
  magnitude,
} from '../tansTheoremUtils';
import { warpToPoint } from '../utils';
import { ViewerControls } from '../../common/info';
import { MisiurewiczPoint } from './SelectMisiurewiczCard';

const useStyles = makeStyles((theme) => ({
  iconButtonLabel: {
    width: 60,
    display: 'flex',
    flexDirection: 'column',
  },
}));

const MisiurewiczPointInfoCard = (
  focusedPoint: [number, number],
  setAnimationState: React.Dispatch<React.SetStateAction<number>>,
  mandelbrot: ViewerControls,
): JSX.Element => {
  const classes = useStyles();
  const u = new MisiurewiczPoint(focusedPoint).u;

  return (
    <Card
      style={{
        width: 'auto',
        zIndex: 1300,
        position: 'relative',
        padding: 8,
      }}
    >
      <Typography variant="h4" component="h5" gutterBottom>
        {formatMisiurewiczName(focusedPoint)}
      </Typography>
      <Typography variant="h6" gutterBottom>
        = {formatComplexNumber(focusedPoint)}
      </Typography>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <IconButton
          classes={{ label: classes.iconButtonLabel }}
          onClick={() =>
            warpToPoint(mandelbrot, {
              xy: focusedPoint,
              z: magnitude(u),
              theta: 0,
            })
          }
        >
          <ArrowForwardIcon />
          <div>goto</div>
        </IconButton>
        <IconButton
          classes={{ label: classes.iconButtonLabel }}
          onClick={() => setAnimationState(0)}
        >
          <CompareIcon />
          <div>compare</div>
        </IconButton>
      </div>
      <Divider />
      <List>
        {/*<ListItem alignItems="flex-start">
          <ListItemText
            primary={`Magnitude`}
            secondary={`${round(magnitude(focusedPoint), 1)}`}
          />
        </ListItem>
        <Divider component="li" />
        <ListItem alignItems="flex-start">
          <ListItemText
            primary={`Argument`}
            secondary={formatAngle(Math.atan2(focusedPoint[1], focusedPoint[0]))}
          />
        </ListItem>*/}
        <ListItem alignItems="flex-start">
          <ListItemText primary={"u'(c)"} secondary={formatComplexNumber(u)} />
        </ListItem>
      </List>
    </Card>
  );
};

export default MisiurewiczPointInfoCard;
