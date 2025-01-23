/**
 *
 * Map
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet.vectorgrid';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw-src.css';
// import { cloneDeep } from 'lodash/lang';

import {
  MAPBOX,
  GEOJSON,
  LAYERS,
  GROUP_LAYER_PROPERTIES,
  GROUP_LAYER_OPTIONS,
  MAP_OPTIONS,
  PAGES,
  QUERY_REGIONS_LAYER,
  QUERY_REGIONS_LAYER_MASK,
} from 'config';

import {
  navigatePage,
  updateGroupsQuery,
  setAnalysePanelOpen,
} from 'containers/App/actions';
import {
  selectGroupsQueryArea,
  selectGroupsQueryRegion,
  selectGroupsQueryArgs,
  selectDrawActive,
  selectQueryRegionsActive,
  selectQueryType,
} from 'containers/App/selectors';

import { Plus, Minus } from 'components/Icons';
import LoadingIndicator from 'components/LoadingIndicator';
import MapControls from 'components/MapControls';
import MapControl from 'components/MapControl';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import quasiEquals from 'utils/quasi-equals';
import reducer from './reducer';
import saga from './saga';
import {
  getAreaWKTFromLayer,
  getLatLngsFromArea,
  getRegionFeatureTooltip,
} from './utils';

import Settings from './Settings';
import Attribution from './Attribution';

import {
  selectLayers,
  selectBasemap,
  selectOpacity,
  selectCountry,
  selectZoomToBounds,
  selectLayersLoading,
  selectRegionHighlight,
} from './selectors';
import { loadLayer, setRegionHighlight } from './actions';

import messages from './messages';
import Style from './styles';

const Styled = styled.div`
  background: ${({ theme }) => theme.global.colors['light-1']};
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;
const LeafletContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;

const LoadingWrap = styled(LeafletContainer)`
  z-index: 999;
  pointer-events: none;
`;

const getGeometryType = type =>
  type === 'LineString' || type === 'MultiLineString' || type === 'line'
    ? 'line'
    : 'area';

const getVectorGridGroupStyle = (properties, opacity, type) => {
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
          opacity,
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
  loading,
  onNavPage,
  queryArea,
  drawActive,
  queryRegionsActive,
  updateQueryArea,
  updateQueryRegion,
  theme,
  intl,
  queryType,
  queryRegion,
  onSetRegionHighlight,
  regionHighlight,
  size,
  mode,
  drawMode,
  showControls,
  onOpenAnalysePanel,
}) {
  // console.log('render map')
  useInjectReducer({ key: 'map', reducer });
  useInjectSaga({ key: 'map', saga });

  const mapRef = useRef(null);
  const queryAreaLayerGroupRef = useRef(null);
  const drawFeatureGroupRef = useRef(null);
  const groupLayerGroupRef = useRef(null);
  const highlightLayerGroupRef = useRef(null);
  const basemapLayerGroupRef = useRef(null);
  const countryLayerGroupRef = useRef(null);
  const drawPolygonControl = useRef(null);
  const drawRectangleControl = useRef(null);

  const [tilesLoading, setTilesLoading] = useState(false);
  const [zoom, setZoom] = useState(MAP_OPTIONS.zoom);

  const { locale } = intl;

  // init map
  useEffect(() => {
    // console.log('map init')
    mapRef.current = L.map('ll-map', MAP_OPTIONS);
    // make sure country overlays are always rendered on top of basemap and groups
    mapRef.current.createPane('countryOverlay');
    mapRef.current.getPane('countryOverlay').style.zIndex = 250;
    mapRef.current.getPane('countryOverlay').style.pointerEvents = 'none';
    mapRef.current.createPane('basemapPane');
    mapRef.current.getPane('basemapPane').style.zIndex = 100;
    // group and highlight layers added to tilePane
    mapRef.current.getPane('tilePane').style.zIndex = 200;
    basemapLayerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    groupLayerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    countryLayerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    queryAreaLayerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    drawFeatureGroupRef.current = L.featureGroup().addTo(mapRef.current);
    highlightLayerGroupRef.current = L.featureGroup().addTo(mapRef.current);

    mapRef.current.on('zoomend', () => {
      setZoom(mapRef.current.getZoom());
    });
    mapRef.current.on('draw:created', e => {
      // console.log('map draw created')
      if (e.layer) {
        const areaWKT = getAreaWKTFromLayer(e.layer);
        updateQueryArea(areaWKT);
      }
    });
    if (!fullscreen) {
      mapRef.current.scrollWheelZoom.disable();
    }
    mapRef.current.invalidateSize();
  }, []);

  useEffect(() => {
    if (mapRef) mapRef.current.invalidateSize();
  }, [size]);

  useEffect(() => {
    if (fullscreen) {
      mapRef.current.scrollWheelZoom.enable();
    } else {
      mapRef.current.scrollWheelZoom.disable();
    }
  }, [fullscreen]);

  useEffect(() => {
    if (mapRef.current.getZoom() !== zoom) {
      mapRef.current.setZoom(zoom);
    }
  }, [zoom]);

  // change basemap
  useEffect(() => {
    if (basemapLayerGroupRef.current) {
      basemapLayerGroupRef.current.clearLayers();
      basemapLayerGroupRef.current.addLayer(
        L.tileLayer(MAPBOX.STYLE_URL_TEMPLATE, {
          pane: 'basemapPane',
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
          layer.setOpacity(opacity);
          if (layer.setStyle) {
            layer.setStyle({
              opacity,
              fillOpacity: opacity,
            });
          }
        }
      });
    }
  }, [opacity]);

  // change country
  useEffect(() => {
    if (countryLayerGroupRef.current) {
      if (country && LAYERS.countries && mode !== 'analyse') {
        if (LAYERS.countries.source === 'mapbox') {
          if (LAYERS.countries.type === 'style') {
            countryLayerGroupRef.current.addLayer(
              L.tileLayer(MAPBOX.STYLE_URL_TEMPLATE, {
                style_id: LAYERS.countries.style,
                username: MAPBOX.USER,
                accessToken: MAPBOX.TOKEN,
                pane: 'countryOverlay',
              }).on({
                loading: () => setTilesLoading(true),
                load: () => setTilesLoading(false),
              }),
            );
          }
          if (LAYERS.countries.type === 'raster') {
            countryLayerGroupRef.current.addLayer(
              L.tileLayer(MAPBOX.RASTER_URL_TEMPLATE, {
                id: LAYERS.countries.tileset,
                accessToken: MAPBOX.TOKEN,
                pane: 'countryOverlay',
              }).on({
                loading: () => setTilesLoading(true),
                load: () => setTilesLoading(false),
              }),
            );
          }
          // TODO allow vector layer
        }
      } else {
        countryLayerGroupRef.current.clearLayers();
      }
    }
  }, [country, mode]);

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
      highlightLayerGroupRef.current.clearLayers();
    }
  }, [group]);

  // change group or stored vector layers
  useEffect(() => {
    // console.log('map change group')
    // add mapbox tile layer
    if (group && group.layer && group.layer.source === 'mapbox') {
      if (
        groupLayerGroupRef &&
        groupLayerGroupRef.current.getLayers().length === 0
      ) {
        groupLayerGroupRef.current.addLayer(
          L.tileLayer(MAPBOX.RASTER_URL_TEMPLATE, {
            id: group.layer.tileset,
            accessToken: MAPBOX.TOKEN,
            opacity,
            ...GROUP_LAYER_OPTIONS.RASTER,
          }).on({
            loading: () => setTilesLoading(true),
            load: () => setTilesLoading(false),
          }),
        );
      }
      if (zoomToBounds && mode !== 'analyse') {
        let latlngs;
        if (group.layer.extent) {
          const { N, S, W, E } = group.layer.extent;
          latlngs = [
            [parseInt(N || 85, 10), -parseInt(W || 180, 10)],
            [-parseInt(S || 85, 10), parseInt(E || 180, 10)],
          ];
        } else {
          latlngs = MAP_OPTIONS.defaultBounds;
        }
        mapRef.current.fitBounds(latlngs, {
          paddingBottomRight: [0, 40],
        });
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
      if (
        layers[group.id] &&
        groupLayerGroupRef.current &&
        groupLayerGroupRef.current.getLayers().length === 0
      ) {
        const layer = layers[group.id];
        const geoType = getGeometryType(group.layer.geometryType);
        const vectorGrid = L.vectorGrid.slicer(layer.data, {
          interactive: false,
          rendererFactory: L.svg.tile,
          vectorTileLayerStyles: {
            sliced: properties =>
              getVectorGridGroupStyle(properties, opacity, geoType),
          },
        });
        groupLayerGroupRef.current.addLayer(vectorGrid);
        if (zoomToBounds && mode !== 'analyse') {
          let latlngs;
          if (group.layer.extent) {
            const { N, S, W, E } = group.layer.extent;
            latlngs = [
              [parseInt(N || 85, 10), -parseInt(W || 180, 10)],
              [-parseInt(S || 85, 10), parseInt(E || 180, 10)],
            ];
          } else {
            const jsonLayer = L.geoJSON(layer.data);
            latlngs = jsonLayer.getBounds();
          }
          mapRef.current.fitBounds(latlngs, {
            paddingBottomRight: [0, 40],
          });
        }
      }
    }
  }, [group, layers, mode]);
  // add highlight layer
  useEffect(() => {
    if (
      mode !== 'analyse' &&
      group &&
      layers &&
      group['highlight-layer'] &&
      (group['highlight-layer'].type === 'geojson' ||
        group['highlight-layer'].type === 'topojson')
    ) {
      const auxId = `${group.id}-aux`;
      // kick of loading of vector data for group if not present
      if (!layers[auxId]) {
        onLoadLayer(auxId, group['highlight-layer']);
      }
      // display layer once loaded
      if (
        layers[auxId] &&
        highlightLayerGroupRef.current &&
        highlightLayerGroupRef.current.getLayers().length === 0
      ) {
        const layer = layers[auxId];
        const maxZoom = parseInt(group['highlight-layer']['max-zoom'], 10) || 4;
        const vectorGrid = L.vectorGrid.slicer(layer.data, {
          interactive: true,
          rendererFactory: L.svg.tile,
          vectorTileLayerStyles: {
            sliced: GROUP_LAYER_OPTIONS['VECTOR-AUX'],
          },
          maxZoom,
        });
        highlightLayerGroupRef.current.addLayer(vectorGrid);
        highlightLayerGroupRef.current.bringToFront();
        vectorGrid.on('click', e => {
          mapRef.current.setView(e.latlng, maxZoom + 1);
        });
      }
    }
  }, [group, layers]);

  useEffect(() => {
    // zoom to bounds when enabled
    if (group && zoomToBounds && mode !== 'analyse') {
      let latlngs;
      const layer = layers[group.id];
      if (group && group.layer && group.layer.extent) {
        const { N, S, W, E } = group.layer.extent;
        latlngs = [
          [parseInt(N || 85, 10), -parseInt(W || 180, 10)],
          [-parseInt(S || 85, 10), parseInt(E || 180, 10)],
        ];
      } else if (
        layer &&
        group &&
        group.layer &&
        (group.layer.type === 'geojson' || group.layer.type === 'topojson')
      ) {
        const jsonLayer = L.geoJSON(layer.data);
        latlngs = jsonLayer.getBounds();
      } else {
        latlngs = MAP_OPTIONS.defaultBounds;
      }
      mapRef.current.fitBounds(latlngs, {
        paddingBottomRight: [0, 40],
      });
    }
  }, [zoomToBounds]);

  const onRegionMouseOver = (e, feature) => {
    if (feature && feature.properties) {
      const id = feature.properties[QUERY_REGIONS_LAYER.featureId];
      onSetRegionHighlight(id);
    }
  };
  const onRegionMouseOut = () => {
    onSetRegionHighlight(null);
  };
  const onRegionClick = (e, feature) => {
    if (feature && feature.properties) {
      onOpenAnalysePanel();
      updateQueryRegion(feature.properties[QUERY_REGIONS_LAYER.featureId]);
    }
  };

  const getRegionStyle = (featureId, highlight, active) => {
    if (quasiEquals(active, featureId)) {
      if (quasiEquals(highlight, featureId)) {
        return {
          ...QUERY_REGIONS_LAYER.style,
          color: theme.global.colors['brand-2-light'],
          fillOpacity: 0.1,
          weight: 1,
        };
      }
      return {
        ...QUERY_REGIONS_LAYER.style,
        color: theme.global.colors['brand-2-light'],
        weight: 1,
      };
    }
    if (quasiEquals(highlight, featureId)) {
      return {
        ...QUERY_REGIONS_LAYER.style,
        color: theme.global.colors['brand-2-light'],
        fillOpacity: 0.1,
      };
    }
    return {
      ...QUERY_REGIONS_LAYER.style,
      color:
        active && active !== ''
          ? theme.global.colors['brand-2-lighter']
          : theme.global.colors['brand-2-light'],
    };
  };

  useEffect(() => {
    if (queryAreaLayerGroupRef && queryAreaLayerGroupRef.current) {
      if (queryRegionsActive) {
        queryAreaLayerGroupRef.current.clearLayers();
        if (
          layers &&
          (QUERY_REGIONS_LAYER.type === 'geojson' ||
            QUERY_REGIONS_LAYER.type === 'topojson')
        ) {
          if (!layers[QUERY_REGIONS_LAYER.key]) {
            onLoadLayer(QUERY_REGIONS_LAYER.key, QUERY_REGIONS_LAYER);
          }
          if (layers[QUERY_REGIONS_LAYER.key]) {
            const layer = layers[QUERY_REGIONS_LAYER.key];
            const regions = L.geoJSON(layer.data, {
              style: feature =>
                getRegionStyle(
                  feature.properties[QUERY_REGIONS_LAYER.featureId],
                  null,
                  queryRegion,
                ),
              onEachFeature: (feature, jsonLayer) => {
                const featureTitle = getRegionFeatureTooltip(feature, locale);
                jsonLayer.bindTooltip(featureTitle, { sticky: true });
                jsonLayer.on({
                  mouseover: e => onRegionMouseOver(e, feature),
                  mouseout: e => onRegionMouseOut(e, feature),
                  click: e => onRegionClick(e, feature),
                });
              },
            });
            queryAreaLayerGroupRef.current.addLayer(regions);
          }
          if (QUERY_REGIONS_LAYER_MASK) {
            if (!layers[QUERY_REGIONS_LAYER_MASK.key]) {
              onLoadLayer(
                QUERY_REGIONS_LAYER_MASK.key,
                QUERY_REGIONS_LAYER_MASK,
              );
            }
            if (layers[QUERY_REGIONS_LAYER_MASK.key]) {
              const layer = layers[QUERY_REGIONS_LAYER_MASK.key];
              const regions = L.geoJSON(layer.data, {
                style: {
                  ...QUERY_REGIONS_LAYER_MASK.style,
                  interactive: true,
                },
                // onEachFeature: (feature, jsonLayer) => {
                //   jsonLayer.bindTooltip('Overlapping area', { sticky: true });
                // },
              });
              queryAreaLayerGroupRef.current.addLayer(regions);
            }
          }
        }
      }
    }
  }, [queryRegionsActive, layers]);

  useEffect(() => {
    if (queryAreaLayerGroupRef && queryAreaLayerGroupRef.current) {
      if (!queryRegionsActive) {
        queryAreaLayerGroupRef.current.clearLayers();
        if (mode === 'analyse' && queryType === 'region' && queryRegion) {
          if (
            layers &&
            (QUERY_REGIONS_LAYER.type === 'geojson' ||
              QUERY_REGIONS_LAYER.type === 'topojson')
          ) {
            if (!layers[QUERY_REGIONS_LAYER.key]) {
              onLoadLayer(QUERY_REGIONS_LAYER.key, QUERY_REGIONS_LAYER);
            }
            if (layers[QUERY_REGIONS_LAYER.key]) {
              const layer = layers[QUERY_REGIONS_LAYER.key];
              const regions = L.geoJSON(layer.data, {
                filter: feature =>
                  quasiEquals(
                    queryRegion,
                    feature.properties[QUERY_REGIONS_LAYER.featureId],
                  ),
                style: feature =>
                  getRegionStyle(
                    feature.properties[QUERY_REGIONS_LAYER.featureId],
                    null,
                    queryRegion,
                  ),
                onEachFeature: (feature, jsonLayer) => {
                  const featureTitle = getRegionFeatureTooltip(feature, locale);
                  jsonLayer.bindTooltip(featureTitle, { sticky: true });
                  jsonLayer.on({
                    mouseover: e => onRegionMouseOver(e, feature),
                    mouseout: e => onRegionMouseOut(e, feature),
                    click: e =>
                      e &&
                      e.target &&
                      e.target.getBounds &&
                      mapRef.current &&
                      mapRef.current.fitBounds(e.target.getBounds()),
                  });
                },
              });
              queryAreaLayerGroupRef.current.addLayer(regions);
            }
            if (QUERY_REGIONS_LAYER_MASK) {
              if (!layers[QUERY_REGIONS_LAYER_MASK.key]) {
                onLoadLayer(
                  QUERY_REGIONS_LAYER_MASK.key,
                  QUERY_REGIONS_LAYER_MASK,
                );
              }
              if (layers[QUERY_REGIONS_LAYER_MASK.key]) {
                const layer = layers[QUERY_REGIONS_LAYER_MASK.key];
                const regions = L.geoJSON(layer.data, {
                  style: {
                    ...QUERY_REGIONS_LAYER_MASK.style,
                    interactive: true,
                  },
                  // onEachFeature: (feature, jsonLayer) => {
                  //   jsonLayer.bindTooltip('Overlapping area', { sticky: true });
                  // },
                });
                queryAreaLayerGroupRef.current.addLayer(regions);
              }
            }
          }
        }
      }
    }
  }, [mode, queryRegionsActive, queryRegion, layers]);

  // update region layer style
  useEffect(() => {
    if (
      queryRegionsActive &&
      queryAreaLayerGroupRef &&
      queryAreaLayerGroupRef.current &&
      queryAreaLayerGroupRef.current.getLayers &&
      queryAreaLayerGroupRef.current.getLayers().length > 0
    ) {
      const regions = queryAreaLayerGroupRef.current.getLayers()[0];
      regions.eachLayer(layer =>
        layer.setStyle(
          getRegionStyle(
            layer.feature.properties[QUERY_REGIONS_LAYER.featureId],
            regionHighlight,
            queryRegion,
          ),
        ),
      );
    }
  }, [queryRegionsActive, regionHighlight, queryRegion]);
  // zoom to region layer
  useEffect(() => {
    if (
      queryRegionsActive &&
      queryAreaLayerGroupRef &&
      queryAreaLayerGroupRef.current &&
      queryAreaLayerGroupRef.current.getLayers &&
      queryAreaLayerGroupRef.current.getLayers().length > 0
    ) {
      const regions = queryAreaLayerGroupRef.current.getLayers()[0];
      let hiLayer;
      regions.eachLayer(layer => {
        hiLayer = quasiEquals(
          queryRegion,
          layer.feature.properties[QUERY_REGIONS_LAYER.featureId],
        )
          ? layer
          : hiLayer;
      });
      if (hiLayer) {
        mapRef.current.fitBounds(hiLayer.getBounds());
      }
    }
  }, [queryRegion]);

  // enable leaflet draw
  useEffect(() => {
    // console.log('map enable draw')
    // let drawControl;
    if (drawActive && drawFeatureGroupRef.current) {
      L.drawLocal.edit.handlers.edit.tooltip.text = intl.formatMessage(
        messages.drawTooltipEdit,
      );
      L.drawLocal.edit.handlers.edit.tooltip.subtext = intl.formatMessage(
        messages.drawTooltipEditSub,
      );
      L.drawLocal.edit.handlers.remove.tooltip.text = intl.formatMessage(
        messages.drawTooltipRemove,
      );
      L.drawLocal.draw.handlers.rectangle.tooltip.start = intl.formatMessage(
        messages.drawTooltipRectangleStart,
      );
      L.drawLocal.draw.handlers.simpleshape.tooltip.end = intl.formatMessage(
        messages.drawTooltipRectangleEnd,
      );
      L.drawLocal.draw.handlers.polygon.tooltip.start = intl.formatMessage(
        messages.drawTooltipPolygonStart,
      );
      L.drawLocal.draw.handlers.polygon.tooltip.cont = intl.formatMessage(
        messages.drawTooltipPolygonCont,
      );
      L.drawLocal.draw.handlers.polygon.tooltip.end = intl.formatMessage(
        messages.drawTooltipPolygonEnd,
      );

      drawPolygonControl.current = new L.Draw.Polygon(mapRef.current, {
        allowIntersection: false,
        drawError: {
          message: intl.formatMessage(messages.drawError),
          // Message that will show when intersect
        },
        shapeOptions: {
          color: theme.global.colors['brand-2-light'],
          fillOpacity: 0.05,
          weight: 1,
          clickable: false,
        },
      });
      drawRectangleControl.current = new L.Draw.Rectangle(mapRef.current, {
        showArea: false,
        shapeOptions: {
          color: theme.global.colors['brand-2-light'],
          fillOpacity: 0.05,
          weight: 1,
          clickable: false,
        },
      });
    }
    // return () => drawControl && mapRef.current.removeControl(drawControl);
  }, [drawActive, queryArea]);

  // // draw query area
  useEffect(() => {
    // console.log('map draw controls')
    if (drawActive) {
      if (drawMode === 'polygon' && drawPolygonControl.current) {
        drawPolygonControl.current.enable();
        drawRectangleControl.current.disable();
      }
      if (drawMode === 'rectangle' && drawRectangleControl.current) {
        drawRectangleControl.current.enable();
        drawPolygonControl.current.disable();
      }
    } else {
      if (drawPolygonControl.current) {
        drawPolygonControl.current.disable();
      }
      if (drawRectangleControl.current) {
        drawRectangleControl.current.disable();
      }
    }
    return () => {
      if (drawPolygonControl.current) {
        drawPolygonControl.current.disable();
      }
      if (drawRectangleControl.current) {
        drawRectangleControl.current.disable();
      }
    };
  }, [drawMode, drawActive, queryArea]);

  // draw query area
  useEffect(() => {
    // console.log('map draw area')
    drawFeatureGroupRef.current.clearLayers();
    if (
      mode === 'analyse' &&
      queryType === 'area' &&
      queryArea &&
      queryArea.trim().length > 5
    ) {
      const latlngs = getLatLngsFromArea(queryArea);
      if (latlngs.length > 2) {
        const first = latlngs[0];
        const last = latlngs[latlngs.length - 1];
        // check for enclosed area
        if (first[0] === last[0] && first[1] === last[1]) {
          drawFeatureGroupRef.current.addLayer(
            L.polygon(latlngs, {
              color: theme.global.colors['brand-2-light'],
              fillOpacity: 0.05,
              weight: 1,
            }),
          );
        }
      }
    }
  }, [mode, queryType, queryArea]);
  return (
    <Styled>
      <LeafletContainer id="ll-map" />
      {showControls && (
        <Settings group={group} fullscreen={fullscreen} mode={mode} />
      )}
      {showControls && (
        <Attribution navFeedback={() => onNavPage(PAGES.feedback.path)} />
      )}
      {(tilesLoading || loading) && (
        <LoadingWrap>
          <LoadingIndicator />
        </LoadingWrap>
      )}
      {showControls && (
        <MapControls position="left">
          <MapControl
            disabled={MAP_OPTIONS.maxZoom === zoom}
            icon={
              <Plus color={MAP_OPTIONS.maxZoom === zoom ? 'dark-4' : 'black'} />
            }
            onClick={() => setZoom(zoom + 1)}
          />
          <MapControl
            disabled={MAP_OPTIONS.minZoom === zoom}
            icon={
              <Minus
                color={MAP_OPTIONS.minZoom === zoom ? 'dark-4' : 'black'}
              />
            }
            onClick={() => setZoom(zoom - 1)}
          />
        </MapControls>
      )}
      <Style />
    </Styled>
  );
}

Map.propTypes = {
  layers: PropTypes.object,
  group: PropTypes.object,
  fullscreen: PropTypes.bool,
  showControls: PropTypes.bool,
  onLoadLayer: PropTypes.func,
  onNavPage: PropTypes.func,
  basemap: PropTypes.string,
  opacity: PropTypes.number,
  country: PropTypes.bool,
  zoomToBounds: PropTypes.bool,
  loading: PropTypes.bool,
  drawActive: PropTypes.bool,
  queryRegionsActive: PropTypes.bool,
  queryType: PropTypes.string,
  queryArea: PropTypes.string,
  queryRegion: PropTypes.string,
  theme: PropTypes.object,
  updateQueryArea: PropTypes.func,
  updateQueryRegion: PropTypes.func,
  onSetRegionHighlight: PropTypes.func,
  onOpenAnalysePanel: PropTypes.func,
  regionHighlight: PropTypes.string,
  size: PropTypes.string,
  mode: PropTypes.string,
  drawMode: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  layers: state => selectLayers(state),
  opacity: state => selectOpacity(state),
  basemap: state => selectBasemap(state),
  country: state => selectCountry(state),
  zoomToBounds: state => selectZoomToBounds(state),
  loading: state => selectLayersLoading(state),
  queryType: state => selectQueryType(state),
  queryArea: state => selectGroupsQueryArea(state),
  queryRegion: state => selectGroupsQueryRegion(state),
  queryArgs: state => selectGroupsQueryArgs(state),
  regionHighlight: state => selectRegionHighlight(state),
  drawActive: state => selectDrawActive(state),
  queryRegionsActive: state => selectQueryRegionsActive(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
    onLoadLayer: (key, config) => {
      dispatch(loadLayer(key, config));
    },
    onNavPage: id => dispatch(navigatePage(id)),
    updateQueryArea: area =>
      dispatch(
        updateGroupsQuery({
          ...props.queryArgs,
          area,
        }),
      ),
    updateQueryRegion: regionId =>
      dispatch(
        updateGroupsQuery({
          ...props.queryArgs,
          regionId,
        }),
      ),
    onSetRegionHighlight: regionId => dispatch(setRegionHighlight(regionId)),
    onOpenAnalysePanel: () => dispatch(setAnalysePanelOpen(true)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(withTheme(injectIntl(Map)));
