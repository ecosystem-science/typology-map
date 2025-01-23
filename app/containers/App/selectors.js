/**
 * The global state selectors
 */
import { createSelector } from '@reduxjs/toolkit';
import { DEFAULT_LOCALE, appLocales } from 'i18n';

import { groupBy } from 'lodash/collection';

import {
  biomesForRealm,
  groupsForBiome,
  groupsForBiomes,
  sortGroups,
} from 'utils/store';
import { startsWith } from 'utils/string';
import quasiEquals from 'utils/quasi-equals';

import { GROUP_LAYER_PROPERTIES } from 'config';
import { initialState } from './reducer';

const selectGlobal = state => (state && state.global) || initialState;

const selectRouter = state => state && state.router;

export const selectRouterLocation = createSelector(
  selectRouter,
  routerState => routerState && routerState.location,
);
export const selectRouterSearchParams = createSelector(
  selectRouterLocation,
  location => location && new URLSearchParams(location.search),
);
export const selectRouterPath = createSelector(
  selectRouterLocation,
  location => location && location.pathname,
);

export const selectGroupsQueryArgs = createSelector(
  selectRouterSearchParams,
  search => ({
    regionId: search.has('regionId') ? search.get('regionId') : '',
    area: search.has('area') ? search.get('area') : '',
    occurrence: search.has('occurrence') ? search.get('occurrence') : '',
    realm: search.has('realm') ? search.get('realm') : '',
    biome: search.has('biome') ? search.get('biome') : '',
  }),
);
export const selectGroupsQueryArea = createSelector(
  selectRouterSearchParams,
  search => (search.has('area') ? search.get('area') : ''),
);
export const selectGroupsQueryRegion = createSelector(
  selectRouterSearchParams,
  search => (search.has('regionId') ? search.get('regionId') : ''),
);
export const selectActiveGroup = createSelector(
  selectRouterSearchParams,
  search => (search.has('active') ? search.get('active') : ''),
);
export const selectInfoGroupQuery = createSelector(
  selectRouterSearchParams,
  search => (search.has('info') ? search.get('info') : ''),
);

export const selectRouterPathNamed = createSelector(
  selectRouterLocation,
  location => {
    if (!location || !location.pathname) return false;
    const path = startsWith(location.pathname, '/')
      ? location.pathname.substr(1)
      : location.pathname;
    const [route, level, id] = path.split('/').filter(p => appLocales.indexOf(p) === -1);
    return { route, level, id };
  },
);

/**
 * Get the language locale
 */
export const selectLocale = createSelector(selectRouterPath, path => {
  if (path) {
    const splitPath = path.split('/');
    return splitPath.length > 1 && appLocales.indexOf(splitPath[1]) >= 0
      ? splitPath[1]
      : DEFAULT_LOCALE;
  }
  return DEFAULT_LOCALE;
});


export const selectCloseTarget = createSelector(
  selectGlobal,
  global => global.closeTarget,
);

export const selectDrawActive = createSelector(
  selectGlobal,
  global => global.drawActive,
);
export const selectQueryRegionsActive = createSelector(
  selectGlobal,
  global => global.queryRegionsActive,
);

export const selectFullscreenImage = createSelector(
  selectGlobal,
  global => global.fullscreenImage,
);
export const selectConfig = createSelector(
  selectGlobal,
  global => global.config,
);
export const selectConfigByKey = createSelector(
  (state, key) => key,
  selectConfig,
  (key, data) => data[key],
);
export const selectRealms = state => selectConfigByKey(state, 'realms');
export const selectBiomes = state => selectConfigByKey(state, 'biomes');
export const selectGroups = state => selectConfigByKey(state, 'groups');

export const selectRealm = createSelector(
  (state, id) => id,
  selectRealms,
  (id, data) => data && data.find(d => d.id === id),
);
export const selectBiome = createSelector(
  (state, id) => id,
  selectBiomes,
  (id, data) => data && data.find(d => d.id === id),
);
export const selectRealmForBiome = createSelector(
  selectBiome,
  selectRealms,
  (biome, data) => biome && data && data.find(d => d.id === biome.realm),
);
export const selectGroup = createSelector(
  (state, id) => id,
  selectGroups,
  (id, data) => data && data.find(d => d.id === id),
);

