import i18next from 'i18next';
const languageModules = import.meta.glob('@lang/*.json', { eager: false });
const languages = {};

/**
 * Loads a specific language
 * @param lng - Loads the translation file of the passed in language code
 * @returns {Promise<void>}
 */
const loadTranslations = async (lng) => {
    const langModule = languageModules[`/src/locales/${lng}.json`];

    if (!langModule) {
        console.error(`Translation file for ${lng} not found!`);
        return;
    }
    const lang = await langModule();
    languages[lng] = { common: lang }; 
};

/**
 * Init I18N
 * @param defaultLang - The default language of the application as a language code
 * @returns {Promise<void>}
 */
const initI18n = async (defaultLang) => {
    await loadTranslations(defaultLang);

    await i18next.init({
        interpolation: { escapeValue: false },
        lng: defaultLang,
        fallbackLng: 'en', 
        resources: languages, 
    });
};

/**
 * There will be a neater way to do this I'm sure, 
 * tbh might not work, will try when there's a dedicated
 * language switcher
 * @param lang - the language code, so en, fr, etc.
 */
const changeLanguage = (lang) => {
    if (!languages[lang]) {
        loadTranslations(lang).then(() => {
            i18next.changeLanguage(lang).then();
            console.log('Language changed to', lang);
        });
    } else {
        i18next.changeLanguage(lang);
    }
};

export { initI18n, changeLanguage, i18next };
