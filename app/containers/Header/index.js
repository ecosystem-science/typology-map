import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl, FormattedMessage } from 'react-intl';
import { filter, groupBy } from 'lodash/collection';
import styled from 'styled-components';

import { Button, Box, Text, ResponsiveContext } from 'grommet';
import { Search as SearchIcon, Menu } from 'components/Icons';

import { selectRouterPath, selectLocale } from 'containers/App/selectors';
import {
  navigate,
  navigateHome,
  navigatePage,
  resetGroupsQuery,
  resetGroupsQueryNav,
} from 'containers/App/actions';
import { PRIMARY, SECONDARY } from 'containers/App/constants';
import { PAGES, ICONS, ROUTES } from 'config';

import Img from 'components/Img';
import Search from 'containers/Search';

import { getHeaderHeight, isMinSize, isMaxSize } from 'utils/responsive';

import commonMessages from 'messages';

import DropMenu from './DropMenu';
import DropMenuLocale from './DropMenuLocale';
import DropMenuMobile from './DropMenuMobile';
import NavBar from './NavBar';
import Secondary from './Secondary';

// prettier-ignore
const Brand = styled(props => <Button plain color="white" {...props} />)`
  height: ${getHeaderHeight('small')}px;
  color: ${({ theme }) => theme.global.colors.white};
  background: transparent;
  &:hover {
    background: ${({ theme }) => theme.global.colors.brand};
  }
  &:focus {
    background: ${({ theme, active }) =>
    active ? 'transparent' : theme.global.colors['brand-dark']};
  }
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    padding-right: ${({ theme }) => theme.global.edgeSize.small};
    height: ${getHeaderHeight('medium')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    height: ${getHeaderHeight('large')}px;
    min-width: ${getHeaderHeight('large')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.xlarge.minpx}) {
    height: ${getHeaderHeight('xlarge')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.xxlarge.minpx}) {
    height: ${getHeaderHeight('xxlarge')}px;
  }
`;

const BrandWrap = styled(Box)`
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    margin-right: 50px;
  }
`;

const LogoWrap = styled(p => (
  <Box justify="center" flex={{ shrink: 0 }} {...p} />
))`
  width: 40px;
  height: 100%;
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    width: 70px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    width: 80px;
  }
`;
const TitleWrap = styled(Box)`
  font-size: 11px;
  line-height: 13px;
  width: 70px;
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    width: auto;
    max-width: ${getHeaderHeight('large') + 20}px;
    min-width: ${getHeaderHeight('large')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    font-size: 16px;
    line-height: 18px;
  }
`;

const NavPrimary = styled(props => <Box direction="row" {...props} />)`
  height: ${getHeaderHeight('small')}px;
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    height: ${getHeaderHeight('medium')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    height: ${getHeaderHeight('large')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.xlarge.minpx}) {
    height: ${getHeaderHeight('xlarge')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.xxlarge.minpx}) {
    height: ${getHeaderHeight('xxlarge')}px;
  }
`;
const NavSecondary = styled(props => (
  <Box {...props} direction="row" basis="1/2" />
))``;
const NavSearch = styled(props => (
  <Box {...props} direction="row" basis="1/2" align="center" />
))``;
const NavSearchSmall = styled(p => (
  <Box
    direction="row"
    align="center"
    fill="horizontal"
    flex
    margin={{ horizontal: 'small' }}
    {...p}
  />
))`
  height: ${getHeaderHeight('small')}px;
`;

const MenuButton = styled(props => <Button plain {...props} fill="vertical" />)`
  width: 100%;
  text-align: center;
  &:hover,
  &:focus {
    background: ${({ theme }) => theme.global.colors.hover};
  }
`;
const SearchButton = styled(props => <Button plain {...props} />)`
  text-align: center;
  border-radius: 9999px;
  padding: ${({ theme }) => theme.global.edgeSize.xsmall};
  &:hover,
  &:focus {
    background: ${({ theme }) => theme.global.colors.hover};
  }
`;

