/*
 * RouteExplore Messages
 *
 * This contains all the text for the RouteExplore container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.RouteAnalyse';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Functional Groups by Area',
  },
  defineArea: {
    id: `${scope}.defineArea`,
    defaultMessage: '1. Define area (required)',
  },
  area: {
    id: `${scope}.area`,
    defaultMessage: 'Area',
  },
  areaChange: {
    id: `${scope}.areaChange`,
    defaultMessage: 'Change area',
  },
  defineAreaInstructions: {
    id: `${scope}.defineAreaInstructions`,
    defaultMessage: 'Draw an area on the map or enter area coordinates',
  },
  defineAreaFieldLabel: {
    id: `${scope}.defineAreaFieldLabel`,
    defaultMessage: 'Area coordinates',
  },
  defineAreaFieldPlaceholder: {
    id: `${scope}.defineAreaFieldPlaceholder`,
    defaultMessage: 'Format: lon lat, lon2 lat2, lon3 lat3, ...',
  },
  defineAreaFieldFormatHelp: {
    id: `${scope}.defineAreaFieldFormatHelp`,
    defaultMessage:
      "A comma-separated list of points, each consisting of two space-separated values in decimal degrees where the first value represents the point's latitude and the second value its longitude (format: 'lon lat, lon2 lat2, lon3 lat3, [...]'). Where the last point does not equal the first point, the application will automatically add it to 'close' the resulting shape. Alternatively, you can also define the area using the WKT format ('Well-Known Text') for polygons ('POLYGON ((lon lat, [...]))').",
  },
  addFilters: {
    id: `${scope}.addFilters`,
    defaultMessage: '2. Add filters (optional)',
  },
  filters: {
    id: `${scope}.filters`,
    defaultMessage: 'Filters',
  },
  filtersChange: {
    id: `${scope}.filtersChange`,
    defaultMessage: 'Change filters',
  },
  filtersAdd: {
    id: `${scope}.filtersAdd`,
    defaultMessage: 'Add filters',
  },
  addFiltersByRealmLabel: {
    id: `${scope}.addFiltersByRealmLabel`,
    defaultMessage: 'Filter by Realm',
  },
  addFiltersByRealmPlaceholder: {
    id: `${scope}.addFiltersByRealmPlaceholder`,
    defaultMessage: 'Select Realm',
  },
  addFiltersByBiomeLabel: {
    id: `${scope}.addFiltersByBiomeLabel`,
    defaultMessage: 'Filter by Biome',
  },
  addFiltersByBiomePlaceholder: {
    id: `${scope}.addFiltersByBiomePlaceholder`,
    defaultMessage: 'Select Biome',
  },
  addFiltersByOccurrenceLabel: {
    id: `${scope}.addFiltersByOccurrenceLabel`,
    defaultMessage: 'Filter by Occurrence',
  },
  submitQuery: {
    id: `${scope}.submitQuery`,
    defaultMessage: '3. Retrieve Functional Groups',
  },
  submitQueryAreaHint: {
    id: `${scope}.submitQueryAreaHint`,
    defaultMessage: 'Query requires defining an area',
  },
  submitQueryLabel: {
    id: `${scope}.submitQueryLabel`,
    defaultMessage: 'Submit query',
  },
  resetQueryLabel: {
    id: `${scope}.resetQueryLabel`,
    defaultMessage: 'Reset query',
  },
  updateQueryLabel: {
    id: `${scope}.updateQueryLabel`,
    defaultMessage: 'Update query',
  },
});
