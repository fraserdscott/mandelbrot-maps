import { Grid, ThemeProvider } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSpring } from 'react-spring';
import './App.css';
import {
  currentLocation,
  useHashLocation,
  useHashNavigator,
  ViewerURLManager,
} from './common/routing';
import {
  ViewerControlSprings,
  ViewerLocation,
  ViewerRotationControl,
  ViewerXYControl,
  ViewerZoomControl,
} from './common/types';
import { useWindowSize, warpToPoint } from './common/utils';
import { springsConfigs, viewerOrigin } from './common/values';
import CoordinateInterface from './components/info/CoordinateInterface';
import FirstTimeInfo from './components/info/FirstTimeInfo';
import InfoDialog from './components/info/InfoDialog';
import MisiurewiczModeFragment, {
  AnimationStatus,
} from './components/tans_theorem/MisiurewiczModeFragment';
import JuliaRenderer from './components/render/JuliaRenderer';
// import 'typeface-roboto';
import MandelbrotRenderer from './components/render/MandelbrotRenderer';
import ViewChanger from './components/render/ViewChanger';
import ServiceWorkerWrapper from './components/ServiceWorkerWrapper';
import SettingsProvider, { SettingsContext } from './components/settings/SettingsContext';
import SettingsMenu from './components/settings/SettingsMenu';
import theme from './theme/theme';
import { PreperiodicPoint } from './components/tansTheoremUtils';

const defaultMisiurewiczPoint = new PreperiodicPoint(
  [-0.10109636384562218, +0.9562865108091414],
  [-0.10109636384562218, +0.9562865108091414],
);

