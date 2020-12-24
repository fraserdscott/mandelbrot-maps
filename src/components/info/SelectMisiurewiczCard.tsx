import {
  Card,
  Grid,
  Grow,
  Slider,
  InputLabel,
  Select,
  IconButton,
  Typography,
} from '@material-ui/core';
import ArrowBackwardIcon from '@material-ui/icons/ArrowBack';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import React from 'react';
import MisiurewiczPointInfoCard from './MisiurewiczPointInfoCard';
import { SelectMisiurewiczCardProps } from '../../common/info';
import { warpToPoint } from '../../common/utils';
import { AnimationStatus } from './MisiurewiczModeDiv';
import {
  cycleEigenvalue,
  distance,
  formatComplexNumber,
  magnitude,
  PreperiodicPoint,
  round,
} from '../tansTheoremUtils';
import { ThetaType, XYType, ZoomType } from '../../common/types';
import { misiurewiczPairs } from '../MPoints';
import SimilarityAnimationCard from './SimilarityAnimationCard';
import { handleMandelbrotSelection } from './MisiurewiczPointMarker';
import SimilarityMenu from './SimilarityMenu';

export const misiurewiczPoints: PreperiodicPoint[] = misiurewiczPairs
  .slice(0, 300)
  .map((p) => new PreperiodicPoint(p, p));

