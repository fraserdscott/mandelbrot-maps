import {
  Button,
  Card,
  Grid,
  Grow,
  Slider,
  InputLabel,
  Select,
  IconButton,
  Typography,
  Tooltip,
} from '@material-ui/core';
import ArrowBackwardIcon from '@material-ui/icons/ArrowBack';
import InfoIcon from '@material-ui/icons/Info';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import React from 'react';
import MisiurewiczPointInfoCard from './MisiurewiczPointInfoCard';
import { SelectMisiurewiczCardProps } from '../../common/info';
import { warpToPoint } from '../../common/utils';
import { AnimationStatus } from './MisiurewiczModeDiv';
import {
  formatComplexNumber,
  getSimilarsInJulia,
  MisiurewiczPoint,
} from '../tansTheoremUtils';
import { ThetaType, XYType, ZoomType } from '../../common/types';
import { misiurewiczPairs } from '../MPoints';
import SimilarityAnimationCard from './SimilarityAnimationCard';
import {
  handleJuliaSelection,
  handleMandelbrotSelection,
} from './MisiurewiczPointMarker';

export const misiurewiczPoints: MisiurewiczPoint[] = misiurewiczPairs
  .slice(0, 300)
  .map((p) => new MisiurewiczPoint(p, p));

const parsePoint = (s: string): XYType => {
  const posStr = s.split(',');
  return [parseFloat(posStr[0]), parseFloat(posStr[1])];
};

const SelectMisiurewiczCard = (props: SelectMisiurewiczCardProps): JSX.Element => {
  const similarPoints = getSimilarsInJulia(props.focusedPoint);

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

    const chosenMisiurewicz = new MisiurewiczPoint(chosenPoint, chosenPoint);
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

  const handleJuliaSimilarSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
    const chosenPoint: XYType = parsePoint(event.target.value as string);

    handleJuliaSelection(
      new MisiurewiczPoint(props.focusedPoint.point, chosenPoint),
      props.setFocusedPointJulia,
    );
  };

  const handleSetMagnification = (event: any, newValue: number | number[]) => {
    rotateAndZoom(newValue as ZoomType);
  };

  const misiurewiczPointsList = (): JSX.Element => {
    return (
      <Select
        native
        value={props.focusedPoint.point}
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
            min={1}
            max={1000}
            track={false}
            orientation="vertical"
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
          />{' '}
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
        {misiurewiczPointsList()}
      </Card>
    );
  };

  return (
    <Grow in={props.show}>
      <Grid container direction="column" alignItems="flex-start">
        {props.animationState === AnimationStatus.NO_ANIMATION ? (
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
            {!props.shadeDomains ? searchBar() : null}

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
        ) : null}
        <div>
          {props.animationState !== AnimationStatus.NO_ANIMATION ? (
            <Card
              style={{
                zIndex: 1300,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 1,
              }}
            >
              {props.animationState === AnimationStatus.SELECT_JULIA_POINT ? (
                <Card
                  style={{
                    width: 200,
                    padding: 12,
                    zIndex: 100,
                  }}
                >
                  <IconButton
                    onClick={() => {
                      props.setAnimationState(AnimationStatus.NO_ANIMATION);
                    }}
                  >
                    <ArrowBackwardIcon />
                  </IconButton>
                  <div
                    style={{
                      marginBottom: 8,
                      display: 'flex',
                      flexDirection: 'row',
                      flexShrink: 1,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Show me the similarity between...
                    </Typography>
                  </div>
                  {props.shadeDomains
                    ? `${props.focusedPoint.toString()} = ${formatComplexNumber(
                        props.focusedPoint.point,
                      )}`
                    : misiurewiczPointsList()}
                  <div style={{ marginBottom: 12 }}>in the Mandelbrot set</div>
                  <Typography variant="h6" component="h5" gutterBottom>
                    and
                  </Typography>
                  <Select
                    native
                    value={props.focusedPointJulia.point}
                    onChange={handleJuliaSimilarSelection}
                  >
                    {similarPoints.map((m) => (
                      <option value={m.point.toString()}>
                        {formatComplexNumber(m.point)}
                      </option>
                    ))}
                  </Select>
                  <Tooltip
                    title={`There are at least ${
                      similarPoints.length
                    } points in the Julia set for ${props.focusedPoint.toString()} that are similar to the point ${props.focusedPoint.toString()} in the Mandelbrot set!`}
                    placement="top"
                  >
                    <InfoIcon />
                  </Tooltip>
                  <div style={{ marginBottom: 12 }}>in the Julia set</div>
                  <Button
                    variant="contained"
                    style={{
                      float: 'right',
                    }}
                    onClick={() => {
                      props.setAnimationState(AnimationStatus.TRANSLATE_M);
                    }}
                  >
                    GO
                  </Button>
                </Card>
              ) : null}
              {props.animationState !== AnimationStatus.SELECT_JULIA_POINT &&
              props.animationState !== AnimationStatus.PLAY ? (
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
              {props.animationState === AnimationStatus.PLAY ? (
                <Card>
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
                  {zoomBar()}
                </Card>
              ) : null}
            </Card>
          ) : null}
        </div>
      </Grid>
    </Grow>
  );
};

export default SelectMisiurewiczCard;
