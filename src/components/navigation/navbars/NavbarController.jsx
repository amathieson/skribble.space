import React from "react";
import { useLocation } from "react-router-dom";
import NavbarHome from '@nav/navbars/NavbarHome';
import NavbarMindmap from '@nav/navbars/NavbarMindmap';

const NavBarController = (props) => {
    const location = useLocation();

    // Decide navbar type based on pathname
    let type;
    if (location.pathname.startsWith("/mindmap")) {
        type = 2;
    } else {
        type = 1;
    }

    return (
        type === 1 ? <NavbarHome {...props}/> :
            type === 2 ? <NavbarMindmap {...props}/> :
                    null
    );
};

export default NavBarController;
