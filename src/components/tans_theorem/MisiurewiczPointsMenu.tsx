import { Button, Card, Grow, Typography } from '@material-ui/core';
import React from 'react';
import { InfoCardProps } from '../../common/info';
import { AnimationStatus } from './MisiurewiczModeFragment';
import MisiurewiczPointsList from './MisiurewiczPointsList';
import { warpToPoint } from '../../common/utils';

const PointsInfoCard = (props: InfoCardProps): JSX.Element => {
  const goButton = (
    setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>,
  ) => {
    return (
      <Button
        variant="contained"
        style={{
          float: 'right',
        }}
        onClick={() => {
          setAnimationState(AnimationStatus.SELECT_JULIA_POINT);
          warpToPoint(props.mandelbrot, {
            xy: props.focusedPointMandelbrot.point,
            z: 1,
            theta: 0,
          });
        }}
      >
        CONFIRM
      </Button>
    );
  };

  return (
    <Grow in={props.show}>
      <Card
        style={{
          width: 200,
          padding: 12,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 1,
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      >
        <Typography
          style={{
            marginBottom: 8,
          }}
          variant="h6"
          gutterBottom
        >
          Pick a point in the Mandelbrot set!
        </Typography>
        <MisiurewiczPointsList
          show={props.show}
          mandelbrot={props.mandelbrot}
          focusedPoint={props.focusedPointMandelbrot}
          handleMandelbrotSelection={props.handleMandelbrotSelection}
        />
        {goButton(props.setAnimationState)}
      </Card>
    </Grow>
  );
};

export default PointsInfoCard;
