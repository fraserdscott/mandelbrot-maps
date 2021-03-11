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

export interface MisiurewiczModeFragmentProps extends CardProps {
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  shadeDomains: boolean;
  show: boolean;
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  magnification: number;
  setMagnification: React.Dispatch<React.SetStateAction<number>>;
  focusedPointMandelbrot: PreperiodicPoint;
  setFocusedPointMandelbrot: React.Dispatch<React.SetStateAction<PreperiodicPoint>>;
  focusedPointJulia: PreperiodicPoint;
  setFocusedPointJulia: React.Dispatch<React.SetStateAction<PreperiodicPoint>>;
  rotate: boolean;
}

export interface InfoCardProps extends CardProps {
  show: boolean;
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  handleMandelbrotSelection: (
    focusedPointMandelbrot: PreperiodicPoint,
    focusedPointJulia: PreperiodicPoint,
  ) => void;
}

export interface ZoomCardProps extends CardProps {
  show: boolean;
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  handleMandelbrotSelection: (
    focusedPointMandelbrot: PreperiodicPoint,
    focusedPointJulia: PreperiodicPoint,
  ) => void;
  backButton: () => JSX.Element;
}

export interface MisiurewiczPointsListProps extends CardProps {
  show: boolean;
  mandelbrot: ViewerControlSprings;
  focusedPoint: PreperiodicPoint;
  handleMandelbrotSelection: (
    focusedPointMandelbrot: PreperiodicPoint,
    focusedPointJulia: PreperiodicPoint,
  ) => void;
}

export interface SimilarPointsListProps extends CardProps {
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  similarPointsJulia: PreperiodicPoint[];
  handleSimilarPointSelection: (focusedPointJulia: PreperiodicPoint) => void;
}

export interface PlayCardProps extends CardProps {
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  magnification: number;
}

export interface MisiurewiczPointMarkerProps extends CardProps {
  mapWidth: number;
  mapHeight: number;
  m: PreperiodicPoint;
  mandelbrotControl: ViewerControlSprings;
  focusedPointMandelbrot: PreperiodicPoint;
  handleMandelbrotSelection: (
    focusedPointMandelbrot: PreperiodicPoint,
    focusedPointJulia: PreperiodicPoint,
  ) => void;
  isFocused: boolean;
}

export interface PreperiodicPointMarkerProps extends CardProps {
  mapWidth: number;
  mapHeight: number;
  preperiodicPoint: PreperiodicPoint;
  viewerControl: ViewerControlSprings;
  focusedPointJulia: PreperiodicPoint;
  handleSimilarPointSelection: (focusedPointJulia: PreperiodicPoint) => void;
}

export interface SimilarityAnimationProps extends CardProps {
  show: boolean;
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPoint: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
}

export interface SimilarityMenuProps extends CardProps {
  show: boolean;
  shadeDomains: boolean;
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  handleSimilarPointSelection: (focusedPointJulia: PreperiodicPoint) => void;
  similarPointsJulia: PreperiodicPoint[];
  handleMandelbrotSelection: (
    focusedPointMandelbrot: PreperiodicPoint,
    focusedPointJulia: PreperiodicPoint,
  ) => void;
}

export interface InfoDialogProps {
  // control whether the info dialog should be displayed
  ctrl: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}