// prettier-ignore
const Primary = styled(props => (
  <Button plain margin={{ horizontal: 'hair' }} {...props} />
))`
  text-align: center;
  background: ${({ theme, active }) =>
    active ? theme.global.colors.brand : 'transparent'};
  color: ${({ theme }) => theme.global.colors.white};
  padding: ${({ theme }) => theme.global.edgeSize.xsmall};
  &:hover {
    background: ${({ theme }) => theme.global.colors.brand};
  }
  &:focus {
    background: ${({ theme, active }) => theme.global.colors[active ? 'brand' : 'brand-dark']};
  }
  height: ${getHeaderHeight('small')}px;
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    font-weight: 600;
    padding: ${({ theme }) => theme.global.edgeSize.small};
    height: ${getHeaderHeight('medium')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    height: ${getHeaderHeight('large')}px;
    min-width: ${getHeaderHeight('large')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.xlarge.minpx}) {
    height: ${getHeaderHeight('xlarge')}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.xxlarge.minpx}) {
    height: ${getHeaderHeight('xxlarge')}px;
  }
`;

const IconImg = styled(Img)`
  vertical-align: middle;
  max-height: 100%;
`;

const IconImgHelper = styled.div`
  display: inline-block;
  height: 100%;
  vertical-align: middle;
`;
const IconImgWrap = styled.div`
  height: 22px;
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    height: 30px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.large.minpx}) {
    height: ${({ theme }) => theme.dimensions.header.primaryIcons}px;
  }
`;
const PrimaryLabel = styled(props => (
  <Box {...props} justify="center" fill />
))``;
const SecondaryLabel = styled(p => <Text {...p} size="medium" />)`
  color: ${({ theme }) => theme.global.colors.white};
`;

const pagesArray = Object.keys(PAGES).map(key => ({
  key,
  ...PAGES[key],
}));

