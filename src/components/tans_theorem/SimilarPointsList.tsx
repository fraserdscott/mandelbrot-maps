import { Select } from '@material-ui/core';
import React from 'react';
import { SimilarPointsListProps } from '../../common/tans';
import { XYType } from '../../common/types';
import { formatComplexNumber, PreperiodicPoint } from '../tansTheoremUtils';
import { parsePoint } from './MisiurewiczModeFragment';

const SimilarPointsList = (props: SimilarPointsListProps): JSX.Element => {
  const handleSimilarPointSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
    const chosenPoint: XYType = parsePoint(event.target.value as string);

    const newPoint = new PreperiodicPoint(
      props.focusedPointMandelbrot.point,
      chosenPoint,
      true,
    );

    props.handleSimilarPointSelection(newPoint);
  };

  return (
    <Select
      native
      value={props.focusedPointJulia.point}
      onChange={handleSimilarPointSelection}
    >
      {props.similarPointsJulia.map((m) => (
        <option key={m.point.toString()} value={m.point.toString()}>
          {formatComplexNumber(m.point)}
        </option>
      ))}
    </Select>
  );
};

export default SimilarPointsList;
