import React, { useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Text } from 'grommet';

import NavOption from './NavOption';

const NavOptionWrap = styled(Box)`
  padding-top: 10px;
  padding-bottom: 30px;
`;
const StyledText = styled(Text)`
  padding: ${({ theme }) => theme.global.edgeSize.small};
  padding-bottom: ${({ theme }) => theme.global.edgeSize.xxsmall};
`;

export function NavOptionGroup({
  label,
  options,
  onClick,
  activeResult,
  focus,
  onFocus,
}) {
  const myRefs = useRef([]);
  const onEnter = useCallback(
    event => {
      // on enter
      if (event.keyCode === 13) {
        if (options[activeResult]) onClick(options[activeResult].code);
      }
    },
    [options, activeResult],
  );

  useEffect(() => {
    document.addEventListener('keydown', onEnter, false);

    return () => {
      document.removeEventListener('keydown', onEnter, false);
    };
  }, [options, activeResult]);

  useEffect(() => {
    if (focus && myRefs && myRefs.current && myRefs.current[activeResult]) {
      myRefs.current[activeResult].focus();
    }
  }, [options, activeResult, focus]);

  return (
    <div>
      <NavOptionWrap>
        {label && (
          <StyledText color="secondary" size="xsmall">
            {label}
          </StyledText>
        )}
        {options.map((option, index) => (
          <NavOption
            key={option.code}
            onClick={() => onClick(option.code)}
            ref={el => {
              myRefs.current[index] = el;
            }}
            onFocus={() => onFocus && onFocus(index)}
            active={index === activeResult}
          >
            <Box
              direction="row"
              align="center"
              fill="horizontal"
              width="100%"
              gap="xsmall"
            >
              {option.codeHTML && (
                <Box flex={{ shrink: 0 }} width="60px">
                  <span dangerouslySetInnerHTML={{ __html: option.codeHTML }} />
                </Box>
              )}
              {!option.codeHTML && options.code && (
                <Box flex={{ shrink: 0 }} width="60px">
                  <Text>{option.code}</Text>
                </Box>
              )}
              {!option.labelHTML && option.label && (
                <Box>
                  <Text>{option.label}</Text>
                </Box>
              )}
              {option.labelHTML && (
                <Box>
                  <span
                    dangerouslySetInnerHTML={{ __html: option.labelHTML }}
                  />
                </Box>
              )}
            </Box>
          </NavOption>
        ))}
      </NavOptionWrap>
    </div>
  );
}

NavOptionGroup.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  activeResult: PropTypes.number,
  focus: PropTypes.bool,
};

export default NavOptionGroup;
