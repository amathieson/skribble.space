import { DropdownProvider } from "@ctx/Dropdown";
import {ModalProvider} from "@ctx/Modal.jsx";
import {GridOverlayProvider} from "@ctx/GridOverlay.jsx";

/**
 * List of all the providers, order matters
 * @type {((function({children: *}): *)|*)[]}
 */
const providers = [
    DropdownProvider,
    GridOverlayProvider,
    ModalProvider,
];

const AppProviders = ({ children }) =>
    providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children);

export default AppProviders;
