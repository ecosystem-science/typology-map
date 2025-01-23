/*
 * SectionExplore
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import NavGridRealms from 'components/NavGridRealms';

import commonMessages from 'messages';
import SectionTitle from 'components/styled/SectionTitle';
import SectionInner from 'components/styled/SectionInner';
import SectionOuter from 'components/styled/SectionOuter';
import SectionTeaser from 'components/styled/SectionTeaser';

import messages from './messages';

export function SectionExplore({ intl, realms, navRealm, title, teaser }) {
  const { locale } = intl;
  return (
    <SectionOuter background="light-2">
      <SectionInner>
        <SectionTitle>
          {title || <FormattedMessage {...messages.titleSectionExplore} />}
        </SectionTitle>
        <SectionTeaser>
          {teaser || <FormattedMessage {...messages.teaserSectionExplore} />}
        </SectionTeaser>
        {realms && (
          <NavGridRealms
            label={intl.formatMessage(commonMessages.realmsCore)}
            items={realms && realms.filter(r => r.type === 'core')}
            itemClick={id => navRealm(id)}
            locale={locale}
            type="core"
          />
        )}
        {realms && (
          <NavGridRealms
            label={intl.formatMessage(commonMessages.realmsTrans)}
            items={realms && realms.filter(r => r.type === 'trans')}
            itemClick={id => navRealm(id)}
            locale={locale}
            type="trans"
          />
        )}
      </SectionInner>
    </SectionOuter>
  );
}

SectionExplore.propTypes = {
  navRealm: PropTypes.func,
  intl: PropTypes.object.isRequired,
  title: PropTypes.string,
  teaser: PropTypes.string,
  realms: PropTypes.array,
};

export default injectIntl(SectionExplore);
