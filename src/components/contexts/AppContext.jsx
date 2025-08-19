import { DropdownProvider } from "@ctx/Dropdown";
import {ModalProvider} from "@ctx/Modal.jsx";
import {GridOverlayProvider} from "@ctx/GridOverlay.jsx";
import {MindmapCreationProvider} from "@ctx/MindmapCreation.jsx";
import {MindmapDrawingProvider} from "@ctx/MindmapDrawingContext.jsx";

/**
 * List of all the providers, order matters
 * @type {((function({children: *}): *)|*)[]}
 */
const providers = [
    MindmapDrawingProvider,
    GridOverlayProvider,
    ModalProvider,
    MindmapCreationProvider,
    DropdownProvider,
  
];


const AppProviders = ({ children }) =>
    //for some reason eslint falsely complains about provider not being used
    // eslint-disable-next-line no-unused-vars
    providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children);

export default AppProviders;
