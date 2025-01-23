/**
 *
 * RouteExplore
 *
 */

import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import {
  selectRealm,
  selectBiome,
  selectGroup,
} from 'containers/App/selectors';

import ExploreRealm from 'containers/ExploreRealm/Loadable';
import ExploreBiome from 'containers/ExploreBiome/Loadable';
import ExploreGroup from 'containers/ExploreGroup/Loadable';

const Styled = styled.div`
  pointer-events: none;
  position: relative;
  z-index: 2;
`;

export function RouteExplore() {
  const { level, id } = useParams(); // Extract route params
  const typology = useSelector(state => {
    if (level === 'realms') return selectRealm(state, id);
    if (level === 'biomes') return selectBiome(state, id);
    if (level === 'groups') return selectGroup(state, id);
    return null;
  });

  return (
    <Styled>
      {level === 'realms' && typology && <ExploreRealm typology={typology} />}
      {level === 'biomes' && typology && <ExploreBiome typology={typology} />}
      {level === 'groups' && typology && <ExploreGroup typology={typology} />}
    </Styled>
  );
}

// export default RouteExplore;
export default RouteExplore;
