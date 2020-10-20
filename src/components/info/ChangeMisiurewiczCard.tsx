import { Button, Card, Grid, Grow, Snackbar } from '@material-ui/core';
import React from 'react';
import { ChangeMisiurewiczCardProps } from '../../common/info';
import { misiurewiczPoints } from '../../App';
import { warpToPoint } from '../utils';

const ChangeMisiurewiczCard = (props: ChangeMisiurewiczCardProps): JSX.Element => {
  const [openT, setOpenT] = React.useState(false);
  const [openM, setOpenM] = React.useState(false);
  const [openR, setOpenR] = React.useState(false);

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenT(false);
    setOpenM(false);
    setOpenR(false);
  };

  const [state, setState] = React.useState(0);
  const [pointToAnimate, setPointToAnimate] = React.useState([0, 0]);
  const go = (pos: [number, number], zoom: number, theta: number) => {
    if (pos[0] !== pointToAnimate[0] && pos[1] !== pointToAnimate[1]) {
      setState(0);
      setPointToAnimate(pos);
    } else if (state === 0) {
      warpToPoint(props.mandelbrot, { xy: [0, 0], z: 0.8, theta: 0 });
      warpToPoint(props.julia, { xy: [0, 0], z: 0.8, theta: 0 });
      setState(1);
    } else if (state === 1) {
      setOpenT(true);
      warpToPoint(props.mandelbrot, { xy: pos, z: 1, theta: 0 });
      warpToPoint(props.julia, { xy: pos, z: 1, theta: 0 });
      setState(2);
    } else if (state === 2) {
      setOpenM(true);
      warpToPoint(props.mandelbrot, { xy: pos, z: zoom, theta: 0 });
      warpToPoint(props.julia, { xy: pos, z: zoom, theta: 0 });
      setState(3);
    } else if (state === 3) {
      setOpenR(true);
      warpToPoint(props.mandelbrot, { xy: pos, z: zoom, theta: theta });
      warpToPoint(props.julia, { xy: pos, z: zoom, theta: 0 });
      setState(4);
    }
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
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={openT}
            onClose={handleClose}
            autoHideDuration={3000}
            message="Translating"
          />
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={openM}
            onClose={handleClose}
            autoHideDuration={3000}
            message="Magnifying"
          />
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={openR}
            onClose={handleClose}
            autoHideDuration={3000}
            message="Rotating"
          />
        </Grid>
      </Card>
    </Grow>
  );
};

export default ChangeMisiurewiczCard;
