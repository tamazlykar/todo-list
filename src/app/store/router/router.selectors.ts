import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterState } from '../custom-router-state-serializer';

const getRouterState = createFeatureSelector<RouterReducerState<RouterState>>('router');

export const getRouterListIdParam = createSelector(
  getRouterState,
  state => state && state.state.listId,
);
