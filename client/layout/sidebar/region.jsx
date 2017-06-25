/**
 * External dependencies
 */
import React from 'react';
import classNames from 'classnames';

/**
 * Internal Dependencies
 */
import ScrollContainer from 'components/scroll-container';

const config = require( 'config' );

const SidebarRegion = ( { children, className } ) => {
	const useCustomScrollbars = config.isEnabled( 'custom-scrollbars' );
	const region = (
		<div className={ classNames( 'sidebar__region', className, { 'sidebar__region-scrolls': ! useCustomScrollbars } ) }>
			{ children }
		</div>
	);
	if ( useCustomScrollbars ) {
		return (
			<ScrollContainer direction="vertical" autoHide={ false }>
				{ region }
			</ScrollContainer>
		);
	}
	return region;
};

export default SidebarRegion;
