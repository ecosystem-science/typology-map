import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Drop, Button, ResponsiveContext, Layer } from 'grommet';
import { CircleQuestion } from 'grommet-icons';
import styled from 'styled-components';

import { isMaxSize } from 'utils/responsive';

import Content from './Content';

const StyledDrop = styled(Drop)`
  margin: 0 0 13px;
  overflow: visible;
  font-size: ${({ theme }) => theme.text.xsmall.size};
  line-height: ${({ theme }) => theme.text.xsmall.height};
  z-index: 1200;
  background: ${({ theme, color }) =>
    (color && theme.global.colors[color]) || 'white'};
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    width: 0;
    height: 0;
    border-top: 8px solid
      ${({ theme, color }) => (color && theme.global.colors[color]) || 'white'};
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    margin: 0 auto;
  }
`;

function Tooltip({
  text = 'I am a tooltip',
  iconSize = 'medium',
  component,
  maxWidth,
  icon,
  insideButton,
  margin,
  large,
  textAnchor,
  inverse,
  inAside,
  color,
}) {
  const [over, setOver] = useState(false);
  const [open, setOpen] = useState(false);
  const button = useRef(null);

  const mWidth = maxWidth || large ? '300px' : '200px';
  return (
    <ResponsiveContext.Consumer>
      {size => {
        const openModal = large && isMaxSize(size, 'small');
        // prettier-ignore
        return (
          <>
            <Button
              as={insideButton ? 'span' : 'button'}
              plain
              icon={
                textAnchor
                  ? null
                  : icon || (
                    <CircleQuestion size={iconSize} color={inverse ? 'white' : 'dark'} />
                  )
              }
              ref={button}
              onClick={evt => {
                if (evt) evt.preventDefault();
                if (evt) evt.stopPropagation();
                setOpen(!open);
              }}
              onMouseEnter={!openModal ? () => setOver(true) : null}
              onMouseLeave={!openModal ? () => setOver(false) : null}
              onFocus={!openModal ? () => setOver(true) : null}
              onBlur={!openModal ? () => setOver(false) : null}
              margin={margin || 'none' }
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'none',
              }}
            >
              {textAnchor}
            </Button>
            {(over || open) && !openModal && button.current && (
              <StyledDrop
                align={{ bottom: 'top' }}
                elevation="small"
                target={button.current}
                onClickOutside={() => setOpen(false)}
                inAside={inAside}
                color={color}
              >
                <Content
                  maxWidth={mWidth}
                  component={component}
                  text={text}
                />
              </StyledDrop>
            )}
            {open && openModal && (
              <Layer
                position="center"
                elevation="small"
                responsive={false}
                onEsc={() => setOpen(false)}
                full="horizontal"
                animate={false}
              >
                <Content
                  maxWidth="100%"
                  component={component}
                  text={text}
                  onClose={() => setOpen(false)}
                  inverse={inverse}
                  inModal
                />
              </Layer>
            )}
          </>
        );
      }}
    </ResponsiveContext.Consumer>
  );
}

Tooltip.propTypes = {
  text: PropTypes.string,
  iconSize: PropTypes.string,
  icon: PropTypes.node,
  textAnchor: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  component: PropTypes.node,
  maxWidth: PropTypes.string,
  color: PropTypes.string,
  insideButton: PropTypes.bool,
  large: PropTypes.bool,
  inverse: PropTypes.bool,
  inAside: PropTypes.bool,
  margin: PropTypes.object,
};

export default Tooltip;
