/**
 *
 * Overview
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Box, Text, ResponsiveContext, Image } from 'grommet';
import styled from 'styled-components';

import { isMinSize } from 'utils/responsive';
import { PATHS } from 'config';
import commonMessages from 'messages';

import ButtonCard from 'components/ButtonCard';
import H4 from 'components/styled/H4';

const ContentWrap = styled(Box)``;

const ImageWrap = styled(Box)`
  height: 140px;
  overflow: hidden;
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    height: 100px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    height: 120px;
  }
`;

const mapVerticalAlignment = align => {
  switch (align) {
    case 'start':
    case 'top':
      return 'start';
    case 'end':
    case 'bottom':
      return 'end';
    default:
      return 'center';
  }
};

const getBasis = size => {
  if (isMinSize(size, 'large')) return '1/3';
  if (isMinSize(size, 'medium')) return '1/2';
  return 'auto';
};

export function CardChild({ onCardClick, label, typology, type, ...rest }) {
  return (
    <ResponsiveContext.Consumer>
      {size => (
        <Box
          basis={getBasis(size)}
          fill={isMinSize(size, 'medium') ? false : 'horizontal'}
          responsive={false}
          align="start"
          style={{ position: 'relative' }}
          pad="small"
          {...rest}
        >
          <ButtonCard onClick={onCardClick} background="light-2">
            <Box fill align="start">
              {typology.image && (
                <ImageWrap fill>
                  <Image
                    fit="cover"
                    fill
                    src={`${PATHS.IMAGES}/${
                      typology.image.name || typology.path
                    }.jpg`}
                    alignSelf={
                      typology.image.verticalAlign
                        ? mapVerticalAlignment(typology.image.verticalAlign)
                        : 'center'
                    }
                  />
                </ImageWrap>
              )}
              <ContentWrap
                margin={{
                  top: 'xsmall',
                  bottom: 'small',
                }}
                pad={{
                  horizontal: 'small',
                }}
              >
                <H4>
                  <Text margin={{ right: 'xsmall' }}>{typology.id}</Text>
                  <Text>{label}</Text>
                </H4>
                {type === 'biomes' && (
                  <Box direction="row" gap="xsmall">
                    <Text size="medium">{typology.groupNo}</Text>
                    <Text size="medium">
                      <FormattedMessage
                        {...commonMessages[
                          typology.groupNo === 1 ? 'group' : 'groups'
                        ]}
                      />
                    </Text>
                  </Box>
                )}
              </ContentWrap>
            </Box>
          </ButtonCard>
        </Box>
      )}
    </ResponsiveContext.Consumer>
  );
}

CardChild.propTypes = {
  onCardClick: PropTypes.func,
  label: PropTypes.string,
  type: PropTypes.string,
  typology: PropTypes.object,
};

export default CardChild;
