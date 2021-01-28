import { Card, Grid, Slider } from '@material-ui/core';
import React from 'react';
import { ZoomBarProps } from '../../common/info';
import { ThetaType, ZoomType } from '../../common/types';
import { warpToPoint } from '../../common/utils';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { magnitude, cycleEigenvalue } from '../tansTheoremUtils';

const MIN_ZOOM = 1;
const MAX_ZOOM = 500;

const ZoomBar = (props: ZoomBarProps): JSX.Element => {
  const eigenvalueTheta = Math.atan2(
    cycleEigenvalue(
      props.focusedPoint.point,
      props.focusedPoint.prePeriod,
      props.focusedPoint.period,
    )[1],
    cycleEigenvalue(
      props.focusedPoint.point,
      props.focusedPoint.prePeriod,
      props.focusedPoint.period,
    )[0],
  );

  const handleSetMagnification = (event: any, newValue: number | number[]) => {
    rotateAndZoom(newValue as ZoomType);
  };

  const rotateAndZoom = (mag: ZoomType) => {
    props.setMagState(mag);

    const zoomM: ZoomType = props.focusedPoint.uMagnitude * mag;
    const zoomJ: ZoomType = props.focusedPointJulia.aMagnitude * mag;
    const thetaM: ThetaType = -props.focusedPoint.uAngle;
    const thetaJ: ThetaType = -props.focusedPointJulia.aAngle;

    warpToPoint(props.mandelbrot, {
      xy: props.focusedPoint.point,
      z: zoomM,
      theta: thetaM,
    });
    warpToPoint(props.julia, {
      xy: props.focusedPointJulia.point,
      z: zoomJ,
      theta: thetaJ,
    });
  };

  const generateMarks = (): {
    value: number;
    label: number;
  }[] => {
    const eigenvalueMagnitude = magnitude(
      cycleEigenvalue(
        props.focusedPoint.point,
        props.focusedPoint.prePeriod,
        props.focusedPoint.period,
      ),
    );

    const marks: {
      value: number;
      label: number;
    }[] = [];

    const INITIAL_NOTCH = 1;
    for (let i = 0; i < 1000; i++) {
      const notch = INITIAL_NOTCH * Math.pow(eigenvalueMagnitude, i);
      if (notch > MAX_ZOOM) break;

      marks.push({
        value: notch,
        label: ((i * eigenvalueTheta) % (Math.PI * 2)) * (180 / Math.PI),
      });
    }

    return marks;
  };

  const marks = generateMarks();

  return (
    <Card
      style={{
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 1,
        position: 'relative',
        width: '10%',
      }}
    >
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <ZoomInIcon />
        </Grid>
        <Grid item xs>
          <Slider
            value={props.mag}
            onChange={handleSetMagnification}
            style={{
              height: '60vh',
            }}
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            orientation="vertical"
            aria-labelledby="continuous-slider"
            valueLabelDisplay="on"
            marks={marks}
          />
        </Grid>
        <Grid item>
          <ZoomOutIcon />
        </Grid>
      </Grid>
    </Card>
  );
};

export default ZoomBar;
