import { Card, Slider } from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import { PlayCardProps } from '../../common/info';
import { cycleEigenvalue, magnitude, formatAngle } from '../tansTheoremUtils';

const TAU = Math.PI * 2;

const PlayCard = (props: PlayCardProps): JSX.Element => {
  const [eigenvalue] = useState(
    cycleEigenvalue(
      props.focusedPointMandelbrot.point,
      props.focusedPointMandelbrot.prePeriod,
      props.focusedPointMandelbrot.period,
    ),
  );

  const [eigenvalueMagnitude] = useState(magnitude(eigenvalue));
  const [eigenvalueTheta] = useState(Math.atan2(eigenvalue[1], eigenvalue[0]));

  const legOfJourney =
    (Math.log(props.magnification) / Math.log(eigenvalueMagnitude)) % 1;
  return (
    <div>
      <Card
        style={{
          zIndex: 1300,
          display: 'flex',
          left: 0,
          top: 50,
          flexDirection: 'column',
          flexShrink: 1,
          position: 'absolute',
        }}
      >
        <Slider
          value={legOfJourney}
          style={{
            height: '70vh',
          }}
          min={0}
          max={1}
          orientation="vertical"
          aria-labelledby="continuous-slider"
        />
        <Card
          style={{
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'row',
            flexShrink: 1,
          }}
        >
          {formatAngle(
            (Math.floor(Math.log(props.magnification) / Math.log(eigenvalueMagnitude)) *
              eigenvalueTheta) %
              TAU,
          )}
        </Card>
      </Card>
    </div>
  );
};

export default PlayCard;
