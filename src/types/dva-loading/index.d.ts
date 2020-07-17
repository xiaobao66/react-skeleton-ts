import { func } from 'prop-types';

export interface DvaLoadingState {
  global: boolean;
  models: { [type: string]: boolean | undefined };
  effects: { [type: string]: boolean | undefined };
}

export default function createLoading(opts?: any): any;
