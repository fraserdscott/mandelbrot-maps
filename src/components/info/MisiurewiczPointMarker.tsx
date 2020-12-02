import React from 'react';
import { Tooltip } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import { MisiurewiczPointMarkerProps } from '../../common/info';
import { complexNumbersEqual, MisiurewiczPoint } from '../tansTheoremUtils';
import { animated } from 'react-spring';
import { screenScaleMultiplier } from '../../common/values';
import { AnimationStatus } from './MisiurewiczModeDiv';

const BUTTON_SIZE = 40;
const BUTTON_SIZE_OVER_4 = BUTTON_SIZE / 4;
const THREE_BUTTON_SIZE_OVER_4 = 3 * BUTTON_SIZE_OVER_4;

export const handleJuliaSelection = (
  focusedPointJulia: MisiurewiczPoint,
  setFocusedPointJulia: React.Dispatch<React.SetStateAction<MisiurewiczPoint>>,
) => {
  setFocusedPointJulia(focusedPointJulia);
};

export const handleMandelbrotSelection = (
  focusedPointMandelbrot: MisiurewiczPoint,
  setFocusedPointMandelbrot: React.Dispatch<React.SetStateAction<MisiurewiczPoint>>,
  focusedPointJulia: MisiurewiczPoint,
  setFocusedPointJulia: React.Dispatch<React.SetStateAction<MisiurewiczPoint>>,
) => {
  setFocusedPointMandelbrot(focusedPointMandelbrot);
  setFocusedPointJulia(
    new MisiurewiczPoint(focusedPointMandelbrot.point, focusedPointJulia.point),
  );
};

export const animationNotTakingPlace = (animationState: AnimationStatus): boolean => {
  return (
    animationState === AnimationStatus.NO_ANIMATION ||
    animationState === AnimationStatus.SELECT_JULIA_POINT
  );
};

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
            const negTheta = -theta.getValue();

            const hiX = props.m.point[0] - x * screenScaleMultiplier;
            const hiY = props.m.point[1] - y * screenScaleMultiplier;

            const horizontalDistanceFromCentre: number =
              z.getValue() *
              Math.abs(hiX * Math.cos(negTheta) - hiY * Math.sin(negTheta));
            const verticalDistanceFromCentre: number =
              z.getValue() *
              Math.abs(hiX * Math.sin(negTheta) + hiY * Math.cos(negTheta));

            const withinBox =
              horizontalDistanceFromCentre < ASPECT_RATIO &&
              verticalDistanceFromCentre < 1;
            const mandelbrot = props.offsetX === 0;
            const atCorrectZoom = mandelbrot
              ? props.m.uMagnitude * props.m.period <
                props.SHOW_POINT_THRESHOLD * z.getValue()
              : props.m.aMagnitude < props.SHOW_POINT_THRESHOLD * z.getValue();
            const thisIsFocused = complexNumbersEqual(
              props.m.point,
              props.focusedPoint.point,
            );
            if (
              props.show &&
              animationNotTakingPlace(props.animationState) &&
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
            if (props.offsetX === 0) {
              handleMandelbrotSelection(
                props.m,
                props.setFocusedPoint,
                props.m,
                props.setFocusedPointJulia,
              );
            } else {
              handleJuliaSelection(props.m, props.setFocusedPointJulia);
            }
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
