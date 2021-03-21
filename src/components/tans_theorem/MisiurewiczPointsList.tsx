import { Select } from '@material-ui/core';
import React from 'react';
import { MisiurewiczPointsListProps } from '../../common/tans';
import { XYType } from '../../common/types';
import { warpToPoint } from '../../common/utils';
import { formatComplexNumber, PreperiodicPoint } from '../tansTheoremUtils';
import { MISIUREWICZ_POINTS, parsePoint } from './MisiurewiczModeFragment';

const MisiurewiczPointsList = (props: MisiurewiczPointsListProps): JSX.Element => {
  const handleMandelbrotPointSelection = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const chosenPoint: XYType = parsePoint(event.target.value as string);

    const chosenMisiurewicz = new PreperiodicPoint(chosenPoint, chosenPoint, false);

    props.handleMandelbrotSelection(chosenMisiurewicz, chosenMisiurewicz);
    warpToPoint(props.mandelbrot, {
      xy: chosenMisiurewicz.point,
      z: chosenMisiurewicz.factorMagnitude,
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
