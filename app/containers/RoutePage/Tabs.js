/**
 *
 * Tabs
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { filter } from 'lodash';

import styled from 'styled-components';
import { Box, Button, Text } from 'grommet';

import { PAGES } from 'config';
import { SECONDARY } from 'containers/App/constants';

import commonMessages from 'messages';

const StyledTabs = styled(p => <Box {...p} />)`
  transform: translateY(-100%);
`;
const TabButton = styled(p => <Button {...p} />)`
  font-weight: bold;
  background: ${({ theme, isActive }) =>
    isActive ? theme.global.colors.brand : theme.global.colors['brand-2']};
  color: white;
  border: none;
  margin: 0;
  &:hover {
    background: ${({ theme }) => theme.global.colors.hover};
  }
`;
const pagesArray = Object.keys(PAGES).map(key => ({
  key,
  ...PAGES[key],
}));

const Tabs = ({ pageId, onTabChange, group }) => {
  const pagesSecondary = filter(pagesArray, p => p.nav === SECONDARY);
  const tabs = pagesSecondary.filter(p => p.group === group);

  return (
    <StyledTabs direction="row" justify="start">
      {tabs &&
        tabs.map(
          tab =>
            tab &&
            tab.key && (
              <TabButton
                key={tab.key}
                isActive={tab.key === pageId}
                onClick={() => {
                  onTabChange(tab.key);
                }}
              >
                <Box pad={{ vertical: 'small', horizontal: 'medium' }}>
                  <Text>
                    <FormattedMessage {...commonMessages[`page_${tab.key}`]} />
                  </Text>
                </Box>
              </TabButton>
            ),
        )}
    </StyledTabs>
  );
};

Tabs.propTypes = {
  pageId: PropTypes.string,
  group: PropTypes.string,
  onTabChange: PropTypes.func,
};

export default Tabs;
