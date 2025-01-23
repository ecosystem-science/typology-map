/**
 *
 * ExploreGroup
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { Box, ResponsiveContext } from 'grommet';

import { ROUTES } from 'config';
import { DEFAULT_LOCALE } from 'i18n';

import {
  selectBiome,
  selectRealmForBiome,
  selectContentByKey,
  selectGroupsForBiome,
  selectRealms,
} from 'containers/App/selectors';
import {
  loadContent,
  navigateTypology,
  navigate,
  resetGroupsQuery,
  setFullscreenImage,
} from 'containers/App/actions';

import ColumnMain from 'components/ColumnMain';
import ColumnMainContent from 'components/ColumnMainContent';
import ColumnAside from 'components/ColumnAside';
import HTMLWrapper from 'components/HTMLWrapper';
import GroupDiagram from 'components/GroupDiagram';
import AsideNavSection from 'components/AsideNavSection';
import AsideNavLabel from 'components/AsideNavLabel';
import AsideNavTypologySelected from 'components/AsideNavTypologySelected';
import AsideNavTypologyList from 'components/AsideNavTypologyList';
import TypologyHeader from 'components/TypologyHeader';
import TypologyContent from 'components/TypologyContent';
import TypologyImage from 'components/TypologyImage';
import RelatedHint from 'components/RelatedHint';
import AnalysisShortcut from 'components/AnalysisShortcut';

import { isMinSize, isMaxSize } from 'utils/responsive';

import commonMessages from 'messages';

import messages from './messages';

const Styled = styled.div`
  pointer-events: none;
`;

export function ExploreGroup({
  typology,
  onLoadContent,
  content,
  groups,
  navGroup,
  navBiome,
  navRealm,
  navExplore,
  navAnalysis,
  intl,
  biome,
  realm,
  realms,
  onSetFullscreenImage,
}) {
  useEffect(() => {
    // kick off loading of page content
    onLoadContent(typology.path);
  }, [typology]);

  const { locale } = intl;

  const sortedGroups =
    groups &&
    groups.sort((a, b) => {
      const aTrueId =
        a.id.indexOf('.') > -1 ? parseInt(a.id.split('.')[1], 0) : a.id;
      const bTrueId =
        b.id.indexOf('.') > -1 ? parseInt(b.id.split('.')[1], 0) : a.id;
      return aTrueId > bTrueId ? 1 : -1;
    });
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <Styled size={size}>
          <Helmet>
            <title>
              {intl.formatMessage(messages.metaTitle, {
                group: typology.title[locale] || typology.title[DEFAULT_LOCALE],
              })}
            </title>
          </Helmet>
          <Box
            direction="row"
            fill="horizontal"
            style={{ pointerEvents: 'none' }}
          >
            <ColumnMain
              hasAside={isMinSize(size, 'large')}
              style={{
                pointerEvents: 'none',
                position: 'relative',
                minHeight: '100vh',
              }}
            >
              <ColumnMainContent>
                <TypologyContent>
                  <TypologyHeader
                    typology={typology}
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
                        nav: () => navBiome(typology.biome),
                      },
                    ]}
                  />
                  <TypologyImage inText typology={typology} locale={locale} />
                  <HTMLWrapper
                    innerhtml={content}
                    classNames={['rle-html-group']}
                    truncate={isMaxSize(size, 'small')}
                    inject={[
                      {
                        tag: '[DIAGRAM]',
                        el: () => (
                          <GroupDiagram
                            group={typology}
                            onFullscreen={() =>
                              onSetFullscreenImage({ typology })
                            }
                          />
                        ),
                      },
                    ]}
                  />
                  <AnalysisShortcut
                    type="group"
                    name={typology.title[locale] || typology.title[DEFAULT_LOCALE]}
                    onClick={() => navAnalysis(typology.biome)}
                  />
                </TypologyContent>
              </ColumnMainContent>
            </ColumnMain>
            {isMinSize(size, 'medium') && (
              <ColumnAside>
                <AsideNavSection>
                  <AsideNavLabel
                    label={<FormattedMessage {...commonMessages.realm} />}
                  />
                  {realm && biome && (
                    <AsideNavTypologySelected
                      level={0}
                      id={realm.id}
                      name={realm.title[locale] || realm.title[DEFAULT_LOCALE]}
                      onDismiss={() => navExplore()}
                      onTypologyClick={() => navRealm(biome.realm)}
                    />
                  )}
                </AsideNavSection>
                {realms && <RelatedHint typology={realm} realms={realms} />}
                <AsideNavSection>
                  <AsideNavLabel
                    label={<FormattedMessage {...commonMessages.biome} />}
                  />
                  {biome && (
                    <AsideNavTypologySelected
                      level={1}
                      id={biome.id}
                      name={biome.title[locale] || biome.title[DEFAULT_LOCALE]}
                      onDismiss={() => navRealm(biome.realm)}
                      onTypologyClick={() => navBiome(biome.id)}
                    />
                  )}
                </AsideNavSection>
                <AsideNavSection>
                  <AsideNavLabel
                    label={<FormattedMessage {...commonMessages.groupSelect} />}
                  />
                  <AsideNavTypologyList
                    items={sortedGroups}
                    level={2}
                    locale={locale}
                    selectItem={id => navGroup(id)}
                    selectParent={() => navBiome(biome.id)}
                    activeId={typology.id}
                  />
                </AsideNavSection>
              </ColumnAside>
            )}
          </Box>
        </Styled>
      )}
    </ResponsiveContext.Consumer>
  );
}

ExploreGroup.propTypes = {
  typology: PropTypes.object.isRequired,
  biome: PropTypes.object,
  realm: PropTypes.object,
  groups: PropTypes.array,
  realms: PropTypes.array,
  onLoadContent: PropTypes.func.isRequired,
  navGroup: PropTypes.func.isRequired,
  navBiome: PropTypes.func.isRequired,
  navRealm: PropTypes.func.isRequired,
  navExplore: PropTypes.func.isRequired,
  navAnalysis: PropTypes.func.isRequired,
  onSetFullscreenImage: PropTypes.func.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  content: (state, { typology }) =>
    selectContentByKey(state, {
      contentType: 'groups',
      key: typology.path,
    }),
  realm: (state, { typology }) => selectRealmForBiome(state, typology.biome),
  biome: (state, { typology }) => selectBiome(state, typology.biome),
  groups: (state, { typology }) => selectGroupsForBiome(state, typology.biome),
  realms: state => selectRealms(state),
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
    onSetFullscreenImage: args =>
      dispatch(setFullscreenImage('GroupDiagram', args)),
    navAnalysis: biome => {
      dispatch(resetGroupsQuery());
      dispatch(
        navigate(
          {
            pathname: ROUTES.ANALYSE,
            search: {
              biome,
            },
          },
          {
            deleteSearchParams: ['realm', 'info', 'active'],
          },
        ),
      );
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(injectIntl(ExploreGroup));
