import React from 'react';
import { BarLoader } from '@components';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface AppLoadingProps {}

const AppLoadingComponent: React.FunctionComponent<AppLoadingProps> = () => {
    const { colors } = useTheme();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
            <BarLoader />
        </View>
    );
};

const AppLoading = React.memo(AppLoadingComponent);

export default AppLoading;
