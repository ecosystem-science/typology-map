/**
 *
 * FullscreenImage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';

import { setFullscreenImage } from 'containers/App/actions';

import GroupDiagram from 'components/GroupDiagram';
import TopGraphic from 'components/TopGraphic';

const Styled = styled(TopGraphic)`
  z-index: 99999;
  bottom: 0 !important;
  right: 0 !important;
  height: auto !important;
`;

export function FullscreenImage({ config, onClose }) {
  const { imageType, typology } = config;
  return (
    <Styled>
      {imageType === 'GroupDiagram' && !!typology && (
        <GroupDiagram
          group={typology}
          fullscreen
          onFullscreen={() => onClose()}
        />
      )}
    </Styled>
  );
}

FullscreenImage.propTypes = {
  config: PropTypes.object,
  onClose: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    onClose: () => dispatch(setFullscreenImage()),
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(FullscreenImage);
