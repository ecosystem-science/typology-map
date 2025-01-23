/**
 *
 * ExploreRealm
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

import {
  selectContentByKey,
  selectBiomesForRealmWithStats,
  selectRealms,
} from 'containers/App/selectors';
import {
  loadContent,
  navigateTypology,
  navigate,
  resetGroupsQuery,
} from 'containers/App/actions';

import AnalysisShortcut from 'components/AnalysisShortcut';
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

import { isMinSize, isMaxSize } from 'utils/responsive';

import commonMessages from 'messages';
import messages from './messages';

export function ExploreRealm({
  typology,
  onLoadContent,
  content,
  biomes,
  navBiome,
  navExplore,
  navAnalysis,
  intl,
  realms,
}) {
  useEffect(() => {
    // kick off loading of page content
    onLoadContent(typology.path);
  }, [typology]);
  const { locale } = intl;
  const sortedBiomes = biomes && biomes.sort((a, b) => (a.id > b.id ? 1 : -1));
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <>
          <Helmet>
            <title>
              {intl.formatMessage(messages.metaTitle, {
                realm: typology.title[locale] || typology.title[DEFAULT_LOCALE],
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
                  <TypologyHeader typology={typology} locale={locale} />
                  <HTMLWrapper
                    innerhtml={content}
                    classNames={['rle-html-realm']}
                    truncate={isMaxSize(size, 'small')}
                  />
                  {biomes && (
                    <NavGridChildren
                      items={sortedBiomes}
                      type="biomes"
                      itemClick={id => navBiome(id)}
                      locale={locale}
                      parent={typology}
                    />
                  )}
                  {realms && (
                    <RelatedHint
                      typology={typology}
                      realms={realms}
                      wrap={false}
                    />
                  )}
                  <AnalysisShortcut
                    type="realm"
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
                  <AsideNavTypologySelected
                    level={0}
                    id={typology.id}
                    name={typology.title[locale] || typology.title[DEFAULT_LOCALE]}
                    onDismiss={() => navExplore()}
                    active
                  />
                </AsideNavSection>
                {realms && <RelatedHint typology={typology} realms={realms} />}
                <AsideNavSection>
                  <AsideNavLabel
                    label={<FormattedMessage {...commonMessages.biomeSelect} />}
                  />
                  <AsideNavTypologyList
                    items={sortedBiomes}
                    level={1}
                    locale={locale}
                    selectItem={id => navBiome(id)}
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

ExploreRealm.propTypes = {
  typology: PropTypes.object.isRequired,
  biomes: PropTypes.array,
  realms: PropTypes.array,
  onLoadContent: PropTypes.func.isRequired,
  navBiome: PropTypes.func.isRequired,
  navExplore: PropTypes.func.isRequired,
  navAnalysis: PropTypes.func.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  content: (state, { typology }) =>
    selectContentByKey(state, {
      contentType: 'realms',
      key: typology.path,
    }),
  biomes: (state, { typology }) =>
    selectBiomesForRealmWithStats(state, typology.id),
  realms: state => selectRealms(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadContent: path => {
      dispatch(loadContent('realms', path));
    },
    navBiome: id => dispatch(navigateTypology('biomes', id)),
    navExplore: () => dispatch(navigate(ROUTES.EXPLORE)),
    navAnalysis: realm => {
      dispatch(resetGroupsQuery());
      dispatch(
        navigate(
          {
            pathname: ROUTES.ANALYSE,
            search: {
              realm,
              biome: '',
            },
          },
          {
            deleteSearchParams: ['biome', 'info', 'active'],
          },
        ),
      );
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(injectIntl(ExploreRealm));
