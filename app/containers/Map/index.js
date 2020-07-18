/**
 *
 * Map
 *
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import styled from 'styled-components';
import L from 'leaflet';
import 'leaflet.vectorgrid';
// import { cloneDeep } from 'lodash/lang';

import {
  MAPBOX,
  GEOJSON,
  LAYERS,
  GROUP_LAYER_PROPERTIES,
  GROUP_LAYER_OPTIONS,
} from 'config';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import Settings from './Settings';

import reducer from './reducer';
import saga from './saga';
import {
  selectLayers,
  selectBasemap,
  selectOpacity,
  selectCountry,
  selectZoomToBounds,
} from './selectors';
import { loadLayer } from './actions';

const Styled = styled.div`
  background: ${({ theme }) => theme.global.colors['light-1']};
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;
const MapContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;

// const getVectorStyle = (feature, opacity) => {
//   const value = feature.properties[GEOJSON.PROPERTIES.OCCURRENCE];
//   const geometryType = feature.geometry.type;
//   const featureStyle =
//     GROUP_LAYER_OPTIONS.VECTOR[
//       geometryType === 'LineString' || geometryType === 'MultiLineString'
//         ? 'line'
//         : 'area'
//     ];
//   if (value) {
//     const color =
//       GROUP_LAYER_PROPERTIES.OCCURRENCE[value] &&
//       GROUP_LAYER_PROPERTIES.OCCURRENCE[value].color;
//     if (color)
//       return {
//         ...featureStyle,
//         opacity,
//         fillOpacity: opacity,
//         color,
//       };
//   }
//   return {
//     ...featureStyle,
//     opacity,
//     fillOpacity: opacity,
//   };
// };
const getGeometryType = type =>
  type === 'LineString' || type === 'MultiLineString' || type === 'line'
    ? 'line'
    : 'area';

const getVectorGridStyle = (properties, opacity, type) => {
  const value = properties[GEOJSON.PROPERTIES.OCCURRENCE];
  const featureStyle = GROUP_LAYER_OPTIONS.VECTOR[type];
  if (value) {
    const color =
      GROUP_LAYER_PROPERTIES.OCCURRENCE[value] &&
      GROUP_LAYER_PROPERTIES.OCCURRENCE[value].color;
    if (color)
      // prettier-ignore
      return type === 'line'
        ? { ...featureStyle, opacity, color }
        : {
          ...featureStyle,
          fillOpacity: opacity,
          fillColor: color,
          color,
        };
  }
  return {
    ...featureStyle,
    opacity,
    fillOpacity: opacity,
  };
};

export function Map({
  group,
  fullscreen,
  layers,
  onLoadLayer,
  basemap,
  opacity,
  country,
  zoomToBounds,
}) {
  useInjectReducer({ key: 'map', reducer });
  useInjectSaga({ key: 'map', saga });

  const mapRef = useRef(null);
  const groupLayerGroupRef = useRef(null);
  const basemapLayerGroupRef = useRef(null);
  const countryLayerGroupRef = useRef(null);

  // init map
  useEffect(() => {
    mapRef.current = L.map('ll-map', {
      center: [30, 0],
      zoom: 1,
      minZoom: 1,
      maxBounds: [[-90, -315], [90, 315]],
    });
    // make sure group overlays are always rendered on top of basemap
    mapRef.current.createPane('groupOverlay');
    mapRef.current.getPane('groupOverlay').style.zIndex = 600;
    mapRef.current.getPane('groupOverlay').style.pointerEvents = 'none';
    // make sure country overlays are always rendered on top of basemap and groups
    mapRef.current.createPane('countryOverlay');
    mapRef.current.getPane('countryOverlay').style.zIndex = 650;
    mapRef.current.getPane('countryOverlay').style.pointerEvents = 'none';
    basemapLayerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    groupLayerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    countryLayerGroupRef.current = L.layerGroup().addTo(mapRef.current);

    // mapRef.current.on('zoomend', event => {
    //   console.log(mapRef.current.getZoom());
    // });

    mapRef.current.scrollWheelZoom.disable();
  }, []);

  useEffect(() => {
    if (fullscreen) {
      mapRef.current.scrollWheelZoom.enable();
    } else {
      mapRef.current.scrollWheelZoom.disable();
    }
  }, [fullscreen]);

  // change basemap
  useEffect(() => {
    if (basemapLayerGroupRef.current) {
      basemapLayerGroupRef.current.clearLayers();
      basemapLayerGroupRef.current.addLayer(
        L.tileLayer(MAPBOX.STYLE_URL_TEMPLATE, {
          style_id: MAPBOX.BASEMAP_STYLES[basemap || 'light'],
          username: MAPBOX.USER,
          accessToken: MAPBOX.TOKEN,
        }),
      );
    }
  }, [basemap]);

  // change opacity
  useEffect(() => {
    if (group && groupLayerGroupRef.current && group.layer) {
      groupLayerGroupRef.current.eachLayer(layer => {
        if (group.layer.type === 'raster') {
          layer.setOpacity(opacity);
        }
        if (group.layer.type === 'geojson' || group.layer.type === 'topojson') {
          layer.setStyle({
            opacity,
            fillOpacity: opacity,
          });
        }
      });
    }
  }, [opacity]);

  // change country
  useEffect(() => {
    if (countryLayerGroupRef.current) {
      if (country && LAYERS.countries) {
        if (LAYERS.countries.source === 'mapbox') {
          if (LAYERS.countries.type === 'style') {
            countryLayerGroupRef.current.addLayer(
              L.tileLayer(MAPBOX.STYLE_URL_TEMPLATE, {
                style_id: LAYERS.countries.style,
                username: MAPBOX.USER,
                accessToken: MAPBOX.TOKEN,
                pane: 'countryOverlay',
              }),
            );
          }
          if (LAYERS.countries.type === 'raster') {
            countryLayerGroupRef.current.addLayer(
              L.tileLayer(MAPBOX.RASTER_URL_TEMPLATE, {
                id: LAYERS.countries.tileset,
                accessToken: MAPBOX.TOKEN,
                pane: 'countryOverlay',
              }),
            );
          }
          // TODO allow vector layer
        }
      } else {
        countryLayerGroupRef.current.clearLayers();
      }
    }
  }, [country]);

  // change full screen
  useEffect(() => {
    if (mapRef) {
      mapRef.current.invalidateSize();
      if (fullscreen) {
        mapRef.current.setZoom(mapRef.current.getZoom() + 1);
      } else {
        mapRef.current.setZoom(Math.max(1, mapRef.current.getZoom() - 1));
      }
    }
  }, [fullscreen]);

  // change group
  useEffect(() => {
    // clear group layer
    if (groupLayerGroupRef) {
      groupLayerGroupRef.current.clearLayers();
    }
  }, [group]);

  // change group or stored vector layers
  useEffect(() => {
    // add mapbox tile layer
    if (group && group.layer && group.layer.source === 'mapbox') {
      if (groupLayerGroupRef) {
        groupLayerGroupRef.current.addLayer(
          L.tileLayer(MAPBOX.RASTER_URL_TEMPLATE, {
            id: group.layer.tileset,
            accessToken: MAPBOX.TOKEN,
            opacity,
            pane: 'groupOverlay',
            ...GROUP_LAYER_OPTIONS.RASTER,
          }),
        );
      }
      if (zoomToBounds) {
        mapRef.current.setView([30, 0], 1);
      }
    }
    // add vector layer
    if (
      group &&
      layers &&
      group.layer &&
      (group.layer.type === 'geojson' || group.layer.type === 'topojson')
    ) {
      // kick of loading of vector data for group if not present
      if (!layers[group.id]) {
        onLoadLayer(group.id, group.layer);
      }
      // display layer once loaded
      if (layers[group.id] && groupLayerGroupRef.current) {
        const layer = layers[group.id];
        if (zoomToBounds) {
          const jsonLayer = L.geoJSON(layer.data);
          mapRef.current.fitBounds(jsonLayer.getBounds(), {
            paddingBottomRight: [0, 75],
          });
        }
        const geoType = getGeometryType(group.layer.geometryType);
        const vectorGrid = L.vectorGrid.slicer(layer.data, {
          rendererFactory: L.svg.tile,
          vectorTileLayerStyles: {
            sliced: properties =>
              getVectorGridStyle(properties, opacity, geoType),
          },
        });
        groupLayerGroupRef.current.addLayer(vectorGrid);
      }
    }
  }, [group, layers]);

  return (
    <Styled>
      <MapContainer id="ll-map" />
      {group && <Settings group={group} fullscreen={fullscreen} />}
    </Styled>
  );
}

Map.propTypes = {
  layers: PropTypes.object,
  group: PropTypes.object,
  fullscreen: PropTypes.bool,
  onLoadLayer: PropTypes.func,
  basemap: PropTypes.string,
  opacity: PropTypes.number,
  country: PropTypes.bool,
  zoomToBounds: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  layers: state => selectLayers(state),
  opacity: state => selectOpacity(state),
  basemap: state => selectBasemap(state),
  country: state => selectCountry(state),
  zoomToBounds: state => selectZoomToBounds(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadLayer: (key, config) => {
      dispatch(loadLayer(key, config));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Map);