export const parsePoint = (s: string): XYType => {
  const posStr = s.split(',');
  return [parseFloat(posStr[0]), parseFloat(posStr[1])];
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 100000;
const SelectMisiurewiczCard = (props: SelectMisiurewiczCardProps): JSX.Element => {
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

  const handleMandelbrotPointSelection = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const chosenPoint: XYType = parsePoint(event.target.value as string);

    const chosenMisiurewicz = new PreperiodicPoint(chosenPoint, chosenPoint);
    props.setMagState(1);

    handleMandelbrotSelection(
      chosenMisiurewicz,
      props.setFocusedPoint,
      chosenMisiurewicz,
      props.setFocusedPointJulia,
    );
    warpToPoint(props.mandelbrot, {
      xy: chosenMisiurewicz.point,
      z: chosenMisiurewicz.uMagnitude,
      theta: 0,
    });
  };

  const handleSetMagnification = (event: any, newValue: number | number[]) => {
    rotateAndZoom(newValue as ZoomType);
  };

  const misiurewiczPointsList = (focusedPoint: PreperiodicPoint): JSX.Element => {
    return (
      <Select
        native
        value={focusedPoint.point}
        onChange={handleMandelbrotPointSelection}
        inputProps={{
          name: 'mandelbrot',
          id: 'select-multiple-native',
        }}
      >
        {misiurewiczPoints.map((m) => (
          <option value={m.point.toString()}>
            {m.toString()} = {formatComplexNumber(m.point)}
          </option>
        ))}
      </Select>
    );
  };

  const standardAngle = (z: XYType) => {
    // all of this is wrong. its should be divided by the bifurication.
    // if (Math.abs(z[1] - 0) <= 0.001 || (z[0] > 0 && z[1] >= 0)) {
    //   const angle = Math.atan2(z[1], z[0]);
    //   return (2 * Math.PI) / angle;
    // }
    // if (z[0] < 0 && z[1] > 0) {
    //   const angle = Math.atan(z[1] / z[0]);
    //   return (2 * Math.PI) / (Math.PI + angle);
    // }
    // if (z[0] < 0 && z[1] < 0) {
    //   const angle = Math.atan(z[1] / z[0]);
    //   return (2 * Math.PI) / (Math.PI - angle);
    // }
    // if y compoennt is 0 then it's a 2 branch point at least...
    // if (Math.abs(z[1] - 0) <= 0.001) return 2;

    return 1;
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
        label: i,
      });
    }

    return marks;
  };

  const marks = generateMarks();

  const zoomBar = (): JSX.Element => {
    return (
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
    );
  };

  const searchBar = () => {
    return (
      <Card
        style={{
          padding: 8,
          backgroundColor: 'DeepSkyBlue',
        }}
      >
        <InputLabel
          htmlFor="select-native"
          style={{
            color: 'white',
          }}
        >
          Misiurewicz points
        </InputLabel>
        {misiurewiczPointsList(props.focusedPoint)}
      </Card>
    );
  };

  const infoCard = (): JSX.Element => {
    return (
      <Card
        style={{
          width: 'auto',
          zIndex: 1300,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 1,
        }}
      >
        {props.shadeDomains ? null : searchBar()}

        <MisiurewiczPointInfoCard
          show={props.show}
          mandelbrot={props.mandelbrot}
          julia={props.julia}
          animationState={props.animationState}
          setAnimationState={props.setAnimationState}
          focusedPoint={props.focusedPoint}
          setFocusedPoint={props.setFocusedPoint}
          focusedPointJulia={props.focusedPointJulia}
          setFocusedPointJulia={props.setFocusedPointJulia}
        ></MisiurewiczPointInfoCard>
      </Card>
    );
  };

  const playCard = (): JSX.Element => {
    return (
      <div>
        <Card
          style={{
            zIndex: 1300,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 1,
          }}
        >
          <IconButton
            onClick={() => {
              props.setAnimationState(AnimationStatus.SELECT_JULIA_POINT);
              warpToPoint(props.mandelbrot, {
                xy: props.focusedPoint.point,
                z: props.focusedPoint.uMagnitude,
                theta: 0,
              });
              warpToPoint(props.julia, {
                xy: [0, 0],
                z: 0.5,
                theta: 0,
              });
            }}
          >
            <ArrowBackwardIcon />
          </IconButton>
          The zoom controls are now synchronised!
          <div>
            The mandelbort is zoom at a factor of the julia is mangifying at a factor of
          </div>
        </Card>
        <Card
          style={{
            width: '30',
            zIndex: 1300,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 1,
          }}
        >
          {zoomBar()}
        </Card>
      </div>
    );
  };

  const orbitCard = () => {
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
        <IconButton
          onClick={() => {
            props.setAnimationState(AnimationStatus.NO_ANIMATION);
          }}
        >
          <ArrowBackwardIcon />
        </IconButton>
        <Typography component="span" variant="h6">
          Orbit for {formatComplexNumber(props.focusedPoint.point)}
        </Typography>
        <Grid id="top-row" container spacing={8}>
          <Grid item xs={4}>
            <Typography component="span" variant="body1" color="textSecondary">
              Preperiod
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography component="span" variant="body1" color="textPrimary">
              {props.focusedPoint.prePeriod}
            </Typography>
          </Grid>
        </Grid>
        <Grid id="bottom-row" container spacing={8}>
          <Grid item xs={4}>
            <Typography component="span" variant="body1" color="textSecondary">
              Period
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography component="span" variant="body1" color="textPrimary">
              {props.focusedPoint.period}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    );
  };

  return (
    <Grow in={props.show}>
      <div>
        {props.animationState === AnimationStatus.NO_ANIMATION ? infoCard() : null}
        {props.animationState === AnimationStatus.SHOW_ORBIT ? orbitCard() : null}
        {props.animationState === AnimationStatus.SELECT_JULIA_POINT
          ? SimilarityMenu(props)
          : null}
        {props.animationState === AnimationStatus.TRANSLATE_M ||
        props.animationState === AnimationStatus.TRANSLATE_J ||
        props.animationState === AnimationStatus.ZOOM_M ||
        props.animationState === AnimationStatus.ZOOM_J ||
        props.animationState === AnimationStatus.ROTATE_M ||
        props.animationState === AnimationStatus.ROTATE_J ? (
          <SimilarityAnimationCard
            show={props.show}
            mandelbrot={props.mandelbrot}
            julia={props.julia}
            animationState={props.animationState}
            setAnimationState={props.setAnimationState}
            focusedPoint={props.focusedPoint}
            setFocusedPoint={props.setFocusedPoint}
            focusedPointJulia={props.focusedPointJulia}
            setFocusedPointJulia={props.setFocusedPointJulia}
          ></SimilarityAnimationCard>
        ) : null}
        {props.animationState === AnimationStatus.PLAY ? playCard() : null}
      </div>
    </Grow>
  );
};

export default SelectMisiurewiczCard;
