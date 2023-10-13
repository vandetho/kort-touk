import React from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useTheme } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { GradientIcon, Header, Text } from '@components';
import { MaterialIcons } from '@expo/vector-icons';
import { MenuItem } from '@interfaces';
import { color } from '@theme/colors';
import { ProjectSettingStackParamList } from '@navigations/ProjectSettingNavigator/ProjectSettingNavigator';

const MENU_ITEMS: MenuItem[] = [
    {
        text: 'information',
        screen: 'Information',
        icon: 'info',
        key: 'Information',
        color: color.green,
    },
    {
        text: 'categories',
        screen: 'Categories',
        icon: 'category',
        key: 'Categories',
        color: color.red,
    },
    {
        text: 'payment_methods',
        screen: 'PaymentMethods',
        icon: 'credit-card',
        key: 'PaymentMethods',
        color: color.orange,
    },
];

type ProjectSettingStackScreenNavigationProps = NativeStackNavigationProp<
    ProjectSettingStackParamList,
    keyof ProjectSettingStackParamList
>;

interface ProjectSettingProps {}

const ProjectSetting: React.FunctionComponent<ProjectSettingProps> = () => {
    const navigation = useNavigation<ProjectSettingStackScreenNavigationProps>();
    const { colors } = useTheme();
    const { t } = useTranslation();

    const onPress = React.useCallback(
        (item: MenuItem): void => {
            if (item.screen) {
                navigation.navigate(item.screen as keyof ProjectSettingStackParamList);
                return;
            }
            if (item.onPress) {
                item.onPress();
            }
        },
        [navigation],
    );

    const renderContent = React.useCallback(() => {
        return MENU_ITEMS.map((item: MenuItem) => (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                }}
                key={item.key}
                onPress={(): void => onPress(item)}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 60,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: item.color,
                            marginHorizontal: 10,
                            borderRadius: 7,
                            height: 35,
                            width: 35,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <MaterialIcons color={colors.text} name={item.icon} size={24} />
                    </View>
                    <Text>{t(item.text)}</Text>
                </View>
                <GradientIcon name="chevron-right" />
            </TouchableOpacity>
        ));
    }, [colors.border, colors.text, onPress, t]);

    return (
        <SafeAreaView>
            <View style={{ paddingHorizontal: 20 }}>
                <Header goBackTitle={t('back')} />
                <View style={{ marginVertical: 20, padding: 20, borderRadius: 15, backgroundColor: colors.card }}>
                    {renderContent()}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ProjectSetting;
