/**
 *
 * AsideNavTypologyButton
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Text, Box, ResponsiveContext } from 'grommet';
import { injectIntl } from 'react-intl';

import { formatAreaRelative } from 'utils/numbers';
import { isMinSize } from 'utils/responsive';

import { GROUP_LAYER_PROPERTIES } from 'config';
import messages from './messages';

const getSize = (level, size) => {
  if (level === 0) {
    return isMinSize(size, 'large') ? 'xlarge' : 'large';
  }
  if (level === 1) {
    return isMinSize(size, 'large') ? 'large' : 'medium';
  }
  return isMinSize(size, 'large') ? 'medium' : 'small';
};

// prettier-ignore
const StyledButton = styled(props => <Button {...props} plain />)`
  padding-top: ${({ theme }) => theme.global.edgeSize.small};
  padding-bottom: ${({ theme }) => theme.global.edgeSize.small};
  padding-right: ${({ theme, hasInfo }) => hasInfo ? '40px' : theme.global.edgeSize.small};
  padding-left: ${({ theme }) => theme.global.edgeSize.small};
  background: ${({ theme, active }) =>
    active ? theme.global.colors['light-2'] : 'transparent'};
  &:hover {
    background: ${({ theme, active }) =>
    active ? theme.global.colors['light-2'] : theme.global.colors['light-1']};
  }
  &:focus {
    background: ${({ theme, active }) =>
    active ? theme.global.colors['light-2'] : theme.global.colors['light-1']};
  }
`;

const Stats = styled.div`
  margin-top: 10px;
  margin-right: 10px;
`;
const BarWrapper = styled(p => <Box {...p} fill="horizontal" />)`
  position: relative;
  height: 11px;
  margin-bottom: 3px;
  background: ${({ theme, active }) =>
    theme.global.colors[active ? 'light-4' : 'light-3']};
`;
const Bar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 11px;
  width: ${({ percentage }) => percentage}%;
  min-width: ${({ hasArea }) => (hasArea ? 1 : 0)}px;
  background: ${({ color }) => color};
`;

const BarLabel = styled(p => <Text size="xxsmall" {...p} color="dark" />)`
  line-height: 11px;
  padding-right: 5px;
  text-align: right;
`;

function AsideNavTypologyButton({
  id,
  name,
  level,
  stats,
  showAreas,
  intl,
  active,
  ...rest
}) {
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <StyledButton
          active={active}
          label={
            <div>
              <div>
                <Text size={getSize(level, size)}>{`${id} ${name}`}</Text>
              </div>
              {showAreas && stats && stats.occurrences && (
                <Stats>
                  {Object.keys(stats.occurrences).map(key => {
                    const areaRelative = stats.occurrences[key].area_relative;
                    // const oid = stats.occurrences[key].id;
                    return (
                      <Box direction="row" key={key}>
                        <Box
                          flex={{ shrink: 0 }}
                          width="55px"
                          style={{ position: 'relative' }}
                        >
                          <BarLabel>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: intl.formatMessage(messages.area, {
                                  value: areaRelative
                                    ? formatAreaRelative(areaRelative, intl)
                                    : 0,
                                  unit: '%',
                                }),
                              }}
                            />
                          </BarLabel>
                        </Box>
                        <BarWrapper active={active}>
                          <Bar
                            color={GROUP_LAYER_PROPERTIES.OCCURRENCE[key].color}
                            percentage={(areaRelative || 0) * 100}
                            hasArea={areaRelative > 0}
                          />
                        </BarWrapper>
                      </Box>
                    );
                  })}
                </Stats>
              )}
            </div>
          }
          {...rest}
        />
      )}
    </ResponsiveContext.Consumer>
  );
}
// {!stats && (
//   <Text size="xxsmall">
//   <FormattedMessage {...messages.not_available} />
//   </Text>
// )}

AsideNavTypologyButton.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  level: PropTypes.number,
  hasInfo: PropTypes.bool,
  stats: PropTypes.object,
  showAreas: PropTypes.bool,
  active: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(AsideNavTypologyButton);
