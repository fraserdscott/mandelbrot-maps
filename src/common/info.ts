import { CardProps } from '@material-ui/core';
import { OpaqueInterpolation } from 'react-spring';
import { AnimationStatus } from '../components/info/MisiurewiczModeDiv';
import { PreperiodicPoint } from '../components/tansTheoremUtils';
import { ThetaType, ViewerControlSprings, XYType, ZoomType } from './types';

export interface FPSCardProps {
  fps: string;
  show: boolean;
}

export interface CoordinatesCardProps extends CardProps {
  mandelbrot: {
    xy: OpaqueInterpolation<XYType>;
    zoom: OpaqueInterpolation<ZoomType>;
    theta: OpaqueInterpolation<ThetaType>;
  };
  julia?: OpaqueInterpolation<XYType>;
}

export interface ChangeCoordinatesCardProps extends CardProps {
  mandelbrot: ViewerControlSprings;
  julia?: OpaqueInterpolation<XYType>;
}

export interface MisiurewiczModeDivProps extends CardProps {
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  shadeDomains: boolean;
  show: boolean;
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
}

export interface SelectMisiurewiczCardProps extends CardProps {
  show: boolean;
  shadeDomains: boolean;
  // screenScaleMultiplier: number;
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPoint: PreperiodicPoint;
  setFocusedPoint: React.Dispatch<React.SetStateAction<PreperiodicPoint>>;
  focusedPointJulia: PreperiodicPoint;
  setFocusedPointJulia: React.Dispatch<React.SetStateAction<PreperiodicPoint>>;
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
  m: PreperiodicPoint;
  viewerControl: ViewerControlSprings;
  mandelbrotControl: ViewerControlSprings;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPoint: PreperiodicPoint;
  setFocusedPoint: React.Dispatch<React.SetStateAction<PreperiodicPoint>>;
  setFocusedPointJulia: React.Dispatch<React.SetStateAction<PreperiodicPoint>>;
  color: 'inherit' | 'primary' | 'secondary' | 'default' | undefined;
}

export interface MisiurewiczInfoCardProps extends CardProps {
  show: boolean;
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPoint: PreperiodicPoint;
  setFocusedPoint: React.Dispatch<React.SetStateAction<PreperiodicPoint>>;
  focusedPointJulia: PreperiodicPoint;
  setFocusedPointJulia: React.Dispatch<React.SetStateAction<PreperiodicPoint>>;
}
export interface InfoDialogProps {
  // control whether the info dialog should be displayed
  ctrl: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}
