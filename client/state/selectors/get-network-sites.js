/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import createSelector from 'lib/create-selector';
import { isMainSiteToSecondarySiteConnection } from 'state/selectors';
import { getSite } from 'state/sites/selectors';

/**
 * Returns the secondary sites of a given site
 *
 * @param  {Object}  state       Global state tree
 * @param  {Number}  siteId      The ID of the site we're retrieving the secondary sites
 * @return {?Array}            Array of secondary sites
 */
export default createSelector(
	( state, siteId ) => {
		const siteIds = Object.keys( get( state, 'sites.items', {} ) );
		return siteIds.filter( secondarySiteId => isMainSiteToSecondarySiteConnection( state, siteId, secondarySiteId ) )
			.map( secondarySiteId => getSite( state, secondarySiteId ) );
	},
	( state ) => state.sites.items
);
