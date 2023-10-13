import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import {
    ProjectCategoriesScreen,
    ProjectInformationScreen,
    ProjectPaymentMethodsScreen,
    ProjectSettingScreen,
} from '@screens';

export type ProjectSettingStackParamList = {
    Setting: undefined;
    Information: undefined;
    Categories: undefined;
    PaymentMethods: undefined;
};

const ProjectSettingStack = createStackNavigator<ProjectSettingStackParamList>();

interface ProjectSettingNavigatorProps {}

const ProjectSettingNavigator: React.FunctionComponent<ProjectSettingNavigatorProps> = () => {
    const { t } = useTranslation();

    return (
        <ProjectSettingStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <ProjectSettingStack.Screen
                name="Setting"
                component={ProjectSettingScreen}
                options={{
                    headerTitle: t('project_setting'),
                }}
            />
            <ProjectSettingStack.Screen
                name="Information"
                component={ProjectInformationScreen}
                options={{
                    headerTitle: t('project_information'),
                }}
            />
            <ProjectSettingStack.Screen
                name="Categories"
                component={ProjectCategoriesScreen}
                options={{
                    headerTitle: t('categories'),
                }}
            />
            <ProjectSettingStack.Screen
                name="PaymentMethods"
                component={ProjectPaymentMethodsScreen}
                options={{
                    headerTitle: t('payment_methods'),
                }}
            />
        </ProjectSettingStack.Navigator>
    );
};

export default ProjectSettingNavigator;
