import { Button, Card, Grow, Typography } from '@material-ui/core';
import React from 'react';
import { MisiurewiczDomainsMenuProps } from '../../common/tans';
import { AnimationStatus } from './MisiurewiczModeFragment';
import { warpToPoint } from '../../common/utils';

const MisiurewiczDomainsMenu = (props: MisiurewiczDomainsMenuProps): JSX.Element => {
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
        GO
      </Button>
    );
  };

  return (
    <Grow in={props.show}>
      <Card
        style={{
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 1,
          marginBottom: 8,
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

        {goButton(props.setAnimationState)}
      </Card>
    </Grow>
  );
};

export default MisiurewiczDomainsMenu;
