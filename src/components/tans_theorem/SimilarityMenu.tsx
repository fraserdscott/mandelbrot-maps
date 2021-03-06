import { Button, Typography } from '@material-ui/core';
import React from 'react';
import { SimilarityMenuProps } from '../../common/info';
import { AnimationStatus } from './MisiurewiczModeFragment';
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
        GO
      </Button>
    );
  };

  return (
    <>
      <Typography
        style={{
          marginBottom: 8,
        }}
        variant="h6"
        gutterBottom
      >
        Pick a point in the Julia set!
      </Typography>
      <SimilarPointsList
        focusedPointMandelbrot={props.focusedPointMandelbrot}
        focusedPointJulia={props.focusedPointJulia}
        similarPointsJulia={props.similarPointsJulia}
        handleSimilarPointSelection={props.handleSimilarPointSelection}
      />
      {goButton(props.setAnimationState)}
    </>
  );
};

export default SimilarityMenu;
