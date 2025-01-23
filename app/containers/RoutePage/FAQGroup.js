/**
 *
 * FAQs
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import styled, { keyframes } from 'styled-components';
import { Button, Box, Text } from 'grommet';
import { Add, FormSubtract } from 'grommet-icons';
import MarkdownWrapper from 'containers/MarkdownWrapper';

import { DEFAULT_LOCALE } from 'i18n';

import messages from './messages';

const AccordionGroupHeader = styled(p => <Text size="small" {...p} />)`
  font-weight: bold;
  text-transform: uppercase;
`;
const PanelTitle = styled(p => <Text size="small" {...p} />)`
  font-weight: bold;
`;
const AccordionPanelHeader = styled(p => <Button {...p} />)`
  width: 100%;
  border-top: 1px solid black;
  border-bottom: ${({ open, last }) => (last && !open) ? '1px solid black' : 'none'};
  &:hover, &:focus-visible {
    background: ${({ theme }) => theme.global.colors['hover-grey']};
  }
`;
const ExpandIcon = styled(Add)`
  stroke-width: 3 !important;
`;
const CollapseIcon = styled(FormSubtract)`
  stroke-width: 3 !important;
`;
const closed = keyframes`
  0% {
    display: block;
    opacity: 1;
  }
  1% {
    display: none;
    opacity: 0;
  }
`;

const opened = keyframes`
  0% {
    display: none;
    bottom: -1rem;
    opacity: 0;
  }
  1% {
    display: block;
    bottom: -1rem;
    opacity: 0;
  }
  100% {
    bottom: -1rem;
    opacity: 1;
  }
`;
const AccordionPanel = styled(Box)`
  animation: ${({ open }) => (open ? opened : closed)} 0.5s ease forwards;
`;
const mdOptions = {
  linkTarget: '_blank',
};
export function FAQGroup({ group, intl, activePanelId, setActivePanelId }) {
  const { locale } = intl;
  const { id, title, faqs } = group;
  return (
    <Box margin={{ bottom: 'medium' }}>
      <Box pad={{ vertical: 'small', left: 'xxsmall' }}>
        <AccordionGroupHeader>
          {title[locale] || title[DEFAULT_LOCALE]}
        </AccordionGroupHeader>
      </Box>
      {faqs &&
        faqs.map((faq, index) => {
          const { question, answer } = faq;
          const panelId = `${id}-${index}`;
          const open = activePanelId === panelId;
          const a11yTitle = intl.formatMessage(
            messages[open ? 'collapseA11yTitle' : 'expandA11yTitle'],
          );
          return (
            <div key={panelId}>
              <AccordionPanelHeader
                id={`accordion-header-${panelId}`}
                onClick={() =>
                  open ? setActivePanelId(null) : setActivePanelId(panelId)
                }
                aria-expanded={open}
                aria-controls={`accordion-panel-${panelId}`}
                open={open}
                last={index === (faqs.length - 1)}
              >
                <Box
                  direction="row"
                  justify="between"
                  align="center"
                  pad={{ vertical: 'small', right: 'small', left: 'xxsmall' }}
                  title={`${a11yTitle}: ${question[locale] || question[DEFAULT_LOCALE]}`}
                >
                  <PanelTitle>
                    {question[locale] || question[DEFAULT_LOCALE]}
                  </PanelTitle>
                  {open ? (
                    <CollapseIcon
                      size="medium"
                      color="black"
                      a11yTitle={a11yTitle}
                    />
                  ) : (
                    <ExpandIcon
                      size="medium"
                      color="black"
                      a11yTitle={a11yTitle}
                    />
                  )}
                </Box>
              </AccordionPanelHeader>
              {open && (
                <AccordionPanel
                  id={`accordion-panel-${panelId}`}
                  pad={{ top: 'small', bottom: 'large', left: 'xxsmall' }}
                  open={open}
                  aria-labelledby={`accordion-header-${panelId}`}
                  role="region"
                >
                  <Text className="rle-faqs-markdown">
                    <MarkdownWrapper
                      content={answer[locale] || answer[DEFAULT_LOCALE]}
                    />
                  </Text>
                </AccordionPanel>
              )}
          </div>
          );
        })}
    </Box>
  );
}

FAQGroup.propTypes = {
  group: PropTypes.object,
  intl: PropTypes.object,
  activePanelId: PropTypes.string,
  setActivePanelId: PropTypes.func,
};

export default injectIntl(FAQGroup);
