/**
 * External dependencies
 */
import { renderWithReduxStore } from 'lib/react-helpers';
import React from 'react';
import page from 'page';
import { includes } from 'lodash';

/**
 * Internal dependencies
 */
import route from 'lib/route';
import CommentsManagement from './main';
import controller from 'my-sites/controller';

export const isStatusValid = status => {
	const validStatuses = [ 'pending', 'approved', 'spam', 'trash', 'all' ];
	return includes( validStatuses, status );
};

export const getRedirect = ( status, siteSlug ) => {
	const statusValidity = isStatusValid( status );
	if ( status === siteSlug ) {
		return '/comments/pending/' + siteSlug;
	}
	if ( ! statusValidity && ! siteSlug ) {
		return '/comments';
	}
	if ( ! statusValidity && siteSlug ) {
		return '/comments/pending/' + siteSlug;
	}
	if ( statusValidity && ! siteSlug ) {
		return '/comments/' + status;
	}
	return false;
};

export const comments = function( context, next ) {
	const { status } = context.params;
	const siteSlug = route.getSiteFragment( context.path );
	const redirect = getRedirect( status, siteSlug );

	if ( redirect ) {
		return page.redirect( redirect );
	}

	controller.navigation( context, next );

	renderWithReduxStore(
		<CommentsManagement
			basePath={ context.path }
			siteSlug={ siteSlug }
			status={ 'pending' === status ? 'unapproved' : status }
		/>,
		'primary',
		context.store
	);
};

export const sites = function( context, next ) {
	const { status } = context.params;
	const siteSlug = route.getSiteFragment( context.path );
	const redirect = getRedirect( status, siteSlug );

	if ( redirect && '/comments/' + status !== redirect ) {
		return page.redirect( redirect );
	}
	controller.sites( context, next );
};
