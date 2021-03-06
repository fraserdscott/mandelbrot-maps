import React, { useRef, useState } from 'react';
import { useGesture } from 'react-use-gesture';
import { JuliaRendererProps } from '../../common/render';
import { MandelbrotMapsWebGLUniforms } from '../../common/types';
import {
  frozenTouchBind,
  frozoneTouchBind,
  genericTouchBind,
  Rgb255ColourToFloat,
} from '../../common/utils';
import newSmoothJuliaShader from '../../shaders/newSmoothJuliaShader';
import { SettingsContext } from '../settings/SettingsContext';
import { AnimationStatus } from '../tans_theorem/MisiurewiczModeFragment';
import MinimapViewer from './MinimapViewer';
import WebGLCanvas from './WebGLCanvas';
export default function JuliaRenderer(props: JuliaRendererProps): JSX.Element {
  // variables to hold canvas and webgl information
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);

  const [{ xy }] = props.controls.xyCtrl;
  const [{ z }, setControlZoom] = props.controls.zoomCtrl;
  const [{ theta }] = props.controls.rotCtrl;
  const maxI = props.maxI; // -> global
  const AA = props.useAA ? 2 : 1;

  const fragShader = newSmoothJuliaShader({
    maxI: maxI,
    AA: AA,
  });

  const miniFragShader = newSmoothJuliaShader({
    maxI: maxI,
    AA: 2,
  });

  const u: MandelbrotMapsWebGLUniforms = {
    zoom: z,
    xy: xy,
    c: props.c,
    theta: theta,
    maxI: maxI,
    colour: Rgb255ColourToFloat(props.colour),
    orbit: [],
    orbit_length: -1,
    preperiod: -1,
  };

  const [dragging, setDragging] = useState(false);

  const gtb = [
    AnimationStatus.ZOOM_M,
    AnimationStatus.ZOOM_J,
    AnimationStatus.ROTATE_M,
    AnimationStatus.ROTATE_J,
  ].includes(props.animationState)
    ? frozoneTouchBind({
        domTarget: canvasRef,
        controls: props.controls,
        setDragging: setDragging,
        DPR: props.DPR,
      })
    : props.animationState === AnimationStatus.PLAY
    ? frozenTouchBind({
        domTarget: canvasRef,
        controls: props.controls,
        setDragging: setDragging,
        DPR: props.DPR,
        align: props.align,
      })
    : genericTouchBind({
        domTarget: canvasRef,
        controls: props.controls,
        // gl: gl,
        setDragging: setDragging,
        DPR: props.DPR,
      });

  useGesture(gtb.handlers, gtb.config);

  return (
    <SettingsContext.Consumer>
      {({ settings }) => (
        <div
          className="renderer"
          style={{
            position: 'relative',
          }}
        >
          <WebGLCanvas
            id="julia-canvas"
            fragShader={fragShader}
            DPR={props.DPR}
            u={u}
            ref={canvasRef}
            dragging={dragging}
          />
          <MinimapViewer
            id="julia-minimap-canvas"
            fragShader={miniFragShader}
            DPR={props.DPR}
            u={u}
            canvasRef={miniCanvasRef}
            onClick={() => setControlZoom({ z: 1 })}
            show={settings.showMinimap}
          />
        </div>
      )}
    </SettingsContext.Consumer>
  );
}
