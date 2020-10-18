import { Button, Card, Grid, Grow } from '@material-ui/core';
import React, { useState } from 'react';
import { vScale } from 'vec-la-fp';
import {
  resetPosSpringConfig,
  resetZoomSpringConfig,
  startPos,
  startTheta,
  startZoom,
  misiurewiczPoints,
} from '../../App';
import { ChangeMisiurewiczCardProps } from '../../common/info';

const ChangeMisiurewiczCard = (props: ChangeMisiurewiczCardProps): JSX.Element => {
  const [x, setX] = useState(startPos[0]);
  const [y, setY] = useState(startPos[1]);
  const [zoom, setZoom] = useState(startZoom);
  const [theta, setTheta] = useState(startTheta);

  const go = (wurpos: [number, number], wurzoom: number, wurtheta: number) => {
    setX(wurpos[0]);
    setY(wurpos[1]);
    setZoom(wurzoom);
    setTheta(wurtheta);

    props.mandelbrot.xyCtrl[1]({
      xy: vScale(1 / props.screenScaleMultiplier, [x, y]),
      config: resetPosSpringConfig,
    });
    props.mandelbrot.zoomCtrl[1]({
      z: zoom,
      config: resetZoomSpringConfig,
    });
    props.mandelbrot.rotCtrl[1]({
      theta: theta,
      config: resetZoomSpringConfig,
    });
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
