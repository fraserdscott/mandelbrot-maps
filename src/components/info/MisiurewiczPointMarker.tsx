import React from 'react';
import { Tooltip } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import { MisiurewiczPointMarkerProps } from '../../common/info';
import { complexNumbersEqual } from '../tansTheoremUtils';
import { animated } from 'react-spring';
import { screenScaleMultiplier } from '../../common/values';
import { AnimationStatus } from './MisiurewiczModeDiv';

const BUTTON_SIZE = 40;
const BUTTON_SIZE_OVER_4 = BUTTON_SIZE / 4;
const THREE_BUTTON_SIZE_OVER_4 = 3 * BUTTON_SIZE_OVER_4;

const MisiurewiczPointMarker = (props: MisiurewiczPointMarkerProps): JSX.Element => {
  const [{ z }] = props.viewerControl.zoomCtrl;
  const [{ theta }] = props.viewerControl.rotCtrl;

  const HEIGHT_OVER_2 = props.mapHeight / 2;
  const ASPECT_RATIO = props.mapWidth / props.mapHeight;

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
            if (
              props.show &&
              (props.animationState === AnimationStatus.NO_ANIMATION ||
                props.animationState === AnimationStatus.SELECT_JULIA_POINT) &&
              (complexNumbersEqual(props.m.point, props.focusedPoint.point) ||
                (props.offsetX === 0 &&
                  horizontalDistanceFromCentre < ASPECT_RATIO &&
                  verticalDistanceFromCentre < 1 &&
                  props.m.uMagnitude * props.m.period <
                    props.SHOW_POINT_THRESHOLD * z.getValue()) ||
                (props.offsetX > 0 &&
                  horizontalDistanceFromCentre < ASPECT_RATIO &&
                  verticalDistanceFromCentre < 1 &&
                  props.m.aMagnitude < 12 * z.getValue()))
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
          },
        ),
        bottom: props.viewerControl.xyCtrl[0].xy.interpolate(
          // @ts-expect-error: Function call broken in TS, waiting till react-spring v9 to fix
          (x, y) => {
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
          },
        ),
      }}
    >
      <Tooltip title={props.m.toString()} placement="top">
        <IconButton
          onClick={() => {
            props.setFocusedPoint(props.m);
            // this is needed when you click on a mandelbrot marker during julia selection
            //props.setFocusedPointJulia(new MisiurewiczPoint(props.m, 0));
          }}
          color={
            complexNumbersEqual(props.m.point, props.focusedPoint.point)
              ? 'primary'
              : 'secondary'
          }
        >
          <RoomIcon style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }} />
        </IconButton>
      </Tooltip>
    </animated.div>
  );
};

export default MisiurewiczPointMarker;
