import React, { PropsWithChildren } from 'react';
import { Platform } from 'react-native';
import { DeviceType, getDeviceTypeAsync } from 'expo-device';


export const ApplicationContext = React.createContext<{
    isAndroid: boolean;
    isTablet: boolean;
}>({
    isAndroid: false,
    isTablet: false,
});

export const ApplicationProvider: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
    const [state, setState] = React.useState<{ isAndroid: boolean; isTablet: boolean }>({
        isAndroid: false,
        isTablet: false,
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

    return <ApplicationContext.Provider value={{ ...state }}>{children}</ApplicationContext.Provider>;
};

export const useApplication = () => React.useContext(ApplicationContext);
