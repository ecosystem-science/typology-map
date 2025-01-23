import { getRegionFeatureTitle, areaToPolygonWKT } from 'containers/Map/utils';
import { formatAreaRelative } from 'utils/numbers';

import messages from './messages';

export const testArea = area => {
  const points = area.trim().split(',');
  return (
    points.length > 2 && points[0].trim(0) === points[points.length - 1].trim()
  );
};

export const getOpenArea = area => {
  const hasArea = area && area.trim() !== '' && testArea(area);
  // but we want an open area in the text area
  // prettier-ignore
  return hasArea
    ? area
      .trim()
      .split(',')
      .slice(0, -1)
      .join(',')
    : '';
};

export const getRealmOptions = (realms, biomeObject) =>
  realms && realms.filter(r => !biomeObject || biomeObject.realm === r.id);

export const getBiomeOptions = (realms, biomes, realmObject) =>
  realms &&
  biomes &&
  biomes
    .filter(b => !realmObject || b.realm === realmObject.id)
    .sort((a, b) => {
      const aRealmIndex = realms.findIndex(r => a.realm === r.id);
      const bRealmIndex = realms.findIndex(r => b.realm === r.id);
      if (aRealmIndex === bRealmIndex) {
        return a.id > b.id ? 1 : -1;
      }
      return aRealmIndex < bRealmIndex ? -1 : 1;
    });

export const getDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (mm < 10) {
    mm = `0${mm}`;
  }
  if (dd < 10) {
    dd = `0${dd}`;
  }
  return `${yyyy}${mm}${dd}`;
};

export const getCSVColumns = (queryType, intl) => {
  const columns = [
    {
      id: 'id',
      displayName: intl.formatMessage(messages.csvColumnGroupID),
    },
    {
      id: 'title',
      displayName: intl.formatMessage(messages.csvColumnGroupTitle),
    },
    {
      id: 'biome_id',
      displayName: intl.formatMessage(messages.csvColumnBiomeID),
    },
    {
      id: 'biome_title',
      displayName: intl.formatMessage(messages.csvColumnBiomeTitle),
    },
    {
      id: 'realm_id',
      displayName: intl.formatMessage(messages.csvColumnRealmID),
    },
    {
      id: 'realm_title',
      displayName: intl.formatMessage(messages.csvColumnRealmTitle),
    },
  ];
  if (queryType === 'region') {
    return [
      ...columns,
      {
        id: 'major',
        displayName: intl.formatMessage(messages.csvColumnMajorOccurrence),
      },
      {
        id: 'minor',
        displayName: intl.formatMessage(messages.csvColumnMinorOccurrence),
      },
      {
        id: 'region_id',
        displayName: intl.formatMessage(messages.csvColumnRegionID),
      },
      {
        id: 'region_title',
        displayName: intl.formatMessage(messages.csvColumnRegionTitle),
      },
    ];
  }
  return [
    ...columns,
    {
      id: 'area',
      displayName: intl.formatMessage(messages.csvColumnCustomArea),
    },
  ];
};

export const prepareCSVData = (
  resultGroups,
  queryType,
  queryArgs,
  realms,
  biomes,
  activeRegion,
  intl,
) =>
  resultGroups.map(group => {
    const biome = biomes.find(d => d.id === group.biome);
    const realm = realms.find(d => d.id === biome.realm);
    const groupData = {
      id: group.id,
      title: group.title[intl.locale],
      biome_id: group.biome,
      biome_title: biome.title[intl.locale],
      realm_id: realm.id,
      realm_title: realm.title[intl.locale],
    };
    if (queryType === 'region') {
      let stats = null;
      if (group.stats && group.stats.occurrences) {
        // prettier-ignore
        stats = Object.values(group.stats.occurrences).reduce(
          (m, o) => ({
            ...m,
            // major/minor
            [o.id]: o.area_relative
              ? formatAreaRelative(o.area_relative, intl)
              : 0,
          }),
          {},
        );
      }
      return {
        ...groupData,
        ...stats,
        region_id: queryArgs.regionId,
        region_title: getRegionFeatureTitle(activeRegion, intl.locale),
      };
    }
    return {
      ...groupData,
      area: queryArgs.area ? areaToPolygonWKT(queryArgs.area) : '',
    };
  });

export const generateCSVFilename = () => `rle-query-results_${getDate()}`;
