/**
 *
 * ExploreBiome
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Box, ResponsiveContext } from 'grommet';

import { ROUTES } from 'config';
import { DEFAULT_LOCALE } from 'i18n';

import { sortGroups } from 'utils/store';

import {
  selectRealm,
  selectRealms,
  selectContentByKey,
  selectGroupsForBiome,
} from 'containers/App/selectors';
import {
  loadContent,
  navigateTypology,
  navigate,
  resetGroupsQuery,
} from 'containers/App/actions';

import ColumnMain from 'components/ColumnMain';
import ColumnMainContent from 'components/ColumnMainContent';
import ColumnAside from 'components/ColumnAside';
import NavGridChildren from 'components/NavGridChildren';
import HTMLWrapper from 'components/HTMLWrapper';
import AsideNavSection from 'components/AsideNavSection';
import AsideNavLabel from 'components/AsideNavLabel';
import AsideNavTypologySelected from 'components/AsideNavTypologySelected';
import AsideNavTypologyList from 'components/AsideNavTypologyList';
import TypologyHeader from 'components/TypologyHeader';
import TopGraphic from 'components/TopGraphic';
import TypologyImage from 'components/TypologyImage';
import TypologyContent from 'components/TypologyContent';
import RelatedHint from 'components/RelatedHint';
import AnalysisShortcut from 'components/AnalysisShortcut';

import { isMinSize, isMaxSize } from 'utils/responsive';

import commonMessages from 'messages';

import messages from './messages';

export function ExploreBiome({
  typology,
  onLoadContent,
  content,
  groups,
  navGroup,
  navRealm,
  navExplore,
  navAnalysis,
  intl,
  realm,
  realms,
}) {
  useEffect(() => {
    // kick off loading of page content
    onLoadContent(typology.path);
  }, [typology]);

  const { locale } = intl;

  const sortedGroups = sortGroups(groups);

  return (
    <ResponsiveContext.Consumer>
      {size => (
        <>
          <Helmet>
            <title>
              {intl.formatMessage(messages.metaTitle, {
                biome: typology.title[locale] || typology.title[DEFAULT_LOCALE],
              })}
            </title>
          </Helmet>
          <Box direction="row" fill="horizontal">
            <ColumnMain hasAside={isMinSize(size, 'large')}>
              <TopGraphic direction="row">
                <TypologyImage typology={typology} locale={locale} />
              </TopGraphic>
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
                    ]}
                  />
                  <HTMLWrapper
                    innerhtml={content}
                    classNames={['rle-html-biome']}
                    truncate={isMaxSize(size, 'small')}
                  />
                  {groups && (
                    <NavGridChildren
                      items={sortedGroups}
                      type="groups"
                      itemClick={id => navGroup(id)}
                      locale={locale}
                      parent={typology}
                    />
                  )}
                  <AnalysisShortcut
                    type="biome"
                    name={typology.title[locale] || typology.title[DEFAULT_LOCALE]}
                    onClick={() => navAnalysis(typology.id)}
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
                  {realm && (
                    <AsideNavTypologySelected
                      level={0}
                      id={realm.id}
                      name={realm.title[locale] || realm.title[DEFAULT_LOCALE]}
                      onDismiss={() => navExplore()}
                      onTypologyClick={() => navRealm(typology.realm)}
                    />
                  )}
                </AsideNavSection>
                {realms && <RelatedHint typology={realm} realms={realms} />}
                <AsideNavSection>
                  <AsideNavLabel
                    label={<FormattedMessage {...commonMessages.biome} />}
                  />
                  <AsideNavTypologySelected
                    level={1}
                    id={typology.id}
                    name={typology.title[locale] || typology.title[DEFAULT_LOCALE]}
                    onDismiss={() => navRealm(typology.realm)}
                    active
                  />
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
                  />
                </AsideNavSection>
              </ColumnAside>
            )}
          </Box>
        </>
      )}
    </ResponsiveContext.Consumer>
  );
}

ExploreBiome.propTypes = {
  typology: PropTypes.object.isRequired,
  realm: PropTypes.object,
  groups: PropTypes.array,
  realms: PropTypes.array,
  onLoadContent: PropTypes.func.isRequired,
  navGroup: PropTypes.func.isRequired,
  navRealm: PropTypes.func.isRequired,
  navExplore: PropTypes.func.isRequired,
  navAnalysis: PropTypes.func.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  content: (state, { typology }) =>
    selectContentByKey(state, {
      contentType: 'biomes',
      key: typology.path,
    }),
  realm: (state, { typology }) => selectRealm(state, typology.realm),
  groups: (state, { typology }) => selectGroupsForBiome(state, typology.id),
  realms: state => selectRealms(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadContent: path => {
      dispatch(loadContent('biomes', path));
    },
    navGroup: id => dispatch(navigateTypology('groups', id)),
    navRealm: id => dispatch(navigateTypology('realms', id)),
    navExplore: () => dispatch(navigate(ROUTES.EXPLORE)),
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

export default compose(withConnect)(injectIntl(ExploreBiome));
