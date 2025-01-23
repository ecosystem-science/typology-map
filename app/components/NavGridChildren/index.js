/**
 *
 * NavGridChildren
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Box, Paragraph } from 'grommet';
import { DEFAULT_LOCALE } from 'i18n';

import H4 from 'components/styled/H4';
import H5 from 'components/styled/H5';
import CardChild from './CardChild';

import messages from './messages';

const Grid = styled.div`
  margin: 0 -${({ theme }) => theme.global.edgeSize.small};
`;

function NavGridChildren({ type, items, itemClick, locale, parent }) {
  return (
    <div>
      <H4>
        <FormattedMessage
          {...messages[`${type}Title`]}
          values={{
            no: items.length,
            parent: parent.title[locale] || parent.title[DEFAULT_LOCALE],
          }}
        />
      </H4>
      <Paragraph>
        <FormattedMessage {...messages[`${type}Info`]} />
      </Paragraph>
      <H5>
        <FormattedMessage {...messages[`${type}Select`]} />
      </H5>
      <Grid>
        <Box direction="row" wrap fill="horizontal" responsive={false}>
          {items &&
            items.map(i => (
              <CardChild
                key={i.id}
                onCardClick={() => itemClick(i.id)}
                type={type}
                label={i.title[locale] || i.title[DEFAULT_LOCALE]}
                typology={i}
              />
            ))}
        </Box>
      </Grid>
    </div>
  );
}

NavGridChildren.propTypes = {
  type: PropTypes.string,
  items: PropTypes.array,
  itemClick: PropTypes.func,
  locale: PropTypes.string,
  parent: PropTypes.object,
};

export default memo(NavGridChildren);
