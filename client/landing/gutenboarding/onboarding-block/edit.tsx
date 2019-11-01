/**
 * External dependencies
 */
import { __ as NO__ } from '@wordpress/i18n';
import { TextControl, SelectControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';

import React from 'react';

/**
 * Internal dependencies
 */
import { SiteType } from '../store/types';
import { STORE_KEY } from '../store';

export default function OnboardingEdit() {
	const { siteTitle, siteType } = useSelect( select => select( STORE_KEY ).getState() );
	const { setSiteType, setSiteTitle } = useDispatch( STORE_KEY );

	return (
		<>
			<p>{ NO__( "Let's set up your website -- it takes only a moment" ) }</p>
			{ NO__( 'I want to create a website ' ) }
			<SelectControl< SiteType >
				onChange={ setSiteType }
				options={ [
					{ label: NO__( 'with a blog.' ), value: SiteType.BLOG },
					{ label: NO__( 'for a store.' ), value: SiteType.STORE },
					{ label: NO__( 'to write a story.' ), value: SiteType.STORY },
				] }
				value={ siteType }
			/>
			{ ( siteType || siteTitle ) && (
				<>
					<p>{ NO__( "It's called" ) }</p>
					<TextControl onChange={ setSiteTitle } value={ siteTitle } />
				</>
			) }
		</>
	);
}
