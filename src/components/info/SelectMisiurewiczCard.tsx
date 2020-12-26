import { PreperiodicPoint } from '../tansTheoremUtils';
import { XYType } from '../../common/types';
import { misiurewiczPairs } from '../MPoints';

export const misiurewiczPoints: PreperiodicPoint[] = misiurewiczPairs
  .slice(0, 100)
  .map((p) => new PreperiodicPoint(p, p));

export const parsePoint = (s: string): XYType => {
  const posStr = s.split(',');
  return [parseFloat(posStr[0]), parseFloat(posStr[1])];
};
