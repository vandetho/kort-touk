import React from 'react';
import { Platform } from 'react-native';
import { DeviceType, getDeviceTypeAsync } from 'expo-device';
import Constants from 'expo-constants';
import PurchaseStorage from '@utils/PurchaseStorage';

const IS_RELEASE = Constants.manifest.extra.version === 'release';

export const ApplicationContext = React.createContext<{
    isAndroid: boolean;
    isLite: boolean;
    isTablet: boolean;
    setFullVersion: () => void;
}>({
    isAndroid: false,
    isTablet: false,
    isLite: true,
    setFullVersion: () => {},
});

export const ApplicationProvider: React.FunctionComponent = ({ children }) => {
    const [state, setState] = React.useState<{ isAndroid: boolean; isLite: boolean; isTablet: boolean }>({
        isAndroid: false,
        isTablet: false,
        isLite: IS_RELEASE,
    });

    React.useEffect(() => {
        (async () => {
            const type = await getDeviceTypeAsync();
            setState((prevState) => ({
                ...prevState,
                isAndroid: Platform.OS === 'android',
                isTablet: type === DeviceType.TABLET,
            }));
        })();
    }, []);

    React.useEffect(() => {
        (async () => {
            if (IS_RELEASE) {
                setState((prevState) => ({
                    ...prevState,
                    isLite: !PurchaseStorage.isFullVersion(),
                }));
            }
        })();
    }, []);

    const setFullVersion = React.useCallback(() => {
        if (state.isLite) {
            setState((prevState) => ({ ...prevState, isLite: !prevState.isLite }));
        }
    }, [state.isLite]);

    return <ApplicationContext.Provider value={{ ...state, setFullVersion }}>{children}</ApplicationContext.Provider>;
};

export const useApplication = () => React.useContext(ApplicationContext);
