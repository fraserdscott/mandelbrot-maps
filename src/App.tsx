import { Grid, ThemeProvider } from '@material-ui/core';
import React, { Dispatch, SetStateAction, useState } from 'react';
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
import MisiurewiczModeDiv, {
  AnimationStatus,
} from './components/info/MisiurewiczModeDiv';
import InfoDialog from './components/info/InfoDialog';
import JuliaRenderer from './components/render/JuliaRenderer';
// import 'typeface-roboto';
import MandelbrotRenderer from './components/render/MandelbrotRenderer';
import ServiceWorkerWrapper from './components/ServiceWorkerWrapper';
import SettingsProvider, { SettingsContext } from './components/settings/SettingsContext';
import SettingsMenu from './components/settings/SettingsMenu';
import { useWindowSize, warpToPoint } from './common/utils';
import theme from './theme/theme';
import MisiurewiczPointMarker from './components/info/MisiurewiczPointMarker';
import { MisiurewiczPoint } from './components/info/SelectMisiurewiczCard';

function App(): JSX.Element {
  const size = useWindowSize();

  const [focusedPoint, setFocusedPoint]: [
    MisiurewiczPoint,
    Dispatch<SetStateAction<MisiurewiczPoint>>,
  ] = React.useState(new MisiurewiczPoint([0.34982273901315925, -0.7017236471431629], 1));
  const [animationState, setAnimationState] = React.useState(
    AnimationStatus.NO_ANIMATION,
  );

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
                <MisiurewiczModeDiv
                  show={settings.showMisiurewiczPoints}
                  mandelbrot={mandelbrotControls}
                  julia={juliaControls}
                />
                <Grid item xs className="renderer">
                  <MisiurewiczPointMarker
                    m={focusedPoint}
                    width={
                      (size.width || 1) < (size.height || 0)
                        ? size.width || 1
                        : (size.width || 1) / 2
                    }
                    height={
                      (size.width || 1) < (size.height || 0)
                        ? (size.height || 0) / 2
                        : size.height || 0
                    }
                    show={true}
                    mandelbrot={mandelbrotControls}
                    julia={mandelbrotControls}
                    animationState={animationState}
                    setAnimationState={setAnimationState}
                    focusedPoint={focusedPoint}
                    setFocusedPoint={setFocusedPoint}
                    focusedPointJulia={focusedPoint}
                    setFocusedPointJulia={setFocusedPoint}
                    mag={1}
                  />
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
