/**
 *
 * TypologyHeader
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from 'containers/Breadcrumb';
import NavAncestor from 'components/NavAncestor';
import IconRealm from 'components/IconRealm';
import styled from 'styled-components';
import { Box } from 'grommet';
import { DEFAULT_LOCALE } from 'i18n';

const Styled = styled(Box)``;
const TitleWrap = styled.h1`
  margin-bottom: ${({ theme }) => theme.global.edgeSize.medium};
  margin-top: ${({ theme }) => theme.global.edgeSize.small};
  font-size: ${({ theme }) => theme.text.xlarge.size};
  line-height: 1.1em;
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    font-size: ${({ theme }) => theme.text.xxlarge.size};
    line-height: 1.25em;
  }
`;

const Id = styled.span`
  margin-right: ${({ theme }) => theme.global.edgeSize.small};
  color: ${({ theme }) => theme.global.colors['dark-grey']};
`;
const Title = styled.span``;

const IconWrap = styled(p => <Box {...p} />)`
  margin-bottom: ${({ theme }) => theme.global.edgeSize.small};
`;

function TypologyHeader({ typology, ancestors, locale }) {
  return (
    <Styled>
      <IconWrap>
        <IconRealm realmId={ancestors ? ancestors[0].id : typology.id} />
      </IconWrap>
      <Breadcrumb
        level={ancestors ? ancestors.length : 0}
        targets={ancestors ? ancestors.map(a => a.nav) : []}
      />
      <TitleWrap>
        <Id>{typology.id}</Id>
        <Title>{typology.title[locale] || typology.title[DEFAULT_LOCALE]}</Title>
      </TitleWrap>
      {ancestors && (
        <Box margin={{ bottom: 'small' }} responsive={false}>
          {ancestors.map(a => (
            <NavAncestor
              key={a.id}
              type={a.typologyType}
              onClick={() => a.nav()}
              id={a.id}
              name={a.title[locale] || a.title[DEFAULT_LOCALE]}
            />
          ))}
        </Box>
      )}
    </Styled>
  );
}

TypologyHeader.propTypes = {
  typology: PropTypes.object,
  ancestors: PropTypes.array,
  locale: PropTypes.string,
};

export default TypologyHeader;
