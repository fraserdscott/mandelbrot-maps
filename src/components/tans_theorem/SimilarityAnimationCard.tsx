import { Card, Stepper, StepLabel, Step, Grow } from '@material-ui/core';
import React from 'react';
import {
  formatAngle,
  formatComplexNumber,
  PreperiodicPoint,
  round,
} from '../tansTheoremUtils';
import { SimilarityAnimationProps } from '../../common/info';
import { AnimationStatus } from './MisiurewiczModeFragment';

function getSteps(
  c: PreperiodicPoint,
  cj: PreperiodicPoint,
  animationState: AnimationStatus,
) {
  if (animationState === AnimationStatus.SELECT_MANDELBROT_POINT) {
    return [
      ['Select point in M', `?`],
      ['Select point in J', `?`],
      ['Magnify M', `?x`],
      ['Magnify J', `?x`],
      ['Rotate M', `?°`],
      ['Rotate J', `?°`],
    ];
  } else if (animationState === AnimationStatus.SELECT_JULIA_POINT) {
    return [
      ['Select point in M', `${formatComplexNumber(c.point)}`],
      ['Select point in J', `?`],
      ['Magnify M', `${round(c.uMagnitude, 1)}x`],
      ['Magnify J', `?x`],
      ['Rotate M', `${formatAngle(c.uAngle)}`],
      ['Rotate J', `?°`],
    ];
  } else {
    return [
      ['Select point in M', `${formatComplexNumber(c.point)}`],
      ['Select point in J', `${formatComplexNumber(cj.point)}`],
      ['Magnify M', `${round(c.uMagnitude, 1)}x`],
      ['Magnify J', `${round(cj.aMagnitude, 1)}x`],
      ['Rotate M', `${formatAngle(c.uAngle)}`],
      ['Rotate J', `${formatAngle(cj.aAngle)}`],
    ];
  }
}

const SimilarityAnimationCard = (props: SimilarityAnimationProps): JSX.Element => {
  const steps = getSteps(
    props.focusedPoint,
    props.focusedPointJulia,
    props.animationState,
  );

  return (
    <Grow in={props.show}>
      <div
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          position: 'absolute',
        }}
      >
        <Card
          style={{
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'row',
            flexShrink: 1,
          }}
        >
          <Stepper activeStep={props.animationState.valueOf()} orientation="horizontal">
            {steps.map((label) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: { optional?: React.ReactNode } = {};
              labelProps.optional = label[1];
              return (
                <Step key={label[0]} {...stepProps}>
                  <StepLabel {...labelProps}>{label[0]}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Card>
      </div>
    </Grow>
  );
};

export default SimilarityAnimationCard;
