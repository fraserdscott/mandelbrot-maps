import { CardProps } from '@material-ui/core';
import { OpaqueInterpolation } from 'react-spring';
import { AnimationStatus } from '../components/tans_theorem/MisiurewiczModeFragment';
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

export interface InfoCardProps extends CardProps {
  show: boolean;
  shadeDomains: boolean;
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPoint: PreperiodicPoint;
  setFocusedPoint: React.Dispatch<React.SetStateAction<PreperiodicPoint>>;
  focusedPointJulia: PreperiodicPoint;
  setFocusedPointJulia: React.Dispatch<React.SetStateAction<PreperiodicPoint>>;
}

export interface ZoomBarProps extends CardProps {
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  focusedPoint: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  mag: number;
  setMagState: React.Dispatch<React.SetStateAction<number>>;
}

export interface PlayCardProps extends CardProps {
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
}

export interface MisiurewiczPointMarkerProps extends CardProps {
  mapWidth: number;
  mapHeight: number;
  offsetX: number;
  offsetY: number;
  m: PreperiodicPoint;
  mandelbrotControl: ViewerControlSprings;
  focusedPointMandelbrot: PreperiodicPoint;
  setFocusedPointMandelbrot: React.Dispatch<React.SetStateAction<PreperiodicPoint>>;
  setFocusedPointJulia: React.Dispatch<React.SetStateAction<PreperiodicPoint>>;
  setSimilarPointsJulia: React.Dispatch<React.SetStateAction<PreperiodicPoint[]>>;
}

export interface PreperiodicPointMarkerProps extends CardProps {
  mapWidth: number;
  mapHeight: number;
  offset: XYType;
  preperiodicPoint: PreperiodicPoint;
  viewerControl: ViewerControlSprings;
  focusedPointJulia: PreperiodicPoint;
  setFocusedPointJulia: React.Dispatch<React.SetStateAction<PreperiodicPoint>>;
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

export interface SimilarityMenuProps extends CardProps {
  show: boolean;
  shadeDomains: boolean;
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPoint: PreperiodicPoint;
  setFocusedPoint: React.Dispatch<React.SetStateAction<PreperiodicPoint>>;
  focusedPointJulia: PreperiodicPoint;
  setFocusedPointJulia: React.Dispatch<React.SetStateAction<PreperiodicPoint>>;
  similarPointsJulia: PreperiodicPoint[];
}

export interface InfoDialogProps {
  // control whether the info dialog should be displayed
  ctrl: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}
