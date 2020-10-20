import { Grid, ThemeProvider } from '@material-ui/core';
import React, { useState } from 'react';
import { OpaqueInterpolation, useSpring } from 'react-spring';
import { vScale } from 'vec-la-fp';
import './App.css';
import {
  ViewerRotationControl,
  ViewerXYControl,
  ViewerZoomControl,
  ZoomType,
} from './common/types';
import {
  screenScaleMultiplier,
  springsConfigs,
  startPos,
  startTheta,
  startZoom,
  viewerOrigin,
} from './common/values';
import ChangeCoordinatesCard from './components/info/ChangeCoordinatesCard';
import CoordinatesCard from './components/info/CoordinatesCard';
import ChangeMisiurewiczCard from './components/info/ChangeMisiurewiczCard';
import InfoDialog from './components/info/InfoDialog';
import JuliaRenderer from './components/render/JuliaRenderer';
// import 'typeface-roboto';
import MandelbrotRenderer from './components/render/MandelbrotRenderer';
import ServiceWorkerWrapper from './components/ServiceWorkerWrapper';
import SettingsProvider, { SettingsContext } from './components/settings/SettingsContext';
import SettingsMenu from './components/settings/SettingsMenu';
import { useWindowSize, warpToPoint } from './components/utils';
import theme from './theme/theme';

// coordinates of each point, along with zoom and theta
export const misiurewiczPoints: [[number, number], number, number][] = [
  [[-0.562204, 0.6428146], 7, 0.2],
  [[-0.1010963, 0.9562867], 250, 0.3],
  [[-2, 0], 70, 0],
  [[-0.9870042, -0.3129012], 1900, 0.6],
];

export const misiurewiczFlat: number[] = [
  -0.562204,
  0.6428146,
  -0.1010963,
  0.9562867,
  -2,
  0,
  -0.9870042,
  -0.3129012,
];
function App(): JSX.Element {
  const size = useWindowSize();

  // this multiplier subdivides the screen space into smaller increments
  // to allow for velocity calculations to not immediately decay, due to the
  // otherwise small scale that is being mapped to the screen.

  const mandelbrotControls = {
    xyCtrl: useSpring<ViewerXYControl>(() => ({
      xy: vScale(1 / screenScaleMultiplier, startPos),
      config: springsConfigs.default.xy,
    })),

    zoomCtrl: useSpring<ViewerZoomControl>(() => ({
      z: startZoom,
      minZoom: 0.5,
      maxZoom: 100000,
      config: springsConfigs.default.zoom,
    })),

    rotCtrl: useSpring<ViewerRotationControl>(() => ({
      theta: startTheta, // should this be rad or deg? rad
      config: springsConfigs.default.rot,
    })),
  };

  const juliaControls = {
    xyCtrl: useSpring<ViewerXYControl>(() => ({
      xy: [0, 0] as [number, number],
      config: springsConfigs.default.xy,
    })),

    zoomCtrl: useSpring<ViewerZoomControl>(() => ({
      z: 0.5 as number,
      minZoom: 0.5,
      maxZoom: 2000,
      config: springsConfigs.default.zoom,
    })),

    rotCtrl: useSpring<ViewerRotationControl>(() => ({
      theta: 0, // should this be rad or deg? rad
      config: springsConfigs.default.rot,
    })),
  };

  const reset = () => {
    warpToPoint(mandelbrotControls, viewerOrigin);
    warpToPoint(juliaControls, viewerOrigin);
  };

  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => setShowInfo(!showInfo);

  // const { settings } = useSettings();

  return (
    <ThemeProvider theme={theme}>
      <ServiceWorkerWrapper />
      <SettingsProvider>
        <Grid container>
          <SettingsContext.Consumer>
            {({ settings }) => (
              <Grid
                item
                container
                direction={
                  (size.width || 1) < (size.height || 0) ? 'column-reverse' : 'row'
                }
                justify="center"
                className="fullSize"
                style={{
                  position: 'absolute',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    margin: 20,
                    width: 'auto',
                  }}
                >
                  <ChangeMisiurewiczCard
                    show={settings.showMisiurewiczPoints}
                    mandelbrot={mandelbrotControls}
                    julia={juliaControls}
                  />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    margin: 20,
                    width: 'auto',
                  }}
                >
                  <CoordinatesCard
                    show={settings.showCoordinates}
                    mandelbrot={{
                      xy: mandelbrotControls.xyCtrl[0].xy,
                      zoom: mandelbrotControls.zoomCtrl[0].z as OpaqueInterpolation<
                        ZoomType
                      >,
                      theta: mandelbrotControls.rotCtrl[0].theta,
                    }}
                  />
                  <ChangeCoordinatesCard
                    show={settings.showCoordinates}
                    mandelbrot={mandelbrotControls}
                  />
                </div>
                <Grid item xs className="renderer">
                  <MandelbrotRenderer controls={mandelbrotControls} {...settings} />
                </Grid>
                <Grid item xs className="renderer">
                  <JuliaRenderer
                    c={mandelbrotControls.xyCtrl[0].xy}
                    controls={juliaControls}
                    {...settings}
                  />
                </Grid>
              </Grid>
            )}
          </SettingsContext.Consumer>

          <SettingsMenu reset={() => reset()} toggleInfo={() => toggleInfo()} />

          <InfoDialog ctrl={[showInfo, setShowInfo]} />
        </Grid>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
