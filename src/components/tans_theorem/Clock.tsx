import React, { Component } from 'react'; // let's also import Component
import { ViewerControlSprings, XYType } from '../../common/types';
import { orbitList, PreperiodicPoint } from '../tansTheoremUtils';
import { AnimationStatus } from './MisiurewiczModeFragment';
import OrbitCard from './OrbitCard';
import OrbitMarker, { pointWithinBoundingBox } from './OrbitMarker';

// the clock's state has one field: The current time, based upon the
// JavaScript class Date
type ClockState = {
  time: Date;
  orbitPoints: XYType[];
};

type Props = {
  mandelbrot: ViewerControlSprings;
  focusedPointMandelbrot: PreperiodicPoint;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationStatus>>;
  mapWidth: number;
  mapHeight: number;
};

// Clock has no properties, but the current state is of type ClockState
// The generic parameters in the Component typing allow to pass props
// and state. Since we don't have props, we pass an empty object.
export class Clock extends Component<Props, ClockState> {
  // The tick function sets the current state. TypeScript will let us know
  // which ones we are allowed to set.
  tick() {
    const ASPECT_RATIO = this.props.mapWidth / this.props.mapHeight;

    this.setState({
      time: new Date(),
      orbitPoints: orbitList(
        [0, 0],
        this.props.mandelbrot.xyCtrl[0].xy.getValue(),
        10,
      ).filter((x) =>
        pointWithinBoundingBox(
          x,
          this.props.mandelbrot.xyCtrl[0].xy.getValue(),
          ASPECT_RATIO / this.props.mandelbrot.zoomCtrl[0].z.getValue(),
          1 / this.props.mandelbrot.zoomCtrl[0].z.getValue(),
          -this.props.mandelbrot.rotCtrl[0].theta.getValue(),
        ),
      ),
    });
  }

  // Before the component mounts, we initialise our state
  UNSAFE_componentWillMount() {
    this.tick();
  }

  // After the component did mount, we set the state each second.
  componentDidMount() {
    setInterval(() => this.tick(), 100);
  }

  // render will know everything!
  render() {
    return (
      <>
        {this.state.orbitPoints.map((m) => (
          <OrbitMarker
            key={m.toString()}
            iterate={m}
            mapWidth={this.props.mapWidth}
            mapHeight={this.props.mapHeight}
            show={true}
            mandelbrotControl={this.props.mandelbrot}
          />
        ))}
        <OrbitCard
          setAnimationState={this.props.setAnimationState}
          focusedPoint={
            new PreperiodicPoint(
              this.props.mandelbrot.xyCtrl[0].xy.getValue(),
              this.props.mandelbrot.xyCtrl[0].xy.getValue(),
            )
          }
        />
      </>
    );
  }
}

export default Clock;
