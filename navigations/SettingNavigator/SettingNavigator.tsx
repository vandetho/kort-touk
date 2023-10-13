import React from 'react';
import {
    CategoriesScreen,
    FullAppVersionScreen,
    NewCategoryScreen,
    NewPaymentMethodScreen,
    PaymentMethodsScreen,
    ProjectsScreen,
    SettingScreen,
} from '@screens';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

export type SettingStackParamsList = {
    Setting: undefined;
    Categories: undefined;
    FullVersionApp: { Setting: boolean };
    NewPaymentMethod: undefined;
    NewCategory: undefined;
    PaymentMethods: undefined;
    Projects: undefined;
};

const SettingStack = createStackNavigator<SettingStackParamsList>();

interface SettingNavigatorProps {}

const SettingNavigator = React.memo<SettingNavigatorProps>(() => {
    return (
        <SettingStack.Navigator screenOptions={{ headerShown: false }}>
            <SettingStack.Screen name="Setting" component={SettingScreen} />
            <SettingStack.Screen name="Categories" component={CategoriesScreen} />
            <SettingStack.Screen
                name="FullVersionApp"
                component={FullAppVersionScreen}
                options={{
                    presentation: 'modal',
                    cardOverlayEnabled: true,
                    gestureEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS,
                }}
                initialParams={{ Setting: true }}
            />
            <SettingStack.Screen name="NewPaymentMethod" component={NewPaymentMethodScreen} />
            <SettingStack.Screen name="NewCategory" component={NewCategoryScreen} />
            <SettingStack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
            <SettingStack.Screen name="Projects" component={ProjectsScreen} />
        </SettingStack.Navigator>
    );
});

export default SettingNavigator;
