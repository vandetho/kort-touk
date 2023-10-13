import React from 'react';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

type Setting = { [key: string]: any };

export const SettingContext = React.createContext<{ settings: Setting; updateSettings: (settings: Setting) => void }>({
    settings: {},
    updateSettings: (settings: Setting) => {
        console.log(settings);
    },
});

export const LanguageStorageName = '@Korttuk:language';

export const SettingProvider: React.FunctionComponent = ({ children }) => {
    const [state, setState] = React.useState<{ settings: Setting }>({
        settings: {
            language: Localization.locale,
        },
    });

    React.useEffect(() => {
        AsyncStorage.getItem(LanguageStorageName).then((language) => {
            if (language) {
                i18n.changeLanguage(language);
                setState((prevState) => ({ ...prevState, settings: { ...prevState.settings, language } }));
            }
        });
    }, []);

    const updateSettings = React.useCallback((setting: Setting) => {
        setState((prevState) => ({ ...prevState, setting }));
    }, []);

    return <SettingContext.Provider value={{ ...state, updateSettings }}>{children}</SettingContext.Provider>;
};

export const useSettings = () => {
    return React.useContext(SettingContext);
};
