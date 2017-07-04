/**
 * Internal dependencies
 */
import { SIMPLE_PAYMENTS_PRODUCTS_LIST } from 'state/action-types';
import {
	receiveProductsList,
	requestingProductList,
	successProductListRequest,
	failProductListRequest,
} from 'state/simple-payments/product-list/actions';
import { isRequestingSimplePaymentsProductList } from 'state/selectors';
import { metaKeyToSchemaKeyMap } from 'state/simple-payments/product-list/schema';
import wpcom from 'lib/wp';
import debug from 'debug';

/**
 * Module variables
 */
const log = debug( 'calypso:middleware-simple-payments' );

/**
 * Reduce function for product attributes stored in post metadata
 * @param { Object }  sanitizedProductAttributes object with all sanitized attributes
 * @param { Object } current  item from post_meta to process
 * @returns { Object } sanitizedProductAttributes
 */
function reduceMetadata( sanitizedProductAttributes, current ) {
	if ( metaKeyToSchemaKeyMap[ current.key ] ) {
		sanitizedProductAttributes[ metaKeyToSchemaKeyMap[ current.key ] ] = current.value;
	}
	return sanitizedProductAttributes;
}

/**
 * Formats /posts endpoint response into a product list
 * @param { array } products raw /posts endpoint response to format
 * @returns { array } sanitized and formatted product list
 */
function sanitizeProducts( products ) {
	return products.map( product => Object.assign(
		{
			ID: product.ID,
			content: product.content,
			title: product.title
		},
		product.metadata.reduce( reduceMetadata, {} )
	) );
}

/**
 * Issues an API request to fetch media for a site and query.
 *
 * @param  {Object}  store  Redux store
 * @param  {Object}  action Action object
 * @return {Promise}        Promise
 */
export function requestSimplePaymentsProducts( { dispatch, getState }, { siteId } ) {
	if ( isRequestingSimplePaymentsProductList( getState(), siteId ) ) {
		return;
	}

	dispatch( requestingProductList( siteId ) );
	log( 'Request product list for site %d using query %o', siteId );

	return wpcom
		.site( siteId )
		.postsList( { type: 'jp_pay_product' } )
		.then( ( { found, posts } ) => {
			dispatch( receiveProductsList( siteId, found, sanitizeProducts( posts ) ) );
			dispatch( successProductListRequest( siteId ) );
		}	)
		.catch( err => dispatch( failProductListRequest( siteId, err ) ) );
}

export default {
	[ SIMPLE_PAYMENTS_PRODUCTS_LIST ]: [ requestSimplePaymentsProducts ],
};
