import { CardProps } from '@material-ui/core';
import { OpaqueInterpolation } from 'react-spring';
import { MisiurewiczPoint } from '../components/info/SelectMisiurewiczCard';
import { AnimationStatus } from '../components/info/MisiurewiczModeDiv';
import {
  ThetaType,
  ViewerRotationControlSpring,
  ViewerXYControlSpring,
  ViewerZoomControlSpring,
  XYType,
  ZoomType,
} from './types';

export interface FPSCardProps {
  fps: string;
  show: boolean;
}

export interface CoordinatesCardProps extends CardProps {
  show: boolean;
  // screenScaleMultiplier: number;
  mandelbrot: {
    xy: OpaqueInterpolation<XYType>;
    zoom: OpaqueInterpolation<ZoomType>;
    theta: OpaqueInterpolation<ThetaType>;
  };
  julia?: OpaqueInterpolation<XYType>;
}

export interface ViewerControls {
  xyCtrl: ViewerXYControlSpring;
  rotCtrl: ViewerRotationControlSpring;
  zoomCtrl: ViewerZoomControlSpring;
}

export interface ChangeCoordinatesCardProps extends CardProps {
  show: boolean;
  // screenScaleMultiplier: number;
  mandelbrot: ViewerControls;
  julia?: OpaqueInterpolation<XYType>;
}

export interface MisiurewiczModeDivProps extends CardProps {
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  canon: boolean;
  show: boolean;
  mandelbrot: ViewerControls;
  julia: ViewerControls;
}

export interface SelectMisiurewiczCardProps extends CardProps {
  show: boolean;
  canon: boolean;
  // screenScaleMultiplier: number;
  mandelbrot: ViewerControls;
  julia: ViewerControls;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPoint: MisiurewiczPoint;
  setFocusedPoint: React.Dispatch<React.SetStateAction<MisiurewiczPoint>>;
  focusedPointJulia: MisiurewiczPoint;
  setFocusedPointJulia: React.Dispatch<React.SetStateAction<MisiurewiczPoint>>;
  mag: number;
  setMagState: React.Dispatch<React.SetStateAction<number>>;
}

export interface MisiurewiczPointMarkerProps extends CardProps {
  show: boolean;
  mapWidth: number;
  mapHeight: number;
  offsetX: number;
  offsetY: number;
  SHOW_POINT_THRESHOLD: number;
  m: MisiurewiczPoint;
  viewerControl: ViewerControls;
  mandelbrotControl: ViewerControls;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPoint: MisiurewiczPoint;
  setFocusedPoint: React.Dispatch<React.SetStateAction<MisiurewiczPoint>>;
}

export interface MisiurewiczInfoCardProps extends CardProps {
  show: boolean;
  mandelbrot: ViewerControls;
  julia: ViewerControls;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPoint: MisiurewiczPoint;
  setFocusedPoint: React.Dispatch<React.SetStateAction<MisiurewiczPoint>>;
  focusedPointJulia: MisiurewiczPoint;
  setFocusedPointJulia: React.Dispatch<React.SetStateAction<MisiurewiczPoint>>;
}
