/**
 *
 * ExploreGroup
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { Box, Button } from 'grommet';

import { Close } from 'components/Icons';

import {
  selectBiome,
  selectRealmForBiome,
  selectContentByKey,
} from 'containers/App/selectors';
import {
  loadContent,
  navigateTypology,
  navigate,
  setFullscreenImage,
  setInfoGroupQuery,
} from 'containers/App/actions';

import HTMLWrapper from 'components/HTMLWrapper';
import GroupDiagram from 'components/GroupDiagram';
import TypologyHeader from 'components/TypologyHeader';
import TypologyContent from 'components/TypologyContent';
import TypologyImage from 'components/TypologyImage';

import { getHeaderHeight } from 'utils/responsive';

const Styled = styled(Box)`
  pointer-events: all;
  position: fixed;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.dimensions.aside.zIndex};
  right: 0;
  bottom: 0;
  top: ${getHeaderHeight('small')}px;
  width: 100%;
  max-width: 700px;
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    top: ${getHeaderHeight('medium')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    top: ${getHeaderHeight('large')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.xlarge.minpx}) {
    top: ${getHeaderHeight('xlarge')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.xxlarge.minpx}) {
    top: ${getHeaderHeight('xxlarge')}px;
  }
`;

const ContentWrap = styled.div`
  position: relative;
  pointer-events: all;
  z-index: ${({ theme }) => theme.dimensions.mainContent.zIndex};
  width: 100%;
  padding: ${({ theme }) => theme.global.edgeSize.small};
  padding-top: ${({ theme }) => theme.global.edgeSize.medium};
  min-height: 66vh;
  /* responsive height */
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    padding-right: ${({ theme }) => theme.global.edgeSize.ms};
    padding-left: ${({ theme }) => theme.global.edgeSize.ms};
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    padding-right: ${({ theme }) => theme.global.edgeSize.medium};
    padding-left: ${({ theme }) => theme.global.edgeSize.medium};
  }
  @media (min-width: ${({ theme }) => theme.sizes.xlarge.minpx}) {
    padding-right: ${({ theme }) => theme.global.edgeSize.large};
    padding-left: ${({ theme }) => theme.global.edgeSize.large};
  }
  @media (min-width: ${({ theme }) => theme.sizes.xxlarge.minpx}) {
    padding-right: ${({ theme }) => theme.global.edgeSize.xlarge};
    padding-left: ${({ theme }) => theme.global.edgeSize.xlarge};
  }
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 9999px;
  padding: 10px;
  margin-top: 20px;
  margin-right: 20px;
  background: ${({ theme }) => theme.global.colors['light-2']};
  z-index: 1111;
  &:hover {
    color: white;
    background: ${({ theme }) => theme.global.colors.brand};
  }
`;

export function GroupInfo({
  group,
  onLoadContent,
  content,
  navBiome,
  navRealm,
  intl,
  biome,
  realm,
  onSetFullscreenImage,
  onClose,
}) {
  useEffect(() => {
    // kick off loading of page content
    onLoadContent(group.path);
  }, [group]);

  const { locale } = intl;

  return (
    <Styled
      direction="column"
      flex={{ shrink: 0 }}
      elevation="medium"
      background="white"
    >
      <ContentWrap>
        <TypologyContent>
          <TypologyHeader
            typology={group}
            locale={locale}
            ancestors={[
              {
                ...realm,
                typologyType: 'realm',
                nav: () => navRealm(realm.id),
              },
              {
                ...biome,
                typologyType: 'biome',
                nav: () => navBiome(group.biome),
              },
            ]}
          />
          <TypologyImage inText typology={group} locale={locale} />
          <HTMLWrapper
            innerhtml={content}
            classNames={['rle-html-group']}
            inject={[
              {
                tag: '[DIAGRAM]',
                el: () => (
                  <GroupDiagram
                    group={group}
                    onFullscreen={() =>
                      onSetFullscreenImage({ typology: group })
                    }
                  />
                ),
              },
            ]}
          />
        </TypologyContent>
      </ContentWrap>
      <CloseButton plain onClick={() => onClose()} label={<Close />} />
    </Styled>
  );
}

GroupInfo.propTypes = {
  group: PropTypes.object.isRequired,
  biome: PropTypes.object,
  realm: PropTypes.object,
  onLoadContent: PropTypes.func.isRequired,
  navBiome: PropTypes.func.isRequired,
  navRealm: PropTypes.func.isRequired,
  onSetFullscreenImage: PropTypes.func.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  intl: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  content: (state, { group }) =>
    selectContentByKey(state, {
      contentType: 'groups',
      key: group.path,
    }),
  realm: (state, { group }) => selectRealmForBiome(state, group.biome),
  biome: (state, { group }) => selectBiome(state, group.biome),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadContent: path => {
      dispatch(loadContent('groups', path));
    },
    navGroup: id => dispatch(navigateTypology('groups', id)),
    navBiome: id => dispatch(navigateTypology('biomes', id)),
    navRealm: id => dispatch(navigateTypology('realms', id)),
    navExplore: () => dispatch(navigate('explore')),
    onClose: () => dispatch(setInfoGroupQuery('')),
    onSetFullscreenImage: args =>
      dispatch(setFullscreenImage('GroupDiagram', args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(injectIntl(GroupInfo));
