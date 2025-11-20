import React from "react";
import {matchPath, useLocation} from "react-router-dom";
import NavbarHome from '@nav/navbars/NavbarHome';
import NavbarMindmap from '@nav/navbars/NavbarMindmap';

/**
 * This is the controller for the navbar.
 * Depending on the current location, it will render the correct navbar.
 * @returns {Element}
 * @constructor
 */
const NavBarController = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const isMindmap = matchPath({ path: "/mindmap/:id" }, pathname) || pathname === "/mindmap";
    
    if (isMindmap) {
        return <NavbarMindmap />;
    }
    
    return <NavbarHome />;
};

export default NavBarController;
