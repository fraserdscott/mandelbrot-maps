import React, { useEffect, useRef, useState } from 'react';
import { useGesture } from 'react-use-gesture';
import { forwardOrbit } from '../../common/complex_number_utils';
import { MandelbrotRendererProps } from '../../common/render';
import { MandelbrotMapsWebGLUniforms } from '../../common/types';
import {
  genericTouchBind,
  frozenTouchBind,
  Rgb255ColourToFloat,
  frozoneTouchBind,
} from '../../common/utils';
import newSmoothMandelbrotShader, {
  miniCrosshair,
  standardCrosshair,
} from '../../shaders/newSmoothMandelbrotShader';
import misiurewiczDomainsMandelbrotShader from '../../shaders/misiurewiczDomainsMandelbrotShader';
import FPSCard from '../info/FPSCard';
import OrbitCard from '../info/OrbitCard';
import { SettingsContext } from '../settings/SettingsContext';
import MinimapViewer from './MinimapViewer';
import WebGLCanvas from './WebGLCanvas';
import { AnimationStatus } from '../tans_theorem/MisiurewiczModeFragment';

export const MAX_ORBIT_LENGTH = 400;

export default function MandelbrotRenderer({
  precision,
  ...props
}: MandelbrotRendererProps): JSX.Element {
  // variables to hold canvas and webgl information
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);

  // const gl = useRef<WebGLRenderingContext>(null);
  // const miniGl = useRef<WebGLRenderingContext>(null);

  // this multiplier subdivides the screen space into smaller increments
  // to allow for velocity calculations to not immediately decay, due to the
  // otherwise small scale that is being mapped to the screen.
  // const screenScaleMultiplier = props.screenScaleMultiplier; // -> global

  // temporary bounds to prevent excessive panning
  // eslint-disable-next-line
  // const radialBound = 1;
  // const relativeRadialBound = radialBound;// / -screenScaleMultiplier;

  // read incoming props
  const [{ xy }] = props.controls.xyCtrl;
  // const [{ theta, last_pointer_angle }, setControlRot] = props.controls.rot;
  const [{ z }] = props.controls.zoomCtrl;
  const [{ theta }] = props.controls.rotCtrl;
  const maxI = props.maxI; // -> global
  const AA = props.useAA ? 2 : 1; // -> global

  const fragShaderMisiurewiczDomain = misiurewiczDomainsMandelbrotShader(
    {
      maxI: maxI,
      AA: AA,
    },
    props.showCrosshair,
    standardCrosshair,
  );
  const fragShader = newSmoothMandelbrotShader(
    {
      maxI: maxI,
      AA: AA,
    },
    props.showCrosshair,
    props.showOrbit,
    standardCrosshair,
  );
  const miniFragShader = newSmoothMandelbrotShader(
    {
      maxI: maxI,
      AA: 2,
    },
    props.showCrosshair,
    props.showOrbit,
    miniCrosshair,
  );

  const [orbitInfo, setOrbitInfo] = useState(
    forwardOrbit(xy.getValue(), xy.getValue(), MAX_ORBIT_LENGTH),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (props.showOrbit)
        setOrbitInfo(forwardOrbit(xy.getValue(), xy.getValue(), MAX_ORBIT_LENGTH));
    }, 1);
    return () => clearInterval(interval);
  }, [props.showOrbit, xy]);

  const u: MandelbrotMapsWebGLUniforms = {
    zoom: z,
    xy: xy,
    theta: theta,
    maxI: maxI,
    colour: Rgb255ColourToFloat(props.colour), // vec3(0.0,0.6,1.0)
    orbit: orbitInfo[0].flat(),
    orbit_length: orbitInfo[0].length,
    preperiod: orbitInfo[1],
  };

  const [dragging, setDragging] = useState(false);

  const gtb = [
    AnimationStatus.SELECT_JULIA_POINT,
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
        precision: precision,
      })
    : props.animationState === AnimationStatus.PLAY
    ? frozenTouchBind({
        domTarget: canvasRef,
        controls: props.controls,
        setDragging: setDragging,
        DPR: props.DPR,
        align: props.align,
        precision: precision,
      })
    : genericTouchBind({
        domTarget: canvasRef,
        controls: props.controls,
        // gl: gl,
        setDragging: setDragging,
        DPR: props.DPR,
        precision: precision,
      });

  // https://use-gesture.netlify.app/docs/changelog/#breaking
  // When adding events directly to the dom element using `domTarget`
  // you no longer need to clean the effect yourself.
  // const touchBind =
  useGesture(gtb.handlers, gtb.config);

  // useEffect(() => {
  //   touchBind();
  // }, [touchBind]);

  const [FPS, setFPS] = useState('');

  return (
    <SettingsContext.Consumer>
      {({ settings }) => (
        <div
          className="renderer"
          style={{
            position: 'relative',
          }}
        >
          <OrbitCard
            show={settings.showOrbit}
            xy={xy}
            preperiod={orbitInfo[1]}
            period={orbitInfo[2]}
            flag={orbitInfo[3]}
          />
          <FPSCard fps={FPS} show={settings.showFPS} />
          <WebGLCanvas
            id="mandelbrot-canvas"
            fragShader={
              settings.showMisiurewiczPoints &&
              settings.shadeMisiurewiczDomains &&
              props.animationState === AnimationStatus.SELECT_MANDELBROT_POINT
                ? fragShaderMisiurewiczDomain
                : fragShader
            }
            DPR={props.DPR}
            // touchBind={touchBind}
            u={u}
            ref={canvasRef}
            // glRef={gl}
            setFPS={setFPS}
            dragging={dragging}
          />
          <MinimapViewer
            id="mandelbrot-minimap-canvas"
            fragShader={miniFragShader}
            DPR={props.DPR}
            u={u}
            canvasRef={miniCanvasRef}
            // glRef={miniGl}
            show={settings.showMinimap}
            controls={props.controls}
          />
        </div>
      )}
    </SettingsContext.Consumer>
  );
}
