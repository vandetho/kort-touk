import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Header, Text } from '@components';
import { color } from '@theme/colors';
import { currencyFormat } from '@utils';
import { format } from 'date-fns';
import { DISPLAY_DATE_FORMAT } from '@config';
import Project from '@models/Project';
import { useTheme } from '@react-navigation/native';
import { useSearch } from '@contexts';
import { useTranslation } from 'react-i18next';

export const HEADER_HEIGHT = 350;

const styles = StyleSheet.create({
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        bottom: 15,
        left: 20,
        right: 20,
        position: 'absolute',
    },
    balanceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        bottom: 40,
        left: 20,
        right: 20,
        position: 'absolute',
    },
    updatedAtText: {
        fontSize: 12,
    },
    dateText: {
        fontSize: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 10,
    },
    titleText: {
        fontSize: 14,
        textAlign: 'right',
        marginRight: 20,
    },
    amountText: {
        fontSize: 16,
        textAlign: 'right',
    },
});
interface TopHeaderProps {
    animatedValue: Animated.Value;
    project: Project | undefined;
    income: number;
    expense: number;
    onShowMenu: () => void;
    onShowModal: () => void;
}

const TopHeader = React.memo<TopHeaderProps>(({ animatedValue, expense, income, project, onShowMenu, onShowModal }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { from, to } = useSearch();
    const textColor = colors.text;

    if (project) {
        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    zIndex: 1,
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: colors.card,
                    opacity: animatedValue.interpolate({
                        inputRange: [0, 75],
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                    }),
                    height: HEADER_HEIGHT,
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange: [0, 75],
                                outputRange: [0, -HEADER_HEIGHT + 200],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                <Animated.View
                    style={{
                        transform: [
                            {
                                translateY: animatedValue.interpolate({
                                    inputRange: [0, 75],
                                    outputRange: [10, 160],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    <Header
                        onGoBack={onShowMenu}
                        goBackIcon="bars"
                        goBackTitle={t('menu')}
                        headerRightIcon="plus"
                        headerRightTitle={t('new_transaction')}
                        onRightButtonPress={onShowModal}
                    />
                </Animated.View>
                <Animated.Text
                    style={{
                        color: colors.text,
                        fontSize: 20,
                        paddingHorizontal: 10,
                        transform: [
                            {
                                translateY: animatedValue.interpolate({
                                    inputRange: [0, 75],
                                    outputRange: [50, 175],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    {project.name}
                </Animated.Text>
                <Animated.Text
                    style={{
                        color: project.balances < 0 ? color.red : color.green,
                        fontSize: 35,
                        fontFamily: 'Nunito_900Black',
                        textAlign: 'right',
                        paddingHorizontal: 10,
                        transform: [
                            {
                                translateY: animatedValue.interpolate({
                                    inputRange: [0, 75],
                                    outputRange: [75, 125],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    {currencyFormat(project.balances, project.currency)}
                </Animated.Text>
                <View style={styles.balanceContainer}>
                    <View style={styles.itemContainer}>
                        <Text bold style={[styles.titleText, { color: colors.text }]}>
                            {t('income')}
                        </Text>
                        <Text bold style={[styles.amountText, { color: 'green' }]}>
                            {currencyFormat(income, project?.currency)}
                        </Text>
                    </View>
                    <View style={styles.itemContainer}>
                        <Text bold style={[styles.titleText, { color: colors.text }]}>
                            {t('expense')}
                        </Text>
                        <Text bold style={[styles.amountText, { color: 'red' }]}>
                            {currencyFormat(Math.abs(expense), project?.currency)}
                        </Text>
                    </View>
                </View>
                <View style={styles.dateContainer}>
                    <Text style={[styles.updatedAtText, { color: textColor }]}>
                        {format(project.updatedAt, DISPLAY_DATE_FORMAT)}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={[styles.updatedAtText, { color: textColor }]}>
                            {format(new Date(from), DISPLAY_DATE_FORMAT)}
                        </Text>
                        <Text style={[styles.updatedAtText, { color: textColor }]}> - </Text>
                        <Text style={[styles.updatedAtText, { color: textColor }]}>
                            {format(new Date(to), DISPLAY_DATE_FORMAT)}
                        </Text>
                    </View>
                </View>
            </Animated.View>
        );
    }
    return null;
});

export default TopHeader;
