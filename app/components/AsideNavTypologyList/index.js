/**
 *
 * AsideNavTypologyList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button } from 'grommet';
import styled from 'styled-components';
import { DEFAULT_LOCALE } from 'i18n';

import { Info } from 'components/Icons';

import AsideNavTypologyButton from 'components/AsideNavTypologyButton';

const Wrap = styled(Box)`
  position: relative;
  width: 100%;
  border-top: 1px solid;
  border-top-color: ${({ theme }) => theme.global.colors.border.light};
  &:last-child {
    border-bottom: 1px solid;
    border-bottom-color: ${({ theme }) => theme.global.colors.border.light};
  }
`;
const ButtonInfo = styled(Button)`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  border-radius: 99999px;
  padding: 5px;
  color: red;
  &:hover {
    background: ${({ theme }) => theme.global.colors['light-2']};
  }
`;

function AsideNavTypologyList({
  items,
  locale,
  level,
  selectItem,
  infoItem,
  activeId,
  selectParent,
  showAreas,
}) {
  return (
    <Box>
      {items &&
        items.map(item => (
          <Wrap key={item.id}>
            <AsideNavTypologyButton
              onClick={() =>
                item.id === activeId && selectParent
                  ? selectParent()
                  : selectItem(item.id)
              }
              id={item.id}
              name={item.title[locale] || item.title[DEFAULT_LOCALE]}
              stats={showAreas && item.stats ? item.stats : null}
              level={level}
              active={item.id === activeId}
              hasInfo={!!infoItem}
              showAreas={showAreas}
            />
            {infoItem && (
              <ButtonInfo
                plain
                label={<Info color="black" size="xxlarge" />}
                onClick={() => infoItem(item.id)}
              />
            )}
          </Wrap>
        ))}
    </Box>
  );
}

AsideNavTypologyList.propTypes = {
  items: PropTypes.array,
  level: PropTypes.number,
  locale: PropTypes.string,
  activeId: PropTypes.string,
  selectItem: PropTypes.func,
  infoItem: PropTypes.func,
  selectParent: PropTypes.func,
  showAreas: PropTypes.bool,
};

export default AsideNavTypologyList;
