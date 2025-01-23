/**
 *
 * FAQs
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Box } from 'grommet';
import FAQGroup from './FAQGroup';

export function FAQs({ faqGroups }) {
  const [activePanelId, setActivePanelId] = React.useState(null);
  return (
    <Box margin={{ top: 'large' }}>
      {faqGroups && faqGroups.map(group => (
        <FAQGroup
          key={group.id}
          group={group}
          activePanelId={activePanelId}
          setActivePanelId={setActivePanelId}
        />
      ))}
    </Box>
  );
}

FAQs.propTypes = {
  faqGroups: PropTypes.array,
};

export default FAQs;
