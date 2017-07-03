/**
 * Internal dependencies
 */
import {
	SIMPLE_PAYMENTS_PRODUCTS_LIST,
	SIMPLE_PAYMENTS_PRODUCTS_LIST_RECEIVE,
	SIMPLE_PAYMENTS_PRODUCTS_LIST_REQUESTING,
	SIMPLE_PAYMENTS_PRODUCTS_LIST_SUCCESS,
	SIMPLE_PAYMENTS_PRODUCTS_LIST_FAIL,
} from 'state/action-types';
import { isRequestingSimplePaymentsProductList } from 'state/selectors';
import { metaKeyToSchemaKeyMap } from 'state/simple-payments/product-list-schema';
import wpcom from 'lib/wp';
import debug from 'debug';

/**
 * Module variables
 */
const log = debug( 'calypso:middleware-simple-payments' );

function receiveProductsList( siteId, found, posts ) {
	return {
		type: SIMPLE_PAYMENTS_PRODUCTS_LIST_RECEIVE,
		siteId,
		products: posts,
	};
}

function requestingProductList( siteId ) {
	return {
		type: SIMPLE_PAYMENTS_PRODUCTS_LIST_REQUESTING,
		siteId
	};
}

function successProductListRequest( siteId ) {
	return {
		siteId,
		type: SIMPLE_PAYMENTS_PRODUCTS_LIST_SUCCESS
	};
}

function failProductListRequest( siteId, err ) {
	return {
		siteId,
		type: SIMPLE_PAYMENTS_PRODUCTS_LIST_FAIL,
		err
	};
}

function reduceMetadata( previous, current ) {
	if ( metaKeyToSchemaKeyMap[ current.key ] ) {
		previous[ metaKeyToSchemaKeyMap[ current.key ] ] = current.value;
	}
	return previous;
}

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