function Header({ nav, navHome, onNavPage, path, intl }) {
  const [showSearch, setShowSearch] = useState(false);
  const { locale } = intl;
  const paths = path.split('/').filter(p => p !== locale && p !== '');
  let contentType = 'home';
  let contentId;
  if (paths.length > 1) {
    // we have a page
    contentType = paths[0];
    contentId = paths[1];
  } else {
    contentId = paths[0];
    contentType = contentId;
  };

  const pagesPrimary = filter(pagesArray, p => p.nav === PRIMARY);
  const pagesSecondary = filter(pagesArray, p => p.nav === SECONDARY);
  const pagesSecondaryUngrouped = filter(pagesSecondary, p => !p.group);
  const pagesSecondaryGrouped = groupBy(filter(pagesSecondary, p => !!p.group), p => p.group);

  const secondaryActive =
    contentType === 'page' && pagesSecondary && pagesSecondary.find(p => p.key === contentId);

  const secondaryActiveId = secondaryActive && (secondaryActive.group || secondaryActive.key);

  return (
    <ResponsiveContext.Consumer>
      {size => (
        <>
          <NavBar
            justify={isMinSize(size, 'large') ? 'start' : 'between'}
            alignContent="end"
            fill
          >
            {(isMinSize(size, 'large') || !showSearch) && (
              <BrandWrap>
                <Brand
                  onClick={() => {
                    navHome();
                  }}
                  active={contentType === 'home'}
                  label={
                    <Box direction="row" fill="vertical" align="center">
                      <LogoWrap>
                        <IconImg src={ICONS.LOGO} alt="" />
                      </LogoWrap>
                      <TitleWrap>
                        <FormattedMessage {...commonMessages.appTitle} />
                      </TitleWrap>
                    </Box>
                  }
                />
              </BrandWrap>
            )}
            {(isMinSize(size, 'large') || !showSearch) && (
              <NavPrimary>
                <Primary
                  onClick={() => nav(ROUTES.EXPLORE)}
                  label={
                    <PrimaryLabel
                      gap={isMinSize(size, 'large') ? 'xsmall' : 'hair'}
                    >
                      <IconImgWrap>
                        <IconImgHelper />
                        <IconImg src={ICONS.EXPLORE} alt="" />
                      </IconImgWrap>
                      <Text
                        size={isMinSize(size, 'medium') ? 'medium' : 'xxxsmall'}
                      >
                        <FormattedMessage {...commonMessages.navExplore} />
                      </Text>
                    </PrimaryLabel>
                  }
                  active={contentType === ROUTES.EXPLORE}
                />
                <Primary
                  onClick={() => nav(ROUTES.ANALYSE)}
                  label={
                    <PrimaryLabel
                      gap={isMinSize(size, 'large') ? 'xsmall' : 'hair'}
                    >
                      <IconImgWrap>
                        <IconImgHelper />
                        <IconImg src={ICONS.ANALYSIS} alt="" />
                      </IconImgWrap>
                      <Text
                        size={isMinSize(size, 'medium') ? 'medium' : 'xxxsmall'}
                      >
                        <FormattedMessage {...commonMessages.navAnalyse} />
                      </Text>
                    </PrimaryLabel>
                  }
                  active={contentType === ROUTES.ANALYSE}
                />
                {isMinSize(size, 'medium') && pagesPrimary.map(p => (
                  <Primary
                    key={p.key}
                    onClick={() => onNavPage(p.key)}
                    label={
                      <PrimaryLabel
                        gap={isMinSize(size, 'large') ? 'xsmall' : 'hair'}
                      >
                        <IconImgWrap>
                          <IconImgHelper />
                          <IconImg src={p.icon} alt="" />
                        </IconImgWrap>
                        <Text
                          size={
                            isMinSize(size, 'medium') ? 'medium' : 'xxsmall'
                          }
                        >
                          {commonMessages[`page_${p.key}`] && (
                            <FormattedMessage
                              {...commonMessages[`page_${p.key}`]}
                            />
                          )}
                        </Text>
                      </PrimaryLabel>
                    }
                    active={contentType === 'page' && contentId === p.key}
                  />
                ))}
              </NavPrimary>
            )}
            {isMinSize(size, 'large') && (
              <Box
                fill="vertical"
                margin={{ left: 'auto' }}
                flex={{ shrink: 0 }}
              >
                <NavSecondary justify="end">
                  {pagesSecondaryGrouped && (
                    <Box direction="row">
                      {Object.entries(pagesSecondaryGrouped).map(([group, pages]) => (
                        <DropMenu
                          key={group}
                          active={secondaryActiveId === group}
                          dropPages={pages}
                          label={intl.formatMessage(commonMessages[`navGroup_${group}`])}
                          onNavPage={onNavPage}
                          activePageId={contentId}
                        />
                      ))}
                    </Box>
                  )}
                  {pagesSecondaryUngrouped && (
                    <Box direction="row">
                      {pagesSecondaryUngrouped.map(p => (
                        <Secondary
                          key={p.key}
                          onClick={() => onNavPage(p.key)}
                          label={
                            <SecondaryLabel>
                              <FormattedMessage
                                {...commonMessages[`page_${p.key}`]}
                              />
                            </SecondaryLabel>
                          }
                          active={secondaryActiveId === p.key}
                        />
                      ))}
                    </Box>
                  )}
                  <DropMenuLocale locale={locale} />
                </NavSecondary>
                <NavSearch justify="end" pad={{ horizontal: 'small' }}>
                  {!showSearch && (
                    <SearchButton
                      icon={<SearchIcon color="white" />}
                      onClick={() => setShowSearch(true)}
                    />
                  )}
                  {showSearch && (
                    <Search onClose={() => setShowSearch(false)} />
                  )}
                </NavSearch>
              </Box>
            )}
            {isMaxSize(size, 'medium') && (
              <Box
                direction="row"
                justify="center"
                fill={showSearch ? true : 'vertical'}
                flex={{ grow: 0 }}
              >
                {showSearch && (
                  <NavSearchSmall>
                    <Search onClose={() => setShowSearch(false)} stretch />
                  </NavSearchSmall>
                )}
                {!showSearch && (
                  <Box
                    flex={false}
                    style={{
                      width: isMaxSize(size, 'small') ? '40px' : '50px',
                    }}
                  >
                    <MenuButton
                      onClick={() => setShowSearch(!showSearch)}
                      label={<SearchIcon color="white" size="medium" />}
                    />
                  </Box>
                )}
                {!showSearch && <DropMenuLocale locale={locale} />}
                {!showSearch && (
                  <DropMenuMobile
                    onNavPage={onNavPage}
                    navGroups={groupBy(
                      pagesArray,
                      option => option.mobileGroup,
                    )}
                  />
                )}
              </Box>
            )}
          </NavBar>
        </>
      )}
    </ResponsiveContext.Consumer>
  );
}

Header.propTypes = {
  nav: PropTypes.func,
  navHome: PropTypes.func,
  onNavPage: PropTypes.func,
  path: PropTypes.string,
  locale: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  path: state => selectRouterPath(state),
  locale: state => selectLocale(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    nav: path => {
      dispatch(resetGroupsQuery());
      dispatch(resetGroupsQueryNav());
      dispatch(navigate(path));
    },
    navHome: () => {
      dispatch(resetGroupsQuery());
      dispatch(resetGroupsQueryNav());
      dispatch(navigateHome());
    },
    onNavPage: id => dispatch(navigatePage(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Header));
