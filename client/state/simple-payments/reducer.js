/**
 * Internal dependencies
 */
import productListSchema from './product-list-schema';
import { combineReducers, createReducer } from 'state/utils';
import {
	SIMPLE_PAYMENTS_PRODUCTS_LIST_RECEIVE,
	SIMPLE_PAYMENTS_PRODUCTS_LIST_REQUESTING,
	SIMPLE_PAYMENTS_PRODUCTS_LIST_SUCCESS,
	SIMPLE_PAYMENTS_PRODUCTS_LIST_FAIL,
} from 'state/action-types';

/**
 * Returns the updated requests state after an action has been dispatched. The
 * state maps site ID keys to a boolean value. Each site is true if roles
 * for it are being currently requested, and false otherwise.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export const requesting = createReducer( {}, {
	[ SIMPLE_PAYMENTS_PRODUCTS_LIST_REQUESTING ]: ( state, { siteId } ) => ( { ...state, [ siteId ]: true } ),
	[ SIMPLE_PAYMENTS_PRODUCTS_LIST_SUCCESS ]: ( state, { siteId } ) => ( { ...state, [ siteId ]: false } ),
	[ SIMPLE_PAYMENTS_PRODUCTS_LIST_FAIL ]: ( state, { siteId } ) => ( { ...state, [ siteId ]: false } )
} );

/**
 * Returns the updated items state after an action has been dispatched. The
 * state maps site ID keys to an object that contains the site roles.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export const items = createReducer( {}, {
	[ SIMPLE_PAYMENTS_PRODUCTS_LIST_RECEIVE ]: ( state, { siteId, products } ) => ( { ...state, [ siteId ]: products } )
}, productListSchema );

export default combineReducers( {
	requesting,
	items
} );
