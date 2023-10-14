import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';
import { GradientIcon, GradientText, Text } from '@components';
import * as StoreReview from 'expo-store-review';
import { FontAwesome5 } from '@expo/vector-icons';
import { Language } from './components';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingStackParamsList } from '@navigations/SettingNavigator/SettingNavigator';

type RouteNames = 'Projects' | 'Categories' | 'PaymentMethods' | 'FullVersionApp';

type SettingStackNavigationProps = NativeStackNavigationProp<SettingStackParamsList, RouteNames>;

const { height } = Dimensions.get('screen');

interface SettingProps {
}

const Setting: React.FunctionComponent<SettingProps> = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<SettingStackNavigationProps>();
    const { width } = useWindowDimensions();
    const [state, setState] = React.useState<{ scrollEnabled: boolean; rated: boolean }>({
        scrollEnabled: true,
        rated: false,
    });

    const onContentSizeChange = React.useCallback((_: number, contentHeight: number) => {
        setState((prevState) => ({ ...prevState, scrollEnabled: contentHeight > height }));
    }, []);

    const onPressRate = React.useCallback(async () => {
        if (await StoreReview.isAvailableAsync()) {
            await StoreReview.requestReview();
        }
    }, []);

    const onNavigate = React.useCallback(
        (routeName: RouteNames) => {
            navigation.navigate(routeName);
        },
        [navigation],
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                scrollEnabled={state.scrollEnabled}
                onContentSizeChange={onContentSizeChange}
                contentContainerStyle={{
                    backgroundColor: colors.background,
                    flexGrow: 1,
                    paddingTop: 20,
                    paddingHorizontal: 20,
                }}
            >
                <Language/>
                <TouchableOpacity
                    style={{
                        backgroundColor: colors.card,
                        padding: 15,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                    }}
                    onPress={() => onNavigate('Projects')}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View
                            style={{
                                backgroundColor: '#d2640a',
                                width: 35,
                                height: 35,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 5,
                                marginRight: 10,
                            }}
                        >
                            <FontAwesome5 name="project-diagram" color="#FFFFFF" size={24}/>
                        </View>
                        <Text>{t('projects')}</Text>
                    </View>
                    <GradientIcon name="chevron-right"/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: colors.card,
                        padding: 15,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                    }}
                    onPress={() => onNavigate('Categories')}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View
                            style={{
                                backgroundColor: '#e3363a',
                                width: 35,
                                height: 35,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 5,
                                marginRight: 10,
                            }}
                        >
                            <FontAwesome5 name="cubes" color="#FFFFFF" size={24}/>
                        </View>
                        <Text>{t('categories')}</Text>
                    </View>
                    <GradientIcon name="chevron-right"/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: colors.card,
                        padding: 15,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                    }}
                    onPress={() => onNavigate('PaymentMethods')}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View
                            style={{
                                backgroundColor: '#0d6dbb',
                                width: 35,
                                height: 35,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 5,
                                marginRight: 10,
                            }}
                        >
                            <FontAwesome5 name="money-check-alt" color="#FFFFFF" size={24}/>
                        </View>
                        <Text>{t('payment_methods')}</Text>
                    </View>
                    <GradientIcon name="chevron-right"/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: colors.card,
                        padding: 15,
                        justifyContent: 'center',
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                    }}
                    onPress={() => onNavigate('FullVersionApp')}
                >
                    <GradientText style={{ marginHorizontal: 10 }}>{t('get_full_version')}</GradientText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: colors.card,
                        paddingVertical: 15,
                        justifyContent: 'center',
                        flexDirection: 'row',
                    }}
                    onPress={onPressRate}
                >
                    <GradientText style={{ marginHorizontal: 10 }}>{t('rate_app')}</GradientText>
                    <GradientIcon name="star"/>
                </TouchableOpacity>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width,
                        paddingVertical: 5,
                    }}
                >
                    <Text style={{ color: colors.text }}>{t('version')} : </Text>
                    <Text style={{ color: colors.text }}>{Constants.expoConfig?.version}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', width, paddingVertical: 5 }}>
                    <Text style={{ color: colors.text }}>
                        @{new Date().getFullYear()} &copy; {Constants.expoConfig?.name}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Setting;
