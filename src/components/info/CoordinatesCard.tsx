import { Card, Typography } from '@material-ui/core';
import React from 'react';
import { animated } from 'react-spring';
import { CoordinatesCardProps } from '../../common/info';
import {
  defaultFloatFixedPrecision,
  shortFloatFixedPrecision,
} from '../../common/values';

const CoordinatesCard = (props: CoordinatesCardProps): JSX.Element => {
  return (
    <Card
      style={{
        width: 'auto',
        zIndex: 1300,
        position: 'relative',
        padding: '6px 12px',
        marginBottom: 8,
        // borderRadius: 100,
      }}
    >
      <Typography align="right" style={{ fontFamily: 'monospace', fontSize: '1.2rem' }}>
        {/* https://www.typescriptlang.org/docs/handbook/basic-types.html#tuple */}
        {/* https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types */}
        <animated.span>
          {props.mandelbrot.xy.interpolate(
            // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
            (x, y) => `${x.toFixed(defaultFloatFixedPrecision)} : x`,
          )}
        </animated.span>
        <br />
        <animated.span>
          {props.mandelbrot.xy.interpolate(
            // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
            (x, y) => `${y.toFixed(defaultFloatFixedPrecision)} : y`,
          )}
        </animated.span>
        <br />
        <animated.span>
          {props.mandelbrot.zoom.interpolate(
            (z) => `${z.toFixed(shortFloatFixedPrecision)} : z`,
          )}
        </animated.span>
        <br />
        <animated.span>
          {props.mandelbrot.theta.interpolate(
            (t) => `${t.toFixed(shortFloatFixedPrecision)} : t`,
          )}
        </animated.span>
      </Typography>
    </Card>
  );
};

export default CoordinatesCard;

// <Card
//   style={{
//     width: 'auto',
//     position: 'absolute',
//     zIndex: 2,
//     right: 0,
//     top: 0,
//     margin: 20,
//     padding: 8,
//     display: settings.coords[0] ? 'block' : 'none',
//     // borderRadius: 100,
//   }}
// >
//   <Typography align="right">
//     {/* https://www.typescriptlang.org/docs/handbook/basic-types.html#tuple */}
//     {/* https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types */}
//     <animated.span>
//       {mandelbrotControls.xyCtrl[0].xy.interpolate(
//         // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
//         (x, y) => `${(x * screenScaleMultiplier).toFixed(7)} : x`,
//       )}
//     </animated.span>
//     <br />
//     <animated.span>
//       {mandelbrotControls.xyCtrl[0].xy.interpolate(
//         // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
//         (x, y) => `${(y * screenScaleMultiplier).toFixed(7)} : y`,
//       )}
//     </animated.span>
//   </Typography>
// </Card>;
