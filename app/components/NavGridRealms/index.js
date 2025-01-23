/**
 *
 * NavGridRealms
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from 'grommet';
import { DEFAULT_LOCALE } from 'i18n';

import IconRealm from 'components/IconRealm';

import CardRealm from './CardRealm';

const WrapGrid = styled.div`
  margin: 0 -${({ theme }) => theme.global.edgeSize.small};
`;

const Label = styled.h4`
  text-transform: uppercase;
  margin: ${({ theme }) => theme.global.edgeSize.small} 0;
`;

function NavGridRealms({ label, items, itemClick, locale, type }) {
  return (
    <div>
      <Label>{`${items.length} ${label}`}</Label>
      <WrapGrid>
        <Box direction="row" wrap margin={{ bottom: 'large' }}>
          {items &&
            items.map(r => (
              <CardRealm
                key={r.id}
                onCardClick={() => itemClick(r.id)}
                label={r.title[locale] || r.title[DEFAULT_LOCALE]}
                realm={r}
                icon={<IconRealm realmId={r.id} type={type} />}
              />
            ))}
        </Box>
      </WrapGrid>
    </div>
  );
}

NavGridRealms.propTypes = {
  label: PropTypes.string,
  items: PropTypes.array,
  itemClick: PropTypes.func,
  locale: PropTypes.string,
  type: PropTypes.string,
};

export default memo(NavGridRealms);
