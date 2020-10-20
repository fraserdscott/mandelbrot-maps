import { Button, Card, Grid, Grow } from '@material-ui/core';
import React from 'react';
import { ChangeMisiurewiczCardProps } from '../../common/info';
import { misiurewiczPoints } from '../../App';
import { warpToPoint } from '../utils';

const ChangeMisiurewiczCard = (props: ChangeMisiurewiczCardProps): JSX.Element => {
  const go = (newPos: [number, number], newZoom: number, newTheta: number) => {
    warpToPoint(props.mandelbrot, { xy: newPos, z: newZoom, theta: newTheta });
    warpToPoint(props.julia, { xy: newPos, z: newZoom, theta: 0 });
  };

  return (
    <Grow in={props.show}>
      <Card
        style={{
          width: 'auto',
          zIndex: 1300,
          position: 'relative',
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 1,
          // display: props.show ? 'block' : 'none',
          // borderRadius: 100,
        }}
      >
        <Grid container direction="column" alignItems="center">
          <div style={{ marginTop: 12, fontWeight: 'bold' }}>Misiurewicz points</div>
          {misiurewiczPoints.map((m) => (
            <Button
              fullWidth
              style={{ marginTop: 12 }}
              onClick={() => go(m[0], m[1], m[2])}
            >
              {m[0].toString()}
            </Button>
          ))}
        </Grid>
      </Card>
    </Grow>
  );
};

export default ChangeMisiurewiczCard;
