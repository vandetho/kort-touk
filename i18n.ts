import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/common.json';
import kh from './locales/kh/common.json';
import fr from './locales/fr/common.json';
import * as Localization from 'expo-localization';

const resources = {
    'en-US': {
        common: en,
    },
    kh: {
        common: kh,
    },
    fr: {
        common: fr,
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: Localization.locale,
    fallbackLng: 'en-US',
    supportedLngs: ['en-US', 'kh', 'fr'],
    interpolation: {
        escapeValue: false,
    },
    cleanCode: true,
    ns: ['common'],
    defaultNS: 'common',
    compatibilityJSON: 'v3',
});

export default i18n;
