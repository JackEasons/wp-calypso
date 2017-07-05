/**
 * External dependencies
 */
import { renderWithReduxStore } from 'lib/react-helpers';
import React from 'react';
import page from 'page';

/**
 * Internal dependencies
 */
import route from 'lib/route';
import CommentsManagement from './main';
import controller from 'my-sites/controller';

export const isStatusValid = status => {
	const validStatuses = [ 'pending', 'approved', 'spam', 'trash', 'all' ];
	return validStatuses.indexOf( status ) !== -1;
};

export const getRedirect = ( status, domain ) => {
	const statusValidity = isStatusValid( status );
	if ( status === domain ) {
		return '/comments/pending/' + domain;
	}
	if ( ! statusValidity && ! domain ) {
		return '/comments';
	}
	if ( ! statusValidity && domain ) {
		return '/comments/pending/' + domain;
	}
	if ( statusValidity && ! domain ) {
		return '/comments/' + status;
	}
	return false;
};

export const comments = function( context, next ) {
	const { status } = context.params;
	const domain = route.getSiteFragment( context.path );
	const redirect = getRedirect( status, domain );

	if ( redirect ) {
		return page.redirect( redirect );
	}

	controller.navigation( context, next );

	renderWithReduxStore(
		<CommentsManagement
			basePath={ context.path }
			siteSlug={ domain }
			status={ 'pending' === status ? 'unapproved' : status }
		/>,
		'primary',
		context.store
	);
};

export const sites = function( context, next ) {
	const { status } = context.params;
	const domain = route.getSiteFragment( context.path );
	const redirect = getRedirect( status, domain );

	if ( redirect && '/comments/' + status !== redirect ) {
		return page.redirect( redirect );
	}
	controller.sites( context, next );
};
