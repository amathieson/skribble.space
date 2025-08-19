import React from "react";
import {matchPath, useLocation} from "react-router-dom";
import NavbarHome from '@nav/navbars/NavbarHome';
import NavbarMindmap from '@nav/navbars/NavbarMindmap';

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