export const selectInfoGroup = createSelector(
  selectInfoGroupQuery,
  selectGroups,
  (id, data) => data && data.find(d => d.id === id),
);

export const selectRealmsWithStats = createSelector(
  selectRealms,
  selectBiomes,
  selectGroups,
  (realms, biomes, groups) => {
    if (!realms) return null;
    return realms
      .map(r => {
        const rbiomes = biomesForRealm(biomes, r.id);
        const rgroups = groupsForBiomes(groups, rbiomes);
        return {
          ...r,
          biomeNo: rbiomes && rbiomes.length,
          groupNo: rgroups && rgroups.length,
        };
      })
      .sort((a, b) => {
        if (a.type === b.type) {
          return a.biomeNo > b.biomeNo ? -1 : 1;
        }
        if (a.type === 'core') return -1;
        return 1;
      });
  },
);
export const selectBiomesForRealmWithStats = createSelector(
  (state, realmId) => realmId,
  selectBiomes,
  selectGroups,
  (realmId, biomes, groups) => {
    if (!biomes) return null;
    return biomesForRealm(biomes, realmId).map(b => {
      const bgroups = groupsForBiome(groups, b.id);
      return {
        ...b,
        groupNo: bgroups && bgroups.length,
      };
    });
  },
);
export const selectGroupsForBiome = createSelector(
  (state, biomeId) => biomeId,
  selectGroups,
  (biomeId, groups) => {
    if (!groups) return null;
    return groupsForBiome(groups, biomeId);
  },
);

const selectConfigRequested = createSelector(
  selectGlobal,
  global => global.configRequested,
);
export const selectConfigRequestedByKey = createSelector(
  (state, key) => key,
  selectConfigRequested,
  (key, data) => data[key],
);

const selectConfigReady = createSelector(
  selectGlobal,
  global => global.configReady,
);
export const selectConfigReadyByKey = createSelector(
  (state, key) => key,
  selectConfigReady,
  (key, data) => data[key],
);

export const selectContent = createSelector(
  selectGlobal,
  global => global.content,
);
const selectContentByType = createSelector(
  (state, { contentType }) => contentType,
  selectContent,
  (type, content) => content[type],
);
export const selectContentByKey = createSelector(
  (state, { key }) => key,
  selectLocale,
  selectContentByType,
  (key, locale, content) => content[key] && content[key][locale],
);

export const selectContentReady = createSelector(
  selectGlobal,
  global => global.contentReady,
);
const selectContentReadyByType = createSelector(
  (state, { contentType }) => contentType,
  selectContentReady,
  (type, content) => content[type],
);
export const selectContentReadyByKey = createSelector(
  (state, { contentType }) => contentType,
  selectLocale,
  selectContentReadyByType,
  (key, locale, content) => content[key] && content[key][locale],
);

export const selectContentRequested = createSelector(
  selectGlobal,
  global => global.contentReady,
);
const selectContentRequestedByType = createSelector(
  (state, { contentType }) => contentType,
  selectContentRequested,
  (type, content) => content[type],
);
export const selectContentRequestedByKey = createSelector(
  (state, { key }) => key,
  selectLocale,
  selectContentRequestedByType,
  (key, locale, content) => content[key] && content[key][locale],
);

export const selectShowDisclaimer = createSelector(
  selectGlobal,
  global => global.showDisclaimer,
);
export const selectQueryType = createSelector(
  selectGlobal,
  global => global.queryType,
);

export const selectGroupsByArea = createSelector(
  selectGlobal,
  global => global.groupsByArea,
);
export const selectGroupsByAreaArgs = createSelector(
  selectGroupsByArea,
  data => data && data.args,
);

