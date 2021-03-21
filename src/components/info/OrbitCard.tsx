import { Card, Typography, Grow } from '@material-ui/core';
import React from 'react';
import { XYType } from '../../common/types';
import { OpaqueInterpolation } from 'react-spring';
import { OrbitFlag, formatComplexNumber } from '../tansTheoremUtils';

export const MAX_ORBIT_LENGTH = 400;

type OrbitCardProps = {
  show: boolean;
  xy: OpaqueInterpolation<XYType>;
  period: number;
  preperiod: number;
  flag: OrbitFlag;
};

const OrbitCard = (props: OrbitCardProps): JSX.Element => {
  return (
    <Grow in={props.show}>
      <Card
        style={{
          width: 'auto',
          padding: '6px 12px',
          marginBottom: 8,
        }}
      >
        <Typography align="left" style={{ fontFamily: 'monospace', fontSize: '1.2rem' }}>
          <span>Orbit for {formatComplexNumber(props.xy.getValue(), 2)}</span>
          <br />
          {props.flag === OrbitFlag.Cyclic ? (
            <>
              <span>preperiod : {props.preperiod}</span>
              <br />
              <span>period : {props.period}</span>
            </>
          ) : null}
          {props.flag === OrbitFlag.Acyclic ? (
            <span>Did not enter a cycle after {MAX_ORBIT_LENGTH} iterations</span>
          ) : null}
          {props.flag === OrbitFlag.Divergent ? (
            <span>Diverged after {props.preperiod} iterations</span>
          ) : null}
        </Typography>
      </Card>
    </Grow>
  );
};

export default OrbitCard;
