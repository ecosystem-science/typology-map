/*
 * RoutePage Messages
 *
 * This contains all the text for the RoutePage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.RoutePage';

export default defineMessages({
  accordionA11yTitle: {
    id: `${scope}.accordionA11yTitle`,
    defaultMessage: 'Frequently Asked Questions: {title}',
  },
  expandA11yTitle: {
    id: `${scope}.expandA11yTitle`,
    defaultMessage: 'Expand',
  },
  collapseA11yTitle: {
    id: `${scope}.collapseA11yTitle`,
    defaultMessage: 'Collapse',
  },
});