const getGroupsByAreaAll = (data, groups, biomes, realms) => {
  let rGroups = [];
  let vGroups = [];
  if (groups && data.groups.raster) {
    rGroups = data.groups.raster.map(d => ({
      ...d,
      ...groups.find(g => g.id === d.layer_id),
    }));
  }
  if (groups && data.groups.vector) {
    vGroups = data.groups.vector.map(d => ({
      ...d,
      ...groups.find(g => g.id === d.layer_id),
    }));
  }
  // if (groups && data.groups.vector) {
  //   // console.log(groupBy(data.groups.vector, l => l.layer_id))
  //   const maxOverall = data.groups.vector.reduce(
  //     (max, g) => (g.area ? Math.max(max, g.area) : max),
  //     0,
  //   );
  //   const grouped = groupBy(data.groups.vector, l => l.layer_id);
  //   vGroups = Object.keys(grouped).map(lid => ({
  //     ...groups.find(g => g.id === lid),
  //     stats: {
  //       occurrences: Object.keys(GROUP_LAYER_PROPERTIES.OCCURRENCE).reduce(
  //         (memo, occurr) => {
  //           const o = grouped[lid].find(a =>
  //             quasiEquals(a.occurrence, occurr),
  //           );
  //           return {
  //             ...memo,
  //             [occurr]: {
  //               id: GROUP_LAYER_PROPERTIES.OCCURRENCE[occurr].id,
  //               area: o ? o.area : null,
  //             },
  //           };
  //         },
  //         {},
  //       ),
  //       total: grouped[lid].reduce((sum, group) => sum + group.area, 0),
  //       max: grouped[lid].reduce(
  //         (max, group) => Math.max(group.area, max),
  //         0,
  //       ),
  //       min: grouped[lid].reduce(
  //         (min, group) => (!min ? group.area : Math.min(min, group.area)),
  //         null,
  //       ),
  //       maxOverall,
  //     },
  //   }));
  // }
  const allGroups = [...vGroups, ...rGroups];
  return sortGroups(allGroups, biomes, realms);
};
const getGroupsForRegionAll = (data, groups, biomes, realms) => {
  let aGroups = [];
  if (groups && data.groups.areasbyregion) {
    // aGroups = data.groups.areasbyregion.map(d => ({
    //   ...d,
    //   ...groups.find(g => g.id === d.layer_id),
    // }));
    const grouped = groupBy(data.groups.areasbyregion, l => l.layer_id);
    aGroups = Object.keys(grouped).map(lid => ({
      ...groups.find(g => g.id === lid),
      stats: {
        occurrences: Object.keys(GROUP_LAYER_PROPERTIES.OCCURRENCE).reduce(
          (memo, occurr) => {
            const o = grouped[lid].find(a => quasiEquals(a.occurrence, occurr));
            return {
              ...memo,
              [occurr]: {
                id: GROUP_LAYER_PROPERTIES.OCCURRENCE[occurr].id,
                area: o ? o.area : null,
                area_relative: o ? o.area_relative : null,
              },
            };
          },
          {},
        ),
        maxOverall: 1,
      },
    }));
  }
  return sortGroups(aGroups, biomes, realms);
};

export const selectQueryGroups = createSelector(
  selectGroupsByArea,
  selectGroups,
  selectBiomes,
  selectRealms,
  selectQueryType,
  (data, groups, biomes, realms, type) => {
    if (type === 'region') {
      return getGroupsForRegionAll(data, groups, biomes, realms);
    }
    return getGroupsByAreaAll(data, groups, biomes, realms);
  },
);

const selectGroupsQueried = createSelector(
  selectGlobal,
  global => global.groupsByAreaQueried,
);
export const selectGroupsQueriedByType = createSelector(
  (state, layerType) => layerType,
  selectGroupsQueried,
  (layerType, data) => data.groups[layerType],
);
export const selectGroupsQueriedAny = createSelector(
  selectGroupsQueried,
  data =>
    data &&
    data.groups &&
    (!!data.groups.raster ||
      !!data.groups.vector ||
      !!data.groups.areasbyregion),
);

const selectGroupsQueryReady = createSelector(
  selectGlobal,
  global => global.groupsByAreaReady,
);
export const selectGroupsQueryReadyByType = createSelector(
  (state, layerType) => layerType,
  selectGroupsQueryReady,
  (layerType, data) => data.groups[layerType],
);
export const selectGroupsQueryReadyAny = createSelector(
  selectGroupsQueryReady,
  data =>
    data && data.groups && data.groups.areasbyregion
      ? !!data.groups.areasbyregion
      : !!data.groups.raster || !!data.groups.vector,
);
export const selectGroupsQueryReadyAll = createSelector(
  selectGroupsQueryReady,
  data =>
    data &&
    data.groups &&
    ((!!data.groups.raster && !!data.groups.vector) ||
      !!data.groups.areasbyregion),
);
export const selectAnalysePanelOpen = createSelector(
  selectGlobal,
  global => global.analysePanelOpen,
);
