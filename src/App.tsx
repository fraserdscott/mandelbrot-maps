import { Button, Grid, IconButton } from '@material-ui/core';
import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSpring } from 'react-spring';
import './App.css';
import {
  currentLocation,
  useHashLocation,
  useHashNavigator,
  ViewerURLManager,
} from './common/routing';
import { settingsDefinitionsType } from './common/settings';
import {
  SpringAnimatedValueWithSetter,
  SpringControl,
  springControlKeys,
  ViewerControlSprings,
  ViewerLocation,
  ViewerRotationControl,
  ViewerXYControl,
  ViewerZoomControl,
  XYType,
} from './common/types';
import { useWindowSize, warpToPoint } from './common/utils';
import {
  deepZoomPrecision,
  defaultPrecision,
  PrecisionFormatter,
  springsConfigs,
  viewerOrigin,
} from './common/values';
import CoordinateInterface from './components/info/CoordinateInterface';
import FirstTimeInfo from './components/info/FirstTimeInfo';
import InfoDialog from './components/info/InfoDialog';
import MisiurewiczModeFragment, {
  AnimationStatus,
  MISIUREWICZ_POINTS,
} from './components/tans_theorem/MisiurewiczModeFragment';
import JuliaRenderer from './components/render/JuliaRenderer';
// import 'typeface-roboto';
import MandelbrotRenderer from './components/render/MandelbrotRenderer';
import MandelbrotRendererDeep from './components/render/MandelbrotRendererDeep';
import ViewChanger from './components/render/ViewChanger';
import SettingsMenu from './components/settings/SettingsMenu';
import {
  findNearestMisiurewiczPoint,
  forwardOrbit,
  PreperiodicPoint,
  similarPoints,
  withinBoundingBox,
} from './components/tansTheoremUtils';
import ComplexNumberMarker from './components/tans_theorem/ComplexNumberMarker';
import OrbitCard, { MAX_ORBIT_LENGTH } from './components/info/OrbitCard';
import SimilarityMenu from './components/tans_theorem/SimilarityMenu';
import SimilarityAnimationCard from './components/tans_theorem/SimilarityAnimationCard';
import ArrowBackwardIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';

const defaultMisiurewiczPoint = new PreperiodicPoint(
  [-0.10109636384562218, +0.9562865108091414],
  [-0.10109636384562218, +0.9562865108091414],
  false,
);

const defaultJuliaPoint = new PreperiodicPoint(
  [-0.10109636384562218, +0.9562865108091414],
  [-0.10109636384562218, +0.9562865108091414],
  true,
);

const filterPoints = (
  points: PreperiodicPoint[],
  boxCentre: XYType,
  boxWidth: number,
  boxHeight: number,
  boxAngle: number,
  focusedPoint: PreperiodicPoint,
): PreperiodicPoint[] => {
  const visiblePoints = [];

  for (let i = 0; i < points.length; i++) {
    const isFocusedPoint = points[i] === focusedPoint;
    if (isFocusedPoint) continue;

    if (visiblePoints.length === 5) break;

    if (withinBoundingBox(points[i].point, boxCentre, boxWidth, boxHeight, boxAngle)) {
      visiblePoints.push(points[i]);
    }
  }
  return visiblePoints;
};

