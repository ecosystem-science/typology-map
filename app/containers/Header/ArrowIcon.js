import styled from 'styled-components';

const ArrowIcon = styled.span`
  color: white;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid white;
  transform: ${({ open }) => (open ? 'rotate(180deg)' : 'none')};
`;

export default ArrowIcon;
