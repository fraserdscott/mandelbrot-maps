import { Card, Slider } from '@material-ui/core';
import React from 'react';
import { PlayCardProps } from '../../common/tans';

const PlayCard = (props: PlayCardProps): JSX.Element => {
  const x =
    Math.log(props.magnification) /
    Math.log(props.focusedPointMandelbrot.selfSimilarityFactorMagnitude);
  const y = Math.abs(x) % 1;
  const progress = x < 0 ? 1 - y : y;
  return (
    <Card>
      <Slider
        value={progress}
        style={{
          height: '60vh',
        }}
        min={0}
        max={1}
        track={false}
        orientation="vertical"
        aria-labelledby="continuous-slider"
      />
    </Card>
  );
};

export default PlayCard;
