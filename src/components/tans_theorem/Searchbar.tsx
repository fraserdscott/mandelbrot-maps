import { Card, Grow, InputLabel } from '@material-ui/core';
import React from 'react';
import { InfoCardProps } from '../../common/info';
import MisiurewiczPointsList from './MisiurewiczPointsList';

const Searchbar = (props: InfoCardProps): JSX.Element => {
  return (
    <Grow in={props.show}>
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

        <MisiurewiczPointsList
          show={props.show}
          shadeDomains={props.shadeDomains}
          mandelbrot={props.mandelbrot}
          julia={props.julia}
          animationState={props.animationState}
          setAnimationState={props.setAnimationState}
          focusedPoint={props.focusedPoint}
          setFocusedPoint={props.setFocusedPoint}
          focusedPointJulia={props.focusedPointJulia}
          setFocusedPointJulia={props.setFocusedPointJulia}
        ></MisiurewiczPointsList>
      </Card>
    </Grow>
  );
};

export default Searchbar;
