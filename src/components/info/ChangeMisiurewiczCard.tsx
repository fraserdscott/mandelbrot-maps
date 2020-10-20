import { Button, Card, Grid, Grow, Snackbar } from '@material-ui/core';
import React from 'react';
import { ChangeMisiurewiczCardProps } from '../../common/info';
import { misiurewiczPoints } from '../../App';
import { warpToPoint } from '../utils';

const ChangeMisiurewiczCard = (props: ChangeMisiurewiczCardProps): JSX.Element => {
  const [animationState, setAnimationState] = React.useState(0);
  const [pointToAnimate, setPointToAnimate] = React.useState([0, 0]);

  const [showReset, setOpenReset] = React.useState(false);
  const [showTranslation, setOpenT] = React.useState(false);
  const [showMagnification, setOpenM] = React.useState(false);
  const [showRotation, setOpenR] = React.useState(false);

  const [messageTranslation, setMessageT] = React.useState('not set');
  const [messageMagnification, setMessageM] = React.useState('not set');
  const [messageRotation, setMessageR] = React.useState('not set');

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenReset(false);
    setOpenT(false);
    setOpenM(false);
    setOpenR(false);
  };

  const go = (pos: [number, number], zoom: number, theta: number) => {
    // If the user has clicked on a different point to the one we are currently animating
    if (pos[0] !== pointToAnimate[0] && pos[1] !== pointToAnimate[1]) {
      setAnimationState(0);
      setPointToAnimate(pos);
      setMessageT(`Translating to ${pos}`);
      setMessageM(`Magnifying ${zoom}x`);
      setMessageR(`Rotating by ${theta} radians`);
    } else if (animationState === 0) {
      setOpenReset(true);
      warpToPoint(props.mandelbrot, { xy: [-0.45, 0], z: 0.8, theta: 0 });
      warpToPoint(props.julia, { xy: [-0.45, 0], z: 0.8, theta: 0 });
      setAnimationState(1);
    } else if (animationState === 1) {
      setOpenT(true);
      warpToPoint(props.mandelbrot, { xy: pos, z: 1, theta: 0 });
      warpToPoint(props.julia, { xy: pos, z: 1, theta: 0 });
      setAnimationState(2);
    } else if (animationState === 2) {
      setOpenM(true);
      warpToPoint(props.mandelbrot, { xy: pos, z: zoom, theta: 0 });
      warpToPoint(props.julia, { xy: pos, z: zoom, theta: 0 });
      setAnimationState(3);
    } else if (animationState === 3) {
      setOpenR(true);
      warpToPoint(props.mandelbrot, { xy: pos, z: zoom, theta: theta });
      warpToPoint(props.julia, { xy: pos, z: zoom, theta: 0 });
      setAnimationState(4);
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
            open={showReset}
            onClose={handleClose}
            autoHideDuration={3000}
            message={'Resetting'}
          />
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={showTranslation}
            onClose={handleClose}
            autoHideDuration={3000}
            message={messageTranslation}
          />
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={showMagnification}
            onClose={handleClose}
            autoHideDuration={3000}
            message={messageMagnification}
          />
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={showRotation}
            onClose={handleClose}
            autoHideDuration={3000}
            message={messageRotation}
          />
        </Grid>
      </Card>
    </Grow>
  );
};

export default ChangeMisiurewiczCard;