function App(): JSX.Element {
  const size = useWindowSize();
  const DPR = window.devicePixelRatio;

  // if app is started with a hash location, assume
  // it should be the starting position
  // detects hash updates
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loc, navigate] = useHashLocation();

  // non-reloading hash update
  const updateBrowserHash = useHashNavigator();

  const urlManager = useMemo(() => new ViewerURLManager(), []);

  // generic callback
  const updateHash = useCallback(
    (name: string, v: Partial<ViewerLocation>) => {
      urlManager.updateViewer(name, v);
      const u = urlManager.asFullHashURL();
      // console.debug(`Updated # for ${name} => ${u}`);
      updateBrowserHash(u);
    },
    [updateBrowserHash, urlManager],
  );

  // callbacks for springs to update url when animation stops
  const updateM = (v: Partial<ViewerLocation>) => updateHash('m', v);
  const updateJ = (v: Partial<ViewerLocation>) => updateHash('j', v);

  const mandelbrotControls: ViewerControlSprings = {
    xyCtrl: useSpring<ViewerXYControl>(() => ({
      xy: viewerOrigin.xy,
      config: springsConfigs.default.xy,
      onRest: updateM,
    })),

    zoomCtrl: useSpring<ViewerZoomControl>(() => ({
      z: viewerOrigin.z,
      minZoom: 0.5,
      maxZoom: 100000,
      config: springsConfigs.default.zoom,
      onRest: updateM,
    })),

    rotCtrl: useSpring<ViewerRotationControl>(() => ({
      theta: viewerOrigin.theta, // all angles in rad
      config: springsConfigs.default.rot,
      onRest: updateM,
    })),
  };

  const juliaControls: ViewerControlSprings = {
    xyCtrl: useSpring<ViewerXYControl>(() => ({
      xy: viewerOrigin.xy,
      config: springsConfigs.default.xy,
      onRest: updateJ,
    })),

    zoomCtrl: useSpring<ViewerZoomControl>(() => ({
      z: viewerOrigin.z,
      minZoom: 0.5,
      maxZoom: 100000,
      config: springsConfigs.default.zoom,
      onRest: updateJ,
    })),

    rotCtrl: useSpring<ViewerRotationControl>(() => ({
      theta: viewerOrigin.theta, // all angles in rad
      config: springsConfigs.default.rot,
      onRest: updateJ,
    })),
  };

  useEffect(() => {
    // viewer should update if user goes back / forward on the page
    // parse current location after user change
    urlManager.updateFromURL();
    console.log(`Warping to requested url => ${currentLocation()}`);

    // warp to the newly parsed locations
    warpToPoint(mandelbrotControls, urlManager.vs['m'].v);
    warpToPoint(juliaControls, urlManager.vs['j'].v);
    // this update process should only trigger when the hash location changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc]);

  const reset = () => {
    warpToPoint(mandelbrotControls, viewerOrigin);
    warpToPoint(juliaControls, viewerOrigin);
  };

  const [showInfo, setShowInfo] = useState(false);
  const toggleInfo = () => setShowInfo((i) => !i);

  const [openHelp, setOpenHelp] = useState(false);
  const toggleHelp = () => setOpenHelp((i) => !i);

  // [showMandelbrot, showJulia]
  const [[showMandelbrot, showJulia], setViewerState] = useState<[boolean, boolean]>([
    true,
    true,
  ]);
  // const [showMandelbrot, setShowMandelbrot] = useState(true);
  // const [showJulia, setShowJulia] = useState(true);
  // const [showMandelbrot, showJulia] = viewerState;

  // Wrap the Typography component with animated first
  // const AnimatedTypography = animated(Typography)
  // <AnimatedTypography></AnimatedTypography>
  // const AnimatedGrid = animated(Grid);

  // const { settings } = useSettings();

  const [animationState, setAnimationState] = React.useState(
    AnimationStatus.SELECT_MANDELBROT_POINT,
  );
  const [magnification, setMagnification] = React.useState<number>(1);
  const [focusedPointMandelbrot, setFocusedPointMandelbrot] = useState(
    defaultMisiurewiczPoint,
  );
  const [focusedPointJulia, setFocusedPointJulia] = useState(defaultMisiurewiczPoint);

  const alignM = (z: number) => {
    setMagnification(z / focusedPointJulia.aMagnitude);
    const zoomM = focusedPointMandelbrot.uMagnitude * magnification;

    mandelbrotControls.zoomCtrl[1]({
      z: zoomM,
    });
  };

  const alignJ = (z: number) => {
    setMagnification(z / focusedPointMandelbrot.uMagnitude);

    const zoomJ = focusedPointJulia.aMagnitude * magnification;

    juliaControls.zoomCtrl[1]({
      z: zoomJ,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <ServiceWorkerWrapper />
      <SettingsProvider>
        <Grid container>
          <SettingsContext.Consumer>
            {({ settings }) => {
              const currentDPR = settings.useDPR ? DPR : 1;
              const vertical = size.w < size.h;
              return (
                // JSX expressions must have one parent element
                <Grid
                  item
                  container
                  direction={vertical ? 'column-reverse' : 'row'}
                  alignItems={vertical ? 'flex-end' : 'flex-start'}
                  justify="center"
                  className="fullSize"
                  style={{
                    position: 'absolute',
                  }}
                >
                  <CoordinateInterface
                    show={settings.showCoordinates}
                    mandelbrot={mandelbrotControls}
                  />
                  <MisiurewiczModeFragment
                    show={settings.showMisiurewiczPoints}
                    mandelbrot={mandelbrotControls}
                    julia={juliaControls}
                    animationState={animationState}
                    setAnimationState={setAnimationState}
                    shadeDomains={settings.shadeMisiurewiczDomains}
                    magnification={magnification}
                    focusedPointMandelbrot={focusedPointMandelbrot}
                    setFocusedPointMandelbrot={setFocusedPointMandelbrot}
                    focusedPointJulia={focusedPointJulia}
                    setFocusedPointJulia={setFocusedPointJulia}
                  />
                  <Grid
                    item
                    xs
                    className="renderer"
                    style={{
                      // flex-grow takes up more space in a ratio format
                      flexGrow: showMandelbrot ? 1 : 0, // percentFlex.m.interpolate((x) => x),
                    }}
                  >
                    <MandelbrotRenderer
                      animationState={animationState}
                      align={alignJ}
                      controls={mandelbrotControls}
                      DPR={currentDPR}
                      {...settings}
                    />
                  </Grid>

                  <Grid item style={{ width: 0, height: 0, zIndex: 1 }}>
                    <ViewChanger vertical={vertical} changeFunc={setViewerState} />
                  </Grid>

                  <Grid
                    item
                    xs
                    className="renderer"
                    style={{
                      // flex-grow takes up more space in a ratio format
                      flexGrow: showJulia ? 1 : 0, // percentFlex.j.interpolate((x) => x),
                    }}
                  >
                    <JuliaRenderer
                      animationState={animationState}
                      align={alignM}
                      c={mandelbrotControls.xyCtrl[0].xy}
                      controls={juliaControls}
                      DPR={currentDPR}
                      {...settings}
                    />
                  </Grid>

                  {/* Settings menu uses SettingsContext so must be within provider */}
                  <SettingsMenu
                    reset={reset}
                    toggleInfo={toggleInfo}
                    helpState={[openHelp, toggleHelp]}
                  />
                </Grid>
              );
            }}
          </SettingsContext.Consumer>
        </Grid>
        <InfoDialog ctrl={[showInfo, setShowInfo]} />

        {/* FirstTimeInfo requires access to settings */}
        <FirstTimeInfo ctrl={[openHelp, toggleHelp]} />
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
