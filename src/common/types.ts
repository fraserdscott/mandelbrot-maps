import { CSSProperties } from 'react';
import {
  AnimatedValue,
  OpaqueInterpolation,
  SetUpdateFn,
  SpringConfig,
} from 'react-spring';

// from react-spring
export type OverwriteKeys<A, B> = { [K in keyof A]: K extends keyof B ? B[K] : A[K] };

interface SpringControl {
  config?: SpringConfig;
}

export type XYType = [number, number];
export type ZoomType = number;
export type ThetaType = number;

/** An RGB colour in range [0, 255], maps to range [0, 1] by applying (x / 255) */
export type RgbFloatColour = [number, number, number];

/**
 * Holds viewer location data (can be used to control a view)
 */
export interface ViewerLocation {
  xy: XYType;
  z: ZoomType;
  theta: ThetaType;
}

export interface ViewerXYControl extends SpringControl {
  xy: XYType;
}

export interface ViewerZoomControl extends SpringControl {
  z: ZoomType;
  // last_pointer_dist: 0,
  minZoom: ZoomType;
  maxZoom: ZoomType;
}

export interface ViewerRotationControl extends SpringControl {
  theta: ThetaType;
}

export interface ViewerControls {
  xy: ViewerXYControl;
  zoom: ViewerZoomControl;
  rot: ViewerRotationControl;
}

// AnimatedValue<Pick<OverwriteKeys<ViewerXYControl, CSSProperties>, "xy">>, SetUpdateFn<OverwriteKeys<ViewerXYControl, CSSProperties>>]
export type SpringAnimatedValueOverwrite<T> = OverwriteKeys<T, CSSProperties>;
export type SpringAnimatedValueWithSetter<T> = [
  AnimatedValue<Pick<SpringAnimatedValueOverwrite<T>, keyof T>>,
  SetUpdateFn<SpringAnimatedValueOverwrite<T>>,
];

export type ViewerXYControlSpring = SpringAnimatedValueWithSetter<ViewerXYControl>;
export type ViewerZoomControlSpring = SpringAnimatedValueWithSetter<ViewerZoomControl>;
export type ViewerRotationControlSpring = SpringAnimatedValueWithSetter<
  ViewerRotationControl
>;

export interface ViewerControlSprings {
  xyCtrl: ViewerXYControlSpring;
  zoomCtrl: ViewerZoomControlSpring;
  rotCtrl: ViewerRotationControlSpring;
}

export interface MandelbrotMapsWebGLUniforms {
  xy: OpaqueInterpolation<XYType>;
  zoom: OpaqueInterpolation<ZoomType>;
  maxI: number;
  c?: { getValue: () => XYType };
  theta: OpaqueInterpolation<ThetaType>;
  colour: RgbFloatColour;
}

export interface DefaultRendererProps {
  controls: ViewerControls;
}

export type ReactUseStateType<T> = [T, React.Dispatch<React.SetStateAction<T>>];
