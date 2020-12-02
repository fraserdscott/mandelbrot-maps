import React from 'react';
import { Tooltip } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import { MisiurewiczPointMarkerProps } from '../../common/info';
import {
  complexNumbersEqual,
  magnitude,
  orbit,
  orbitEigenvalue,
} from '../tansTheoremUtils';
import { animated } from 'react-spring';
import { screenScaleMultiplier } from '../../common/values';
import { AnimationStatus } from './MisiurewiczModeDiv';
import { MisiurewiczPoint } from './SelectMisiurewiczCard';
import { XYType } from '../../common/types';

const BUTTON_SIZE = 40;
const BUTTON_SIZE_OVER_4 = BUTTON_SIZE / 4;
const THREE_BUTTON_SIZE_OVER_4 = 3 * BUTTON_SIZE_OVER_4;

const MisiurewiczPointMarker = (props: MisiurewiczPointMarkerProps): JSX.Element => {
  const [{ z }] = props.viewerControl.zoomCtrl;
  const [{ theta }] = props.viewerControl.rotCtrl;

  const HEIGHT_OVER_2 = props.mapHeight / 2;
  const ASPECT_RATIO = props.mapWidth / props.mapHeight;

  const realToScreenX = (x: number, y: number) => {
    const negTheta = -theta.getValue();

    return (
      HEIGHT_OVER_2 *
        (((props.m.point[0] - x * screenScaleMultiplier) * Math.cos(negTheta) -
          (props.m.point[1] - y * screenScaleMultiplier) * Math.sin(negTheta)) *
          z.getValue() +
          ASPECT_RATIO) +
      props.offsetX -
      THREE_BUTTON_SIZE_OVER_4
    );
  };

  const imagToScreenY = (x: number, y: number) => {
    const negTheta = -theta.getValue();

    return (
      HEIGHT_OVER_2 *
        (((props.m.point[0] - x * screenScaleMultiplier) * Math.sin(negTheta) +
          (props.m.point[1] - y * screenScaleMultiplier) * Math.cos(negTheta)) *
          z.getValue() +
          1) +
      props.offsetY -
      BUTTON_SIZE_OVER_4
    );
  };

  return (
    <animated.div
      style={{
        zIndex: 100,
        position: 'absolute',
        visibility: props.viewerControl.xyCtrl[0].xy.interpolate(
          // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
          (x, y) => {
            const firstIterateInCycle = orbit(
              props.focusedPoint.point,
              props.focusedPoint.point,
              props.focusedPoint.prePeriod,
            );
            const limit = magnitude(
              orbitEigenvalue(
                firstIterateInCycle,
                props.focusedPoint.point,
                props.focusedPoint.period,
              ),
            );

            const negTheta = -theta.getValue();

            const hiX = props.m.point[0] - x * screenScaleMultiplier;
            const hiY = props.m.point[1] - y * screenScaleMultiplier;

            const horizontalDistanceFromCentre: number =
              z.getValue() *
              Math.abs(hiX * Math.cos(negTheta) - hiY * Math.sin(negTheta));
            const verticalDistanceFromCentre: number =
              z.getValue() *
              Math.abs(hiX * Math.sin(negTheta) + hiY * Math.cos(negTheta));
            const animationTakingPlace =
              props.animationState === AnimationStatus.NO_ANIMATION ||
              props.animationState === AnimationStatus.SELECT_JULIA_POINT;
            const withinBox =
              horizontalDistanceFromCentre < ASPECT_RATIO &&
              verticalDistanceFromCentre < 1;
            const mandelbrot = props.offsetX === 0;
            const atCorrectZoom = mandelbrot
              ? props.m.uMagnitude * props.m.period <
                props.SHOW_POINT_THRESHOLD * z.getValue()
              : props.m.aMagnitude < props.SHOW_POINT_THRESHOLD * limit * z.getValue();
            const thisIsFocused = complexNumbersEqual(
              props.m.point,
              props.focusedPoint.point,
            );
            if (
              props.show &&
              animationTakingPlace &&
              withinBox &&
              (atCorrectZoom || thisIsFocused)
            ) {
              return 'visible';
            } else {
              return 'hidden';
            }
          },
        ),
        left: props.viewerControl.xyCtrl[0].xy.interpolate(
          // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
          (x, y) => {
            return realToScreenX(x, y);
          },
        ),
        bottom: props.viewerControl.xyCtrl[0].xy.interpolate(
          // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
          (x, y) => {
            return imagToScreenY(x, y);
          },
        ),
      }}
    >
      <Tooltip title={props.m.toString()} placement="top">
        <IconButton
          onClick={() => {
            props.setFocusedPoint(props.m);
            props.setFocusedPointJulia(
              new MisiurewiczPoint(props.focusedPoint.point, 0, props.m.point),
            );
          }}
          color={props.color}
        >
          <RoomIcon style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }} />
        </IconButton>
      </Tooltip>
    </animated.div>
  );
};

export default MisiurewiczPointMarker;
