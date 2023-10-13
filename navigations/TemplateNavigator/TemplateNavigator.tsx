import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TemplateScreen, TemplatesScreen } from '@screens';

export type TemplateStackParamList = {
    Template: { edit: boolean };
    Templates: undefined;
};

const TemplateStack = createStackNavigator<TemplateStackParamList>();

interface TemplateNavigatorProps {}

const TemplateNavigator: React.FunctionComponent<TemplateNavigatorProps> = () => {
    return (
        <TemplateStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <TemplateStack.Screen name="Templates" component={TemplatesScreen} />
            <TemplateStack.Screen name="Template" component={TemplateScreen} />
        </TemplateStack.Navigator>
    );
};

export default TemplateNavigator;