function App({ settings }: { settings: settingsDefinitionsType }): JSX.Element {
  const size = useWindowSize();
  const vertical = size.w < size.h;

  const DPR = window.devicePixelRatio;
  const currentDPR = settings.useDPR ? DPR : 1;

  // set application float precision based on whether deep zoom is enabled
  const [precision, setPrecision] = useState(defaultPrecision);
  const precisionFormatter = PrecisionFormatter(precision);

  // update the new precision
  useEffect(() => {
    setPrecision(settings.deepZoom ? deepZoomPrecision : defaultPrecision);
  }, [settings.deepZoom]);

  // if app is started with a hash location, assume
  // it should be the starting position
  // detects hash updates
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loc, navigate] = useHashLocation();

  // non-reloading hash update
  const updateBrowserHash = useHashNavigator();

  // why is this a memo?
  // does making it a memo mean it won't slow down initial rendering?
  const urlManager = useMemo(() => new ViewerURLManager(), []);

  /**
   * generic callback.
   * called when the viewer has moved and the hash url needs to be updated
   */
  const updateHash = useCallback(
    (name: string, v: Partial<ViewerLocation>) => {
      // console.log('deepzoom:', settings.deepZoom);
      urlManager.updateViewer(name, v, precisionFormatter);
      const u = urlManager.asFullHashURL();
      // console.debug(`Updated # for ${name} => ${u}`);
      updateBrowserHash(u);
    },
    [precisionFormatter, updateBrowserHash, urlManager],
  );

  // The 'updateM' function makes the dependencies of useEffect Hook (at line 127) change on
  // every render. To fix this, wrap the definition of 'updateM' in its own useCallback() Hook
  // callbacks for springs to update url when animation stops
  const updateM = useCallback((v: Partial<ViewerLocation>) => updateHash('m', v), [
    updateHash,
  ]);
  const updateJ = useCallback((v: Partial<ViewerLocation>) => updateHash('j', v), [
    updateHash,
  ]);

  const mandelbrotControls: ViewerControlSprings = {
    xyCtrl: useSpring<ViewerXYControl>(() => ({
      xy: viewerOrigin.xy,
      config: springsConfigs(precision).default.xyCtrl,
      onRest: updateM,
    })),

    zoomCtrl: useSpring<ViewerZoomControl>(() => ({
      z: viewerOrigin.z,
      minZoom: 0.5,
      // Numeric literals with absolute values equal to 2^53 or greater are too large
      // to be represented accurately as integers. [ts(80008)]
      maxZoom: 1e16,
      // 100_000_000_000_000_000,
      config: springsConfigs(precision).default.zoomCtrl,
      onRest: updateM,
    })),

    rotCtrl: useSpring<ViewerRotationControl>(() => ({
      theta: viewerOrigin.theta, // all angles in rad
      config: springsConfigs(precision).default.rotCtrl,
      onRest: updateM,
    })),
  };

  // make sure that the spring "onRest" is updated if the precision changes
  useEffect(() => {
    Object.entries(mandelbrotControls).forEach(
      ([k, [, set]]: [string, SpringAnimatedValueWithSetter<SpringControl>]) => {
        try {
          const key = k as springControlKeys;
          set({
            onRest: updateM,
            // hacky way to grab the config
            config: springsConfigs(precision).default[key],
          });
        } catch (error) {
          // guess not
        }
      },
    );
    // explicitly not adding mandelbrotControls to the deps list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [precision, updateM]);

  const juliaControls: ViewerControlSprings = {
    xyCtrl: useSpring<ViewerXYControl>(() => ({
      xy: viewerOrigin.xy,
      config: springsConfigs(precision).default.xyCtrl,
      onRest: updateJ,
    })),

    zoomCtrl: useSpring<ViewerZoomControl>(() => ({
      z: viewerOrigin.z,
      minZoom: 0.5,
      maxZoom: 2000,
      config: springsConfigs(precision).default.zoomCtrl,
      onRest: updateJ,
    })),

    rotCtrl: useSpring<ViewerRotationControl>(() => ({
      theta: viewerOrigin.theta, // all angles in rad
      config: springsConfigs(precision).default.rotCtrl,
      onRest: updateJ,
    })),
  };

  useEffect(() => {
    // viewer should update if user goes back / forward on the page
    // parse current location after user change
    urlManager.updateFromURL();
    console.log(`Warping to requested url => ${currentLocation()}`);

    // warp to the newly parsed locations
    warpToPoint(mandelbrotControls, urlManager.vs['m'].v, precision);
    warpToPoint(juliaControls, urlManager.vs['j'].v, precision);
    // this update process should only trigger when the hash location changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc]);

  const reset = () => {
    warpToPoint(mandelbrotControls, viewerOrigin, precision);
    warpToPoint(juliaControls, viewerOrigin, precision);
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

  // const { settings } = useSettings();

  const [animationState, setAnimationState] = React.useState(
    AnimationStatus.SELECT_MANDELBROT_POINT,
  );
  const [magnification, setMagnification] = React.useState<number>(1);
  const [focusedPointMandelbrot, setFocusedPointMandelbrot] = useState(
    defaultMisiurewiczPoint,
  );
  const [focusedPointJulia, setFocusedPointJulia] = useState(defaultJuliaPoint);

  const alignSets = (newMagnification: number) => {
    setMagnification(newMagnification);
    const makeZoom = (point: PreperiodicPoint) =>
      point.factorMagnitude * newMagnification;
    const zoomM = makeZoom(focusedPointMandelbrot);
    const zoomJ = makeZoom(focusedPointJulia);

    mandelbrotControls.zoomCtrl[1]({
      z: zoomM,
    });
    juliaControls.zoomCtrl[1]({
      z: zoomJ,
    });

    if (settings.rotateWhileZooming) {
      const selfSimilarityAngle =
        (Math.log(newMagnification) /
          Math.log(focusedPointMandelbrot.selfSimilarityFactorMagnitude)) *
        focusedPointMandelbrot.selfSimilarityFactorAngle;

      const makeRot = (point: PreperiodicPoint) =>
        -(point.factorAngle + selfSimilarityAngle);
      const rotM = makeRot(focusedPointMandelbrot);
      const rotJ = makeRot(focusedPointJulia);

      mandelbrotControls.rotCtrl[1]({
        theta: rotM,
      });
      juliaControls.rotCtrl[1]({
        theta: rotJ,
      });
    }
  };

  const alignM = (z: number) => {
    const newMagnification = z / focusedPointJulia.factorMagnitude;
    alignSets(newMagnification);
  };

  const alignJ = (z: number) => {
    const newMagnification = z / focusedPointMandelbrot.factorMagnitude;
    alignSets(newMagnification);
  };

  const [similarPointsJulia, setSimilarPointsJulia] = useState(
    similarPoints(focusedPointJulia, 4).sort(
      (a, b) => a.factorMagnitude - b.factorMagnitude,
    ),
  );
  const [misiurewiczMarkers, setMisiurewiczMarkers] = useState([<div key={0} />]);
  const [juliaMarkers, setJuliaMarkers] = useState([<div key={0} />]);

  const handleMisiurewiczPointSelection = useCallback(
    (pointM: PreperiodicPoint, pointJ: PreperiodicPoint): void => {
      const similars = similarPoints(pointM, 4).sort(
        (a, b) => a.factorMagnitude - b.factorMagnitude,
      );
      if (similars.length > 0) {
        setFocusedPointMandelbrot(pointM);
        setFocusedPointJulia(new PreperiodicPoint(pointM.point, pointJ.point, true));
        setSimilarPointsJulia(similars);
      }
    },
    [],
  );

  const handleSimilarPointSelection = useCallback(
    (pointJ: PreperiodicPoint): void => {
      setFocusedPointJulia(pointJ);
    },
    [setFocusedPointJulia],
  );

  const handleReset = () => {
    setAnimationState(AnimationStatus.SELECT_MANDELBROT_POINT);
    setMagnification(1);
    warpToPoint(mandelbrotControls, {
      xy: focusedPointMandelbrot.point,
      z: focusedPointMandelbrot.factorMagnitude,
      theta: 0,
    });
    warpToPoint(juliaControls, {
      xy: [0, 0],
      z: 0.5,
      theta: 0,
    });
  };

  const handleQuit = () => {
    settings.showMisiurewiczPoints = false;
  };

  const [aspectRatio, setAspectRatio] = useState(1);
  const rendererRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMandelbrotMarkers = () => {
      const mapMarkers = [];

      const boxCentre = mandelbrotControls.xyCtrl[0].xy.getValue();
      const boxWidth = 1 / (aspectRatio * mandelbrotControls.zoomCtrl[0].z.getValue());
      const boxHeight = 1 / mandelbrotControls.zoomCtrl[0].z.getValue();
      const boxAngle = mandelbrotControls.rotCtrl[0].theta.getValue();
      if (
        withinBoundingBox(
          focusedPointMandelbrot.point,
          boxCentre,
          boxWidth,
          boxHeight,
          boxAngle,
        )
      ) {
        mapMarkers.push(
          <ComplexNumberMarker
            key={focusedPointMandelbrot.point.toString()}
            m={focusedPointMandelbrot}
            aspectRatio={aspectRatio}
            viewerControl={mandelbrotControls}
            onClick={() =>
              handleMisiurewiczPointSelection(
                focusedPointMandelbrot,
                focusedPointMandelbrot,
              )
            }
            isFocused={true}
          />,
        );
      }
      if (!settings.shadeMisiurewiczDomains) {
        const visiblePoints = filterPoints(
          MISIUREWICZ_POINTS,
          boxCentre,
          boxWidth,
          boxHeight,
          boxAngle,
          focusedPointMandelbrot,
        );
        for (let i = 0; i < visiblePoints.length; i++) {
          mapMarkers.push(
            <ComplexNumberMarker
              key={visiblePoints[i].point.toString()}
              m={visiblePoints[i]}
              aspectRatio={aspectRatio}
              viewerControl={mandelbrotControls}
              onClick={() =>
                handleMisiurewiczPointSelection(visiblePoints[i], visiblePoints[i])
              }
              isFocused={false}
            />,
          );
        }
      }
      setMisiurewiczMarkers(mapMarkers);
    };

    const updateJuliaMarkers = () => {
      const mapMarkers: JSX.Element[] = [];

      const boxCentre = juliaControls.xyCtrl[0].xy.getValue();
      const boxWidth = 1 / (aspectRatio * juliaControls.zoomCtrl[0].z.getValue());
      const boxHeight = 1 / juliaControls.zoomCtrl[0].z.getValue();
      const boxAngle = juliaControls.rotCtrl[0].theta.getValue();

      if (
        withinBoundingBox(
          focusedPointJulia.point,
          boxCentre,
          boxWidth,
          boxHeight,
          boxAngle,
        )
      ) {
        mapMarkers.push(
          <ComplexNumberMarker
            key={focusedPointJulia.point.toString()}
            m={focusedPointJulia}
            aspectRatio={aspectRatio}
            viewerControl={juliaControls}
            onClick={() => handleSimilarPointSelection(focusedPointJulia)}
            isFocused={true}
          />,
        );
      }

      const visiblePoints = filterPoints(
        similarPointsJulia,
        boxCentre,
        boxWidth,
        boxHeight,
        boxAngle,
        focusedPointJulia,
      );
      for (let i = 0; i < visiblePoints.length; i++) {
        mapMarkers.push(
          <ComplexNumberMarker
            key={visiblePoints[i].point.toString()}
            m={visiblePoints[i]}
            aspectRatio={aspectRatio}
            viewerControl={juliaControls}
            onClick={() => handleSimilarPointSelection(visiblePoints[i])}
            isFocused={false}
          />,
        );
      }
      setJuliaMarkers(mapMarkers);
    };
    const interval = setInterval(() => {
      if (rendererRef.current) {
        setAspectRatio(
          rendererRef.current.offsetHeight / rendererRef.current.offsetWidth,
        );
      }
      if (animationState === AnimationStatus.SELECT_MANDELBROT_POINT) {
        updateMandelbrotMarkers();
      } else if (animationState === AnimationStatus.SELECT_JULIA_POINT) {
        updateJuliaMarkers();
      }
    }, 10);
    return () => clearInterval(interval);
  }, [
    animationState,
    aspectRatio,
    focusedPointJulia,
    focusedPointMandelbrot,
    handleMisiurewiczPointSelection,
    handleSimilarPointSelection,
    juliaControls,
    mandelbrotControls,
    settings.shadeMisiurewiczDomains,
    similarPointsJulia,
  ]);

  const [orbitInfo, setOrbitInfo] = useState(forwardOrbit([0, 0], [0, 0], 2));

  useEffect(() => {
    const interval = setInterval(() => {
      if (settings.showOrbit)
        setOrbitInfo(
          forwardOrbit(
            mandelbrotControls.xyCtrl[0].xy.getValue(),
            mandelbrotControls.xyCtrl[0].xy.getValue(),
            MAX_ORBIT_LENGTH,
          ),
        );
    }, 1);
    return () => clearInterval(interval);
  }, [mandelbrotControls.xyCtrl, settings.showOrbit]);

  const BackButton = () => {
    return (
      <IconButton style={{ width: 50 }} onClick={handleReset}>
        <ArrowBackwardIcon />
      </IconButton>
    );
  };

  const QuitButton = () => {
    return (
      <IconButton style={{ width: 50 }} onClick={handleQuit}>
        <CloseIcon />
      </IconButton>
    );
  };

  const handleNearest = () => {
    const mPoint = findNearestMisiurewiczPoint(
      mandelbrotControls.xyCtrl[0].xy.getValue(),
      10000,
    );
    if (mPoint[0] !== 0 && mPoint[1] !== 0) {
      const p = new PreperiodicPoint(mPoint, mPoint, false);
      handleMisiurewiczPointSelection(p, p);
    }
  };

  const NearestButton = () => (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button
        style={{
          zIndex: 1500,
        }}
        variant="contained"
        onClick={handleNearest}
      >
        Press to find nearest Misiurewicz point
      </Button>
    </div>
  );

  const toggleTan = () => {
    settings.showMisiurewiczPoints = true;
  };

  return (
    <>
      <Grid container>
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
            precision={precision}
            precisionFormatter={precisionFormatter}
          />
          <div
            style={{
              zIndex: 1300,
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          >
            {settings.showOrbit ? (
              <OrbitCard
                show={settings.showOrbit}
                xy={mandelbrotControls.xyCtrl[0].xy}
                preperiod={orbitInfo[1]}
                period={orbitInfo[2]}
                flag={orbitInfo[3]}
              />
            ) : null}
            {settings.showMisiurewiczPoints ? (
              <>
                {QuitButton()}
                <MisiurewiczModeFragment
                  show={settings.showMisiurewiczPoints}
                  mandelbrot={mandelbrotControls}
                  julia={juliaControls}
                  animationState={animationState}
                  setAnimationState={setAnimationState}
                  shadeDomains={settings.shadeMisiurewiczDomains}
                  magnification={magnification}
                  handleReset={handleReset}
                  focusedPointMandelbrot={focusedPointMandelbrot}
                  focusedPointJulia={focusedPointJulia}
                  rotate={settings.rotateWhileZooming}
                  handleMandelbrotSelection={handleMisiurewiczPointSelection}
                />
              </>
            ) : null}
            {settings.showMisiurewiczPoints &&
            animationState === AnimationStatus.SELECT_JULIA_POINT ? (
              <>
                <SimilarityMenu
                  show={settings.showMisiurewiczPoints}
                  julia={juliaControls}
                  setAnimationState={setAnimationState}
                  focusedPointMandelbrot={focusedPointMandelbrot}
                  focusedPointJulia={focusedPointJulia}
                  similarPointsJulia={similarPointsJulia}
                  handleSimilarPointSelection={handleSimilarPointSelection}
                  backButton={BackButton}
                />
              </>
            ) : null}
          </div>
          {[
            AnimationStatus.SELECT_MANDELBROT_POINT,
            AnimationStatus.SELECT_JULIA_POINT,
            AnimationStatus.ZOOM_M,
            AnimationStatus.ZOOM_J,
            AnimationStatus.ROTATE_M,
            AnimationStatus.ROTATE_J,
          ].includes(animationState) ? (
            <SimilarityAnimationCard
              show={settings.showMisiurewiczPoints}
              animationState={animationState}
              focusedPoint={focusedPointMandelbrot}
              focusedPointJulia={focusedPointJulia}
            />
          ) : null}
          <Grid
            item
            xs
            className="renderer"
            style={{
              // flex-grow takes up more space in a ratio format
              flexGrow: showMandelbrot ? 1 : 0, // percentFlex.m.interpolate((x) => x),
              position: 'relative',
            }}
            ref={rendererRef}
          >
            {settings.showMisiurewiczPoints &&
            animationState === AnimationStatus.SELECT_MANDELBROT_POINT
              ? misiurewiczMarkers
              : null}
            {settings.showMisiurewiczPoints &&
            settings.shadeMisiurewiczDomains &&
            animationState === AnimationStatus.SELECT_MANDELBROT_POINT
              ? NearestButton()
              : null}
            {settings.deepZoom ? (
              <MandelbrotRendererDeep
                animationState={animationState}
                align={alignJ}
                controls={mandelbrotControls}
                DPR={currentDPR}
                precision={precision}
                orbitInfo={orbitInfo}
                {...settings}
              />
            ) : (
              <MandelbrotRenderer
                animationState={animationState}
                align={alignJ}
                controls={mandelbrotControls}
                DPR={currentDPR}
                precision={precision}
                orbitInfo={orbitInfo}
                {...settings}
              />
            )}
          </Grid>

          <Grid item style={{ width: 0, height: 0, zIndex: 1400 }}>
            <ViewChanger vertical={vertical} changeFunc={setViewerState} />
          </Grid>

          <Grid
            item
            xs
            className="renderer"
            style={{
              // flex-grow takes up more space in a ratio format
              flexGrow: showJulia ? 1 : 0, // percentFlex.j.interpolate((x) => x),
              position: 'relative',
            }}
          >
            {settings.showMisiurewiczPoints &&
            animationState === AnimationStatus.SELECT_JULIA_POINT
              ? juliaMarkers
              : null}
            <JuliaRenderer
              animationState={animationState}
              align={alignM}
              c={mandelbrotControls.xyCtrl[0].xy}
              controls={juliaControls}
              DPR={currentDPR}
              precision={precision}
              {...settings}
            />
          </Grid>

          {/* Settings menu uses SettingsContext so must be within provider */}
          <SettingsMenu
            reset={reset}
            toggleInfo={toggleInfo}
            toggleTan={toggleTan}
            helpState={[openHelp, toggleHelp]}
          />
        </Grid>
      </Grid>
      <InfoDialog ctrl={[showInfo, setShowInfo]} />

      {/* FirstTimeInfo requires access to settings */}
      <FirstTimeInfo ctrl={[openHelp, toggleHelp]} />
    </>
  );
}

export default App;
