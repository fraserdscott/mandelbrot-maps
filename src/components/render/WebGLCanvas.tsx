import React, { useCallback, useEffect, useRef } from 'react';
import { animated } from 'react-spring';
import * as twgl from 'twgl.js';
import { WebGLCanvasProps } from '../../common/render';
import { fullscreenVertexArray, fullVertexShader } from '../../shaders/fullVertexShader';

// https://mariusschulz.com/blog/typing-destructured-object-parameters-in-typescript
// https://stackoverflow.com/a/50294843/9184658
const WebGLCanvas = React.forwardRef<HTMLCanvasElement, WebGLCanvasProps>(
  (props: WebGLCanvasProps, refAny) => {
    // const { mini = false, ...rest } = props;
    // props:
    // id
    // fragShader
    // -- uniforms:
    //    u_zoom
    //    u_pos
    //    u_maxI
    // ref
    // glRef

    const canvasRef = refAny as React.MutableRefObject<HTMLCanvasElement>;

    const gl = useRef<WebGLRenderingContext | null>();
    const renderRequestRef = useRef<number>();
    const bufferInfo = useRef<twgl.BufferInfo>();
    const programInfo = useRef<twgl.ProgramInfo>();

    const u = props.u;
    const setFps = props.fps;

    // have a zoom callback
    // keeps minimaps at a fixed zoom level
    const zoom = useCallback(() => (props.mini ? 0.95 : props.u.zoom.getValue()), [
      props.mini,
      props.u.zoom,
    ]);

    // const DPR = props.useDPR ? props.DPR : 1;

    // canvas setup step - get webgl context
    const setupCanvas = useCallback(() => {
      gl.current = canvasRef.current.getContext('webgl');
      console.debug(`WebGL canvas context created`);
    }, [gl, canvasRef]);

    useEffect(() => {
      setupCanvas();

      // https://www.khronos.org/webgl/wiki/HandlingContextLost
      canvasRef.current.addEventListener(
        'webglcontextlost',
        (event: Event) => {
          console.error('WebGL context lost!');
          event.preventDefault();
          // trigger an error alert in future?
        },
        false,
      );
      canvasRef.current.addEventListener(
        'webglcontextrestored',
        (event: Event) => {
          console.error('WebGL context restored! Setting up...');
          setupCanvas();
        },
        false,
      );

      // remove this context?
      // return () => gl.current ??
    }, [canvasRef, setupCanvas]);

    const compileShader = useCallback(() => {
      const ctx = gl.current as WebGLRenderingContext;
      bufferInfo.current = twgl.createBufferInfoFromArrays(ctx, fullscreenVertexArray);
      programInfo.current = twgl.createProgramInfo(ctx, [
        fullVertexShader,
        props.fragShader,
      ]);
      console.debug(`Fragment shader compiled`);
    }, [gl, props.fragShader]);

    // re-compile program if shader changes
    useEffect(compileShader, [compileShader]);

    const then = useRef(0);
    const frames = useRef(0);
    const elapsedTime = useRef(0);
    // fps update interval
    const interval = 1000;

    // the main render function for WebGL
    const render = useCallback(
      (time) => {
        const ctx = gl.current as WebGLRenderingContext;
        const prog = programInfo.current as twgl.ProgramInfo;
        const buff = bufferInfo.current as twgl.BufferInfo;

        twgl.resizeCanvasToDisplaySize(canvasRef.current, props.DPR);
        // scale the viewport to the canvas size
        ctx.viewport(0, 0, canvasRef.current.width, canvasRef.current.height);

        const uniforms = {
          resolution: [canvasRef.current.width, canvasRef.current.height],
          u_zoom: zoom(),
          u_c: u.c === undefined ? 0 : u.c.getValue(),
          u_xy: u.xy.getValue(),
          u_maxI: u.maxI,
          u_theta: u.theta.getValue(),
          u_colour: u.colour,
        };

        ctx.useProgram(prog.program);
        twgl.setBuffersAndAttributes(ctx, prog, buff);
        twgl.setUniforms(prog, uniforms);
        twgl.drawBufferInfo(ctx, buff);

        // calculate fps
        if (setFps !== undefined) {
          frames.current++;
          elapsedTime.current += time - then.current;
          then.current = time;

          // console.log(elapsedTime.current);
          if (elapsedTime.current >= interval) {
            //multiply with (1000 / elapsed) for accuracy
            setFps((frames.current * (interval / elapsedTime.current)).toFixed(1));
            frames.current = 0;
            elapsedTime.current -= interval;

            // document.getElementById('test').innerHTML = fps;
          }
        }

        // The 'state' will always be the initial value here
        renderRequestRef.current = requestAnimationFrame(render);
      },
      [gl, u, zoom, props.DPR, setFps, interval, canvasRef],
    );

    useEffect(() => {
      renderRequestRef.current = requestAnimationFrame(render);
      return () => cancelAnimationFrame(renderRequestRef.current as number);
    }, [render]);

    return (
      <animated.canvas
        className="renderer"
        ref={refAny}
        id={props.id}
        style={{
          // cursor should show whether the viewer is being grabbed
          cursor: props.dragging ? 'grabbing' : 'grab',
          // adding style allows direct style override
          ...props.style,
        }}
      />
    );
  },
);

WebGLCanvas.displayName = 'WebGLCanvas';

export default WebGLCanvas;
