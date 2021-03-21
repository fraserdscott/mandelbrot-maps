import { CardProps } from '@material-ui/core';
import { OpaqueInterpolation } from 'react-spring';
import { AnimationStatus } from '../components/tans_theorem/MisiurewiczModeFragment';
import { PreperiodicPoint } from '../components/tansTheoremUtils';
import {
  precisionFormatterInterface,
  precisionSpecifier,
  ThetaType,
  ViewerControlSprings,
  XYType,
  ZoomType,
} from './types';

export interface MisiurewiczModeFragmentProps extends CardProps {
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  shadeDomains: boolean;
  show: boolean;
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  magnification: number;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  rotate: boolean;
  handleReset: () => void;
  handleMandelbrotSelection: (
    focusedPointMandelbrot: PreperiodicPoint,
    focusedPointJulia: PreperiodicPoint,
  ) => void;
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

export interface MisiurewiczDomainsMenuProps extends CardProps {
  show: boolean;
  mandelbrot: ViewerControlSprings;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPointMandelbrot: PreperiodicPoint;
}

export interface ZoomCardProps extends CardProps {
  show: boolean;
  mandelbrot: ViewerControlSprings;
  julia: ViewerControlSprings;
  animationState: AnimationStatus;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
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
  focusedPointMandelbrot: PreperiodicPoint;
  magnification: number;
}

export interface ComplexNumberMarkerProps extends CardProps {
  aspectRatio: number;
  m: PreperiodicPoint;
  viewerControl: ViewerControlSprings;
  onClick: () => void;
  isFocused: boolean;
}

export interface SimilarityAnimationProps extends CardProps {
  show: boolean;
  animationState: AnimationStatus;
  focusedPoint: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
}

export interface SimilarityMenuProps extends CardProps {
  show: boolean;
  julia: ViewerControlSprings;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  focusedPointMandelbrot: PreperiodicPoint;
  focusedPointJulia: PreperiodicPoint;
  handleSimilarPointSelection: (focusedPointJulia: PreperiodicPoint) => void;
  similarPointsJulia: PreperiodicPoint[];
  backButton: () => JSX.Element;
}
