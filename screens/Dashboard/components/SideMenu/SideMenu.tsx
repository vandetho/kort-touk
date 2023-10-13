import React from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { PRIMARY } from '@theme';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { Text } from '@components';
import { ApplicationStackParamsList } from '@navigations/ApplicationNavigator';

const CARD_SIZE = 60;
const ICON_SIZE = 26;
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        width,
        height,
        zIndex: 100,
    },
    container: {
        width: 120,
        height: height,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .9)',
    },
    iconView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: CARD_SIZE,
        height: CARD_SIZE,
        borderRadius: CARD_SIZE / 2,
    },
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 12,
        marginVertical: 5,
    },
});

type ScreenName = 'Calendar' | 'Summary' | 'Search' | 'ProjectSettingStack';

type SecureStackScreenNavigationProps = NativeStackNavigationProp<ApplicationStackParamsList, ScreenName>;

interface SideMenuProps {
    onClose: () => void;
}

const SideMenu: React.FunctionComponent<SideMenuProps> = ({ onClose }) => {
    const { height } = useWindowDimensions();
    const { colors } = useTheme();
    const navigation = useNavigation<SecureStackScreenNavigationProps>();
    const { t } = useTranslation();
    const [scrollEnabled, setScrollEnabled] = React.useState(false);

    const onPress = React.useCallback(
        (routeName: ScreenName) => {
            navigation.navigate(routeName);
            onClose();
        },
        [navigation, onClose],
    );
    const onContentSizeChange = React.useCallback(
        (_: number, h: number) => {
            setScrollEnabled(h >= height);
        },
        [height],
    );

    return (
        <ScrollView scrollEnabled={scrollEnabled} onContentSizeChange={onContentSizeChange}>
            <TouchableWithoutFeedback onPress={() => onPress('Summary')}>
                <View style={styles.itemContainer}>
                    <View style={[styles.iconView, { backgroundColor: colors.card }]}>
                        <FontAwesome5 size={ICON_SIZE} name="chart-bar" color={PRIMARY} />
                    </View>
                    <Text style={styles.title}>{t('summary')}</Text>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => onPress('Search')}>
                <View style={styles.itemContainer}>
                    <View style={[styles.iconView, { backgroundColor: colors.card }]}>
                        <FontAwesome5 size={ICON_SIZE} name="search" color={PRIMARY} />
                    </View>
                    <Text style={styles.title}>{t('search')}</Text>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => onPress('Calendar')}>
                <View style={styles.itemContainer}>
                    <View style={[styles.iconView, { backgroundColor: colors.card }]}>
                        <FontAwesome5 size={ICON_SIZE} name="calendar-alt" color={PRIMARY} />
                    </View>
                    <Text style={styles.title}>{t('calendar')}</Text>
                </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => onPress('ProjectSettingStack')}>
                <View style={styles.itemContainer}>
                    <View style={[styles.iconView, { backgroundColor: colors.card }]}>
                        <FontAwesome5 size={ICON_SIZE} name="sliders-h" color={PRIMARY} />
                    </View>
                    <Text style={styles.title}>{t('setting')}</Text>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
};

export default SideMenu;
