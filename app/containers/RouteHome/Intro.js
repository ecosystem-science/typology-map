/*
 * Intro
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Paragraph, Box, Button } from 'grommet';
import { Down } from 'grommet-icons';

import { getHeaderHeight, getAsideWidth } from 'utils/responsive';

import messages from './messages';

const Styled = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  overflow: hidden;
  background: transparent;
  /* responsive height */
  right: ${getAsideWidth('small')}px;
  top: ${getHeaderHeight('small')}px;
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    top: ${getHeaderHeight('medium')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    top: ${getHeaderHeight('large')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.xlarge.minpx}) {
    top: ${getHeaderHeight('xlarge')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.xxlarge.minpx}) {
    top: ${getHeaderHeight('xxlarge')}px;
  }
`;

const IntroContentWrap = styled(props => <Box {...props} justify="evenly" />)`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`;

const IntroTitleWrap = styled(props => (
  <Box pad={{ left: 'medium', right: 'small', vertical: 'hair' }} {...props} />
))`
  position: relative;
  display: block;
`;
const IntroTitle = styled.h1`
  position: relative;
  z-index: 1;
  font-size: 24px;
  line-height: 29px;
  display: inline;
  margin: 0;
  color: white;
  @media (min-width: 500px) {
    font-size: 32px;
    line-height: 39px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    font-size: 42px;
    line-height: 50px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    font-size: 56px;
    line-height: 66px;
  }
  &::before {
    content: '';
    background: rgba(0, 24, 58, 0.7);
    position: absolute;
    display: block;
    left: -${({ theme }) => theme.global.edgeSize.small};
    right: -${({ theme }) => theme.global.edgeSize.small};
    height: 90%;
    top: 20%;
    z-index: -1;
    @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
      left: -${({ theme }) => theme.global.edgeSize.medium};
      right: -${({ theme }) => theme.global.edgeSize.medium};
      height: 40%;
      top: 70%;
    }
  }
`;
const IntroParaWrap = styled(props => (
  <Box
    pad={{ left: 'medium', right: 'small', vertical: 'xxsmall' }}
    margin={{ top: 'small', bottom: 'large' }}
    {...props}
  />
))`
  display: inline-block;
  background: rgba(0, 24, 58, 0.7);
  max-width: 80%;
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    max-width: 65%;
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    max-width: 55%;
  }
`;
const IntroPara = styled(Paragraph)`
  color: white;
  font-size: 16px;
  line-height: 21px;
  font-weight: 600;
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    font-weight: 700;
    font-size: 18px;
    line-height: 24px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    font-size: 20px;
    line-height: 28px;
  }
`;

const IntroScroll = styled(props => <Button plain {...props} />)`
  display: inline-block;
  position: absolute;
  bottom: ${({ theme }) => theme.global.edgeSize.small};
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 70px;
  height: 70px;
  border-radius: 9999px;
  vertical-align: middle;
  text-align: center;
  &:hover {
    background: rgba(198, 0, 0, 0.8);
  }
  &:focus {
    background: rgba(198, 0, 0, 0.8);
  }
`;
export function Intro({ onScroll }) {
  return (
    <Styled>
      <IntroContentWrap onClick={() => onScroll()}>
        <Box gap="xsmall">
          <IntroTitleWrap>
            <IntroTitle>
              <FormattedMessage {...messages.introTitle} />
            </IntroTitle>
          </IntroTitleWrap>
          <IntroTitleWrap>
            <IntroTitle>
              <FormattedMessage {...messages.introTitle2} />
            </IntroTitle>
          </IntroTitleWrap>
        </Box>
        <IntroParaWrap>
          <IntroPara>
            <FormattedMessage {...messages.introParagraph} />
          </IntroPara>
        </IntroParaWrap>
        <IntroScroll
          icon={<Down size="50px" color="white" />}
          onClick={() => onScroll()}
        />
      </IntroContentWrap>
    </Styled>
  );
}

Intro.propTypes = {
  onScroll: PropTypes.func,
};

export default Intro;
