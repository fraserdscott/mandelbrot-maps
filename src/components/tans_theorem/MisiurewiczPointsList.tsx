import { Select } from '@material-ui/core';
import React from 'react';
import { InfoCardProps } from '../../common/info';
import { XYType } from '../../common/types';
import { warpToPoint } from '../../common/utils';
import { formatComplexNumber, PreperiodicPoint } from '../tansTheoremUtils';
import { MISIUREWICZ_POINTS, parsePoint } from './MisiurewiczModeFragment';
import { handleMandelbrotSelection } from './MisiurewiczPointMarker';

const MisiurewiczPointsList = (props: InfoCardProps): JSX.Element => {
  const handleMandelbrotPointSelection = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const chosenPoint: XYType = parsePoint(event.target.value as string);

    const chosenMisiurewicz = new PreperiodicPoint(chosenPoint, chosenPoint);

    handleMandelbrotSelection(
      chosenMisiurewicz,
      props.setFocusedPoint,
      chosenMisiurewicz,
      props.setFocusedPointJulia,
    );
    warpToPoint(props.mandelbrot, {
      xy: chosenMisiurewicz.point,
      z: chosenMisiurewicz.uMagnitude,
      theta: 0,
    });
  };

  return (
    <Select
      native
      value={props.focusedPoint.point}
      onChange={handleMandelbrotPointSelection}
      inputProps={{
        name: 'mandelbrot',
        id: 'select-multiple-native',
      }}
    >
      {MISIUREWICZ_POINTS.map((m) => (
        <option key={m.point.toString()} value={m.point.toString()}>
          {m.toString()} = {formatComplexNumber(m.point)}
        </option>
      ))}
    </Select>
  );
};

export default MisiurewiczPointsList;
