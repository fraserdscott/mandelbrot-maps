import { Button, Card, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { SimilarityMenuProps } from '../../common/tans';
import { AnimationStatus } from './AnimationFinalCard';
import SimilarPointsList from './SimilarPointsList';
import { warpToPoint } from '../../common/utils';

const SimilarityMenu = (props: SimilarityMenuProps): JSX.Element => {
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
          setAnimationState(AnimationStatus.ZOOM_M);
          warpToPoint(props.julia, {
            xy: props.focusedPointJulia.point,
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
    <Card
      style={{
        padding: 12,
        zIndex: 1400,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 1,
        marginBottom: 8,
      }}
    >
      <Grid container>
        <Grid item>{props.backButton()}</Grid>
        <Grid item>
          <Typography
            style={{
              marginBottom: 8,
            }}
            variant="h6"
            gutterBottom
          >
            Pick a point in the Julia set!
          </Typography>
        </Grid>
      </Grid>
      <SimilarPointsList
        focusedPointMandelbrot={props.focusedPointMandelbrot}
        focusedPointJulia={props.focusedPointJulia}
        similarPointsJulia={props.similarPointsJulia}
        handleSimilarPointSelection={props.handleSimilarPointSelection}
      />
      {goButton(props.setAnimationState)}
    </Card>
  );
};

export default SimilarityMenu;
