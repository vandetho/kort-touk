import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { currencyFormat } from '@utils';
import { useTranslation } from 'react-i18next';
import { useProjects } from '@contexts';
import { Text } from '@components';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
    },
    itemContainer: {
        padding: 10,
        width: width / 2 - 15,
        height: 75,
        borderRadius: 10,
    },
    titleText: {
        fontSize: 14,
        textAlign: 'right',
    },
    amountText: {
        fontSize: 16,
        textAlign: 'right',
    },
});

interface IncomeDetailProps {
    income: number;
    expense: number;
}

const IncomeDetailComponent: React.FunctionComponent<IncomeDetailProps> = ({ income, expense }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { project } = useProjects();

    return (
        <View style={styles.container}>
            <View style={[styles.itemContainer, { backgroundColor: colors.card }]}>
                <Text bold style={[styles.titleText, { color: colors.text }]}>
                    {t('income')}
                </Text>
                <Text bold style={[styles.amountText, { color: 'green' }]}>
                    {currencyFormat(income, project?.currency)}
                </Text>
            </View>
            <View style={[styles.itemContainer, { backgroundColor: colors.card }]}>
                <Text bold style={[styles.titleText, { color: colors.text }]}>
                    {t('expense')}
                </Text>
                <Text bold style={[styles.amountText, { color: 'red' }]}>
                    {currencyFormat(Math.abs(expense), project?.currency)}
                </Text>
            </View>
        </View>
    );
};

export const IncomeDetail = React.memo(IncomeDetailComponent);
