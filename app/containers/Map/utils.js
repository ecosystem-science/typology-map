import isNumber from 'utils/is-number';

import { QUERY_REGIONS_LAYER } from 'config';

export const roundCoordinate = (value, digits = 6) => {
  const factor = 10 ** Math.min(digits, 10);
  return isNumber(value) && Math.round(value * factor) / factor;
};

export const getAreaWKTFromLayer = layer => {
  const latlngs = layer.getLatLngs()[0];
  if (latlngs.length > 2) {
    const pointsWKT = latlngs.reduce((memo, latlng) => {
      if (latlng.lat && latlng.lng) {
        return `${memo}${memo.length > 0 ? ',' : ''}${roundCoordinate(
          latlng.lng,
        )} ${roundCoordinate(latlng.lat)}`;
      }
      return memo;
    }, '');
    // close area
    return `${pointsWKT}, ${roundCoordinate(latlngs[0].lng)} ${roundCoordinate(
      latlngs[0].lat,
    )}`;
  }
  return '';
};

export const areaToPolygonWKT = area =>
  area && area.trim() !== '' ? encodeURI(`POLYGON((${area}))`) : '';

export const getLatLngsFromArea = area => {
  const points = area.split(',');
  const latlngs = points.reduce((m, p) => {
    const lngLat = p.trim().split(' ');
    if (lngLat.length === 2 && isNumber(lngLat[0]) && isNumber(lngLat[1])) {
      return [...m, [lngLat[1], lngLat[0]]];
    }
    return m;
  }, []);
  return latlngs;
};

export const getRegionFeatureTitle = (feature, locale) => {
  if (!feature) return '';
  const featureTitle = feature.properties[QUERY_REGIONS_LAYER.featureTitle[locale]];
  return featureTitle;
};
export const getRegionFeatureTooltip = (feature, locale) => {
  if (!feature) return '';
  const featureTitle = getRegionFeatureTitle(feature, locale);
  if (!locale) return featureTitle;
  const featureType =
    QUERY_REGIONS_LAYER.featureType[locale][
      feature.properties[QUERY_REGIONS_LAYER.featureTypeField]
    ];
  return `<div>
    <div><small>${featureType}</small></div>
    <div><strong>${featureTitle}</strong></div>
  </div>`;
};
