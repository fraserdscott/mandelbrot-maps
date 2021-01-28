import { Card, Grow } from '@material-ui/core';
import React from 'react';
import { InfoCardProps } from '../../common/info';
import MisiurewiczPointInfoCard from './MisiurewiczPointInfoCard';

const DomainInfoCard = (props: InfoCardProps): JSX.Element => {
  return (
    <Grow in={props.show}>
      <Card
        style={{
          width: 'auto',
          zIndex: 1300,
          position: 'absolute',
          left: 0,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 1,
        }}
      >
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
    </Grow>
  );
};

export default DomainInfoCard;
