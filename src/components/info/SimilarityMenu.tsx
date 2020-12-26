import { Card, Button, Typography, IconButton, Tooltip, Select } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import React from 'react';
import {
  formatComplexNumber,
  similarPoints,
  PreperiodicPoint,
} from '../tansTheoremUtils';
import { warpToPoint } from '../../common/utils';
import { SelectMisiurewiczCardProps } from '../../common/info';
import { AnimationStatus } from './MisiurewiczModeDiv';
import { XYType } from '../../common/types';
import ArrowBackwardIcon from '@material-ui/icons/ArrowBack';
import { misiurewiczPairs } from '../MPoints';
import { parsePoint } from './SelectMisiurewiczCard';
import {
  handleJuliaSelection,
  handleMandelbrotSelection,
} from './MisiurewiczPointMarker';

export const misiurewiczPoints: PreperiodicPoint[] = misiurewiczPairs
  .slice(0, 100)
  .map((p) => new PreperiodicPoint(p, p));

const SimilarityMenu = (props: SelectMisiurewiczCardProps): JSX.Element => {
  const backButton = (state: AnimationStatus) => {
    return (
      <IconButton
        onClick={() => {
          props.setAnimationState(state);
        }}
      >
        <ArrowBackwardIcon />
      </IconButton>
    );
  };

  const goButton = () => {
    return (
      <Button
        variant="contained"
        style={{
          float: 'right',
        }}
        onClick={() => {
          props.setAnimationState(AnimationStatus.TRANSLATE_M);
        }}
      >
        GO
      </Button>
    );
  };
  const zs = similarPoints(props.focusedPoint);

  const handleMandelbrotPointSelection = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    const chosenPoint: XYType = parsePoint(event.target.value as string);

    const chosenMisiurewicz = new PreperiodicPoint(chosenPoint, chosenPoint);
    props.setMagState(1);

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

  const handleJuliaSimilarSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
    const chosenPoint: XYType = parsePoint(event.target.value as string);

    handleJuliaSelection(
      new PreperiodicPoint(props.focusedPoint.point, chosenPoint),
      props.setFocusedPointJulia,
    );
  };

  const misiurewiczPointsList = (): JSX.Element => {
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
        {misiurewiczPoints.map((m) => (
          <option key={m.point.toString()} value={m.point.toString()}>
            {m.toString()} = {formatComplexNumber(m.point)}
          </option>
        ))}
      </Select>
    );
  };

  return (
    <Card
      style={{
        width: 200,
        padding: 12,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 1,
        position: 'absolute',
        left: 0,
        top: 0,
      }}
    >
      {backButton(AnimationStatus.NO_ANIMATION)}
      <Typography
        style={{
          marginBottom: 8,
        }}
        variant="h6"
        gutterBottom
      >
        Show me the similarity between...
      </Typography>
      {props.shadeDomains
        ? `${formatComplexNumber(props.focusedPoint.point)}`
        : misiurewiczPointsList()}
      <div style={{ marginBottom: 12 }}>in the Mandelbrot set</div>
      <Typography variant="h6" component="h5" gutterBottom>
        and
      </Typography>
      <Select
        native
        value={props.focusedPointJulia.point}
        onChange={handleJuliaSimilarSelection}
      >
        {zs.map((m) => (
          <option key={m.point.toString()} value={m.point.toString()}>
            {formatComplexNumber(m.point)}
          </option>
        ))}
      </Select>
      <Tooltip
        title={`These points are all similar because they enter the same cycle as ${formatComplexNumber(
          props.focusedPoint.point,
        )} under iteration`}
        placement="top"
      >
        <InfoIcon />
      </Tooltip>
      <div style={{ marginBottom: 12 }}>in the Julia set</div>
      {goButton()}
    </Card>
  );
};

export default SimilarityMenu;
