import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import '@scss/_style.scss';
import App from './App.jsx';
import {initI18n} from "./components/utilities/i18n.js";
import StorageManager from "./storage_manager.js";

// Initialize i18next with the default language
initI18n('en').then(() => {
    createRoot(document.getElementById('root')).render(
        <StrictMode>
            <I18nextProvider i18n={i18next}>
                <App />
            </I18nextProvider>
        </StrictMode>
    );
});
StorageManager.ReadyCallBack(()=>{
})
