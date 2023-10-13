import React from 'react';
import { createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { DarkTheme, LightTheme } from '@theme';
import {
    CalendarScreen,
    NewProjectScreen,
    NewTransactionScreen,
    SearchScreen,
    SummaryScreen,
    TransactionScreen,
} from '@screens';
import { ProjectSettingNavigator, ProjectSettingStackParamList } from '@navigations/ProjectSettingNavigator';
import { BottomTabNavigator, BottomTabStackParamsList } from '@navigations/BottomTabNavigator';

export type ApplicationStackParamsList = {
    BottomStack: NavigatorScreenParams<BottomTabStackParamsList>;
    Calendar: undefined;
    NewProject: undefined;
    NewTransaction: undefined;
    ProjectSettingStack: NavigatorScreenParams<ProjectSettingStackParamList>;
    Search: undefined;
    Summary: undefined;
    Transaction: { edit: boolean };
};

const ApplicationStack = createStackNavigator<ApplicationStackParamsList>();

interface ApplicationNavigatorProps {}

const ApplicationNavigator = React.memo<ApplicationNavigatorProps>(() => {
    const schema = useColorScheme();

    const renderNavigator = React.useCallback(() => {
        return (
            <ApplicationStack.Navigator screenOptions={{ headerShown: false }}>
                <ApplicationStack.Screen name="BottomStack" component={BottomTabNavigator} />
                <ApplicationStack.Screen name="NewProject" component={NewProjectScreen} />
                <ApplicationStack.Screen
                    name="NewTransaction"
                    component={NewTransactionScreen}
                    options={{
                        cardOverlayEnabled: true,
                        gestureEnabled: true,
                        presentation: 'modal',
                        ...TransitionSpecs.TransitionIOSSpec,
                    }}
                />
                <ApplicationStack.Screen
                    name="Calendar"
                    component={CalendarScreen}
                    options={{
                        cardOverlayEnabled: true,
                        gestureEnabled: true,
                        presentation: 'modal',
                        ...TransitionSpecs.TransitionIOSSpec,
                    }}
                />
                <ApplicationStack.Screen
                    name="Summary"
                    component={SummaryScreen}
                    options={{
                        cardOverlayEnabled: true,
                        gestureEnabled: true,
                        presentation: 'modal',
                        ...TransitionSpecs.TransitionIOSSpec,
                    }}
                />
                <ApplicationStack.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{
                        cardOverlayEnabled: true,
                        gestureEnabled: true,
                        presentation: 'modal',
                        ...TransitionSpecs.TransitionIOSSpec,
                    }}
                />
                <ApplicationStack.Screen name="Transaction" component={TransactionScreen} />
                <ApplicationStack.Screen
                    name="ProjectSettingStack"
                    component={ProjectSettingNavigator}
                    options={{
                        headerShown: false,
                    }}
                />
            </ApplicationStack.Navigator>
        );
    }, []);

    return (
        <NavigationContainer theme={schema === 'dark' ? DarkTheme : LightTheme}>
            {renderNavigator()}
        </NavigationContainer>
    );
});

export default ApplicationNavigator;
