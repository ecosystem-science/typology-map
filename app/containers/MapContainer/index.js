/**
 *
 * MapContainer
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled, { css } from 'styled-components';
import { ResponsiveContext } from 'grommet';

import {
  selectLocale,
  selectGroup,
  selectDrawActive,
  selectAnalysePanelOpen,
} from 'containers/App/selectors';

import { updateGroupsQuery } from 'containers/App/actions';

import Map from 'containers/Map';

import { Expand, Contract, AnalysePoly, AnalyseRect } from 'components/Icons';
import MapControls from 'components/MapControls';
import MapControl from 'components/MapControl';
import TopGraphic from 'components/TopGraphic';

import { getAsideWidth, isMinSize } from 'utils/responsive';

// prettier-ignore
const Styled = styled(TopGraphic)`
  z-index: ${({ isFS }) => (isFS ? 1000 : 1)};
  pointer-events: ${({ active }) => (active ? 'all' : 'none')};
  visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
  ${({ isFS }) =>
    isFS &&
    css`
      bottom: 0 !important;
      right: ${({ aside, asideWidth }) =>
    aside ? asideWidth : 0}px !important;
      height: auto !important;
    `}
`;

export function MapContainer({
  group,
  locale,
  groupId,
  expandWithAside,
  mode,
  drawActive,
  analysePanelOpen,
  resetQueryArea,
}) {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [drawMode, setDrawMode] = useState('rectangle');

  const showControlsSmall = mode !== 'analyse' || !analysePanelOpen;

  // prettier-ignore
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <Styled
          isFS={expandWithAside || (groupId && isMapExpanded)}
          active={expandWithAside || !!groupId}
          aside={expandWithAside}
          asideWidth={getAsideWidth(size)}
        >
          <Map
            group={group}
            fullscreen={expandWithAside || isMapExpanded}
            locale={locale}
            size={size}
            mode={mode}
            drawMode={drawMode}
            showControls={isMinSize(size, 'medium') || showControlsSmall}
          />
          {(isMinSize(size, 'medium') || showControlsSmall) &&
            !expandWithAside && (
            <MapControls position="right">
              <MapControl
                icon={
                  isMapExpanded ? (
                    <Contract color="black" />
                  ) : (
                    <Expand color="black" />
                  )
                }
                onClick={() => setIsMapExpanded(!isMapExpanded)}
              />
            </MapControls>
          )}
          {(isMinSize(size, 'medium') || showControlsSmall) && drawActive && (
            <MapControls position="right" square>
              <MapControl
                square
                active={drawMode === 'rectangle'}
                disabled={drawMode === 'rectangle'}
                icon={
                  <AnalyseRect
                    color={drawMode === 'rectangle' ? 'white' : 'black'}
                  />
                }
                onClick={() => {
                  resetQueryArea();
                  setDrawMode('rectangle');
                }}
              />
              <MapControl
                square
                active={drawMode === 'polygon'}
                disabled={drawMode === 'polygon'}
                icon={
                  <AnalysePoly
                    color={drawMode === 'polygon' ? 'white' : 'black'}
                  />
                }
                onClick={() => {
                  resetQueryArea();
                  setDrawMode('polygon');
                }}
              />
            </MapControls>
          )}
        </Styled>
      )}
    </ResponsiveContext.Consumer>
  );
}

MapContainer.propTypes = {
  group: PropTypes.object,
  locale: PropTypes.string,
  groupId: PropTypes.string,
  expandWithAside: PropTypes.bool,
  drawActive: PropTypes.bool,
  analysePanelOpen: PropTypes.bool,
  mode: PropTypes.string,
  resetQueryArea: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    resetQueryArea: () =>
      dispatch(
        updateGroupsQuery({
          area: '',
        }),
      ),
  };
}

const mapStateToProps = createStructuredSelector({
  locale: state => selectLocale(state),
  group: (state, { groupId }) => groupId && selectGroup(state, groupId),
  drawActive: state => selectDrawActive(state),
  analysePanelOpen: state => selectAnalysePanelOpen(state),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(MapContainer);
