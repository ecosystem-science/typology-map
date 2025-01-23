import styled from 'styled-components';

// prettier-ignore
export default styled.h2`
  font-family: Kanit, Arial, sans-serif;
  font-weight: 500;
  font-size: ${({ theme }) => theme.text.larger.size};
  line-height: ${({ theme }) => theme.text.larger.height};
  margin: ${({ variant }) => (variant === 'aside' ? 35 : 40)}px 0 14px 0;
  position: relative;
  &::before {
    content: ' ';
    position: absolute;
    top: -${({ variant }) => (variant === 'aside' ? 15 : 20)}px;
    left: 1px;
    border-bottom: ${({ variant }) => (variant === 'aside' ? 6 : 7)}px solid black;
    width: ${({ variant }) => (variant === 'aside' ? 30 : 40)}px;
  }
  @media (min-width: ${({ theme }) => theme.sizes.medium.minpx}) {
    margin-bottom: 20px;
    font-size: ${({ theme, variant }) =>
    theme.text[variant === 'aside' ? 'xlarge' : 'xxlarge'].size};
    line-height: ${({ theme, variant }) =>
    theme.text[variant === 'aside' ? 'xlarge' : 'xxlarge'].height};
  }
`;
