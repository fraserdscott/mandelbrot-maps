import React from 'react';
import { MisiurewiczModeFragmentProps } from '../../common/tans';
import { Card, Grid, IconButton, Typography, Box } from '@material-ui/core';
import { PreperiodicPoint } from '../tansTheoremUtils';
import PointsInfoCard from './MisiurewiczPointsMenu';
import MisiurewiczDomainsMenu from './MisiurewiczDomainsMenu';
import PlayCard from './PlayCard';
import ZoomMenu from './ZoomMenu';
import { misiurewiczPairs } from './MPoints';
import { XYType } from '../../common/types';
import ArrowBackwardIcon from '@material-ui/icons/ArrowBack';

export enum AnimationStatus {
  SELECT_MANDELBROT_POINT = 0,
  SELECT_JULIA_POINT = 1,
  ZOOM_M = 2,
  ZOOM_J = 3,
  ROTATE_M = 4,
  ROTATE_J = 5,
  PLAY = 6,
}

export const MISIUREWICZ_POINTS: PreperiodicPoint[] = misiurewiczPairs
  .slice(0, 200)
  .map((p) => new PreperiodicPoint(p, p, false))
  .sort((a, b) => a.factorMagnitude - b.factorMagnitude);

export const parsePoint = (s: string): XYType => {
  const commaSeperated = s.split(',');
  return [parseFloat(commaSeperated[0]), parseFloat(commaSeperated[1])];
};

const MisiurewiczModeFragment = (props: MisiurewiczModeFragmentProps): JSX.Element => {
  const BackButton = () => {
    return (
      <IconButton style={{ width: 50 }} onClick={props.handleReset}>
        <ArrowBackwardIcon />
      </IconButton>
    );
  };

  return (
    <>
      {props.animationState === AnimationStatus.SELECT_MANDELBROT_POINT ? (
        props.shadeDomains ? (
          <MisiurewiczDomainsMenu
            show={props.show}
            mandelbrot={props.mandelbrot}
            setAnimationState={props.setAnimationState}
            focusedPointMandelbrot={props.focusedPointMandelbrot}
          />
        ) : (
          <PointsInfoCard
            show={props.show}
            mandelbrot={props.mandelbrot}
            julia={props.julia}
            animationState={props.animationState}
            setAnimationState={props.setAnimationState}
            focusedPointMandelbrot={props.focusedPointMandelbrot}
            focusedPointJulia={props.focusedPointJulia}
            handleMandelbrotSelection={props.handleMandelbrotSelection}
          />
        )
      ) : null}

      {props.animationState === AnimationStatus.PLAY ? (
        <>
          <Card
            style={{
              padding: 12,
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 1,
              fontSize: '0.8rem',
            }}
          >
            <Grid container direction="row">
              <Grid item>{BackButton()}</Grid>
              <Grid item>
                <Typography gutterBottom>
                  You are now free to continue magnifying.
                </Typography>
                <Typography gutterBottom>
                  <Box fontWeight="fontWeightBold" m={0} textAlign="left">
                    higher magnification &#8594; stronger similarity
                  </Box>
                </Typography>
              </Grid>
            </Grid>
          </Card>
          {props.rotate ? (
            <PlayCard
              focusedPointMandelbrot={props.focusedPointMandelbrot}
              magnification={props.magnification}
            />
          ) : null}
        </>
      ) : null}
      {[
        AnimationStatus.ZOOM_M,
        AnimationStatus.ZOOM_J,
        AnimationStatus.ROTATE_M,
        AnimationStatus.ROTATE_J,
      ].includes(props.animationState) ? (
        <ZoomMenu
          backButton={BackButton}
          show={props.show}
          mandelbrot={props.mandelbrot}
          julia={props.julia}
          animationState={props.animationState}
          setAnimationState={props.setAnimationState}
          focusedPointMandelbrot={props.focusedPointMandelbrot}
          focusedPointJulia={props.focusedPointJulia}
        />
      ) : null}
    </>
  );
};

export default MisiurewiczModeFragment;
