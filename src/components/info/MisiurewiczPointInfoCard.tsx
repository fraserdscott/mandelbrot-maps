import {
  Card,
  Divider,
  ListItemText,
  Typography,
  List,
  ListItem,
  Button,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import React from 'react';
import {
  magnitude,
  prePeriod,
  findU,
  formatComplexNumber,
  formatMisiurewiczName,
  round,
  formatAngle,
} from '../tansTheoremUtils';

const PERIOD = 1;

const MisiurewiczPointInfoCard = (focusedPoint: [number, number]): JSX.Element => {
  const u = findU(focusedPoint, prePeriod(focusedPoint), PERIOD);

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
      <Typography variant="h4" component="h5" gutterBottom>
        {formatMisiurewiczName(focusedPoint)}
      </Typography>
      <Typography variant="h6" gutterBottom>
        = {formatComplexNumber(focusedPoint)}
      </Typography>

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          flexShrink: 1,
        }}
      >
        <Button startIcon={<ArrowForwardIcon />}>Goto</Button>
        <Button startIcon={<ArrowForwardIcon />}>Show animation</Button>
      </div>
      <List>
        <ListItem alignItems="flex-start">
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
        </ListItem>
        <Divider component="li" />
        <ListItem alignItems="flex-start">
          <ListItemText primary={"u'(c)"} secondary={formatComplexNumber(u)} />
        </ListItem>
      </List>
    </Card>
  );
};

export default MisiurewiczPointInfoCard;
