import { Card, Slider } from '@material-ui/core';
import React from 'react';
import { PlayCardProps } from '../../common/info';

const PlayCard = (props: PlayCardProps): JSX.Element => {
  const legOfJourney =
    (Math.log(props.magnification) / Math.log(props.focusedPointMandelbrot.eMagnitude)) %
    1;
  return (
    <div>
      <Card
        style={{
          zIndex: 1300,
          display: 'flex',
          left: 0,
          top: 70,
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
          track={false}
          orientation="vertical"
          aria-labelledby="continuous-slider"
        />
        {/* <Card
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
        </Card> */}
      </Card>
    </div>
  );
};

export default PlayCard;
