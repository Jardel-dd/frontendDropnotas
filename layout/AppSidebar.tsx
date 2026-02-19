import React from 'react';
import AppMenu from './AppMenu';
import { MenuProvider } from './context/menucontext';

const AppSidebar = () => {
    return (
        <React.Fragment>
            <div className="layout-menu-container">
                <MenuProvider>
                    <AppMenu />
                </MenuProvider>
            </div>
        </React.Fragment>
    );
};

AppSidebar.displayName = 'AppSidebar';

export default AppSidebar;
