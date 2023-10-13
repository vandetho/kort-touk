import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {
    ApplicationProvider,
    CategoryProvider,
    DatabaseConnectionProvider,
    DateProvider,
    IAPProvider,
    LoanProvider,
    PaymentMethodProvider,
    PortalProvider,
    ProjectProvider,
    SearchProvider,
    SettingProvider,
    TemplateProvider,
    TransactionProvider,
} from '@contexts';
import {
    Nunito_400Regular,
    Nunito_400Regular_Italic,
    Nunito_900Black,
    Nunito_900Black_Italic,
} from '@expo-google-fonts/nunito';
import 'react-native-get-random-values';
import 'reflect-metadata';
import { View } from 'react-native';
import { AppLoadingScreen } from '@screens';
import { ApplicationNavigator } from '@navigations';
import './i18n';

export default function App() {
    const [appIsReady, setAppIsReady] = React.useState(false);

    React.useEffect(() => {
        async function prepare() {
            try {
                await SplashScreen.preventAutoHideAsync();
                await Font.loadAsync({
                    Nunito_400Regular,
                    Nunito_400Regular_Italic,
                    Nunito_900Black,
                    Nunito_900Black_Italic,
                });
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }
        (async () => await prepare())();
    }, [appIsReady]);

    const onLayoutRootView = React.useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return <AppLoadingScreen />;
    }

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <DatabaseConnectionProvider>
                <PortalProvider>
                    <IAPProvider>
                        <SearchProvider>
                            <ApplicationProvider>
                                <SettingProvider>
                                    <PaymentMethodProvider>
                                        <CategoryProvider>
                                            <TemplateProvider>
                                                <TransactionProvider>
                                                    <DateProvider>
                                                        <ProjectProvider>
                                                            <LoanProvider>
                                                                <ApplicationNavigator />
                                                            </LoanProvider>
                                                        </ProjectProvider>
                                                    </DateProvider>
                                                </TransactionProvider>
                                            </TemplateProvider>
                                        </CategoryProvider>
                                    </PaymentMethodProvider>
                                </SettingProvider>
                            </ApplicationProvider>
                        </SearchProvider>
                    </IAPProvider>
                </PortalProvider>
            </DatabaseConnectionProvider>
        </View>
    );
}
