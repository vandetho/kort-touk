import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { currencyFormat, normalizeHeight, normalizeWidth } from '@utils';
import { ChartConfig } from 'react-native-chart-kit/dist/HelperTypes';
import { EmptyCard, Header, Text } from '@components';
import { useTranslation } from 'react-i18next';
import { useProjects, useSearch } from '@contexts';
import { useSummaryFetcher } from '@fetchers';
import { Summary as ISummary } from '@interfaces';
import { PieChart } from 'react-native-chart-kit';
import { format } from 'date-fns';
import { DISPLAY_DATE_FORMAT } from '@config';

const CHART_WIDTH = Dimensions.get('window').width;
const CHART_HEIGHT = normalizeHeight(186.57);

const styles = StyleSheet.create({
    chartContainer: {
        width: CHART_WIDTH,
        alignSelf: 'center',
        paddingVertical: normalizeHeight(14.93),
        paddingHorizontal: 20,
    },
    container: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    emptyCard: {
        width: '100%',
        height: CHART_HEIGHT,
        marginVertical: normalizeHeight(3.73),
    },
    balanceView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: normalizeHeight(3.73),
    },
    margin: {
        marginVertical: normalizeHeight(3.73),
        marginLeft: normalizeWidth(9.09),
    },
});

const chartConfig: ChartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    barPercentage: 0.5,
    color: (opacity = 1): string => `rgba(26, 255, 146, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
};

interface SummaryProps {}

const Summary: React.FunctionComponent<SummaryProps> = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { project } = useProjects();
    const { height } = useWindowDimensions();
    const { from, to } = useSearch();
    const { summaries, fetch } = useSummaryFetcher();
    const [scrollEnabled, setScrollEnabled] = React.useState(false);

    React.useEffect(() => {
        (async () => fetch(project?.id))();
    }, [fetch, project?.id]);

    const [expenses, incomes, totalExpense, totalIncome, balance] = React.useMemo((): [
        ISummary[],
        ISummary[],
        number,
        number,
        number,
    ] => {
        const expenses = [];
        const incomes = [];
        let totalExpense = 0;
        let totalIncome = 0;
        summaries.forEach((summary) => {
            if (summary.debit) {
                summary.amount = Number(summary.amount);
                totalExpense += summary.amount;
                summary.legendFontColor = colors.text;
                expenses.push(summary);
            } else {
                summary.amount = Number(summary.amount);
                totalIncome += summary.amount;
                summary.legendFontColor = colors.text;
                incomes.push(summary);
            }
        });
        const balance = totalExpense + totalIncome;
        return [expenses, incomes, totalExpense, totalIncome, balance];
    }, [summaries, colors]);

    const balanceContent = React.useMemo((): JSX.Element => {
        return (
            <View
                style={[
                    styles.chartContainer,
                    { backgroundColor: colors.card, paddingHorizontal: normalizeWidth(45.46) },
                ]}
            >
                <View style={styles.balanceView}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{t('incomes')}</Text>
                    <Text style={{ color: 'green', fontSize: 14, fontWeight: 'bold' }}>
                        {currencyFormat(totalIncome, project.currency)}
                    </Text>
                </View>
                <View style={styles.balanceView}>
                    <Text style={{ color: colors.text, fontSize: 14, fontWeight: 'bold' }}>{t('expenses')}</Text>
                    <Text style={{ color: 'red', fontSize: 14, fontWeight: 'bold' }}>
                        {currencyFormat(totalExpense, project.currency)}
                    </Text>
                </View>
                <View style={{ borderColor: colors.text, borderWidth: 0.5 }} />
                <View style={styles.balanceView}>
                    <Text style={{ color: colors.text, fontSize: 14, fontWeight: 'bold' }}>{t('balance')}</Text>
                    <Text style={{ color: balance >= 0 ? 'green' : 'red', fontSize: 14, fontWeight: 'bold' }}>
                        {currencyFormat(balance, project.currency)}
                    </Text>
                </View>
            </View>
        );
    }, [colors.card, colors.text, t, totalIncome, project.currency, totalExpense, balance]);

    const expenseContent = React.useMemo((): JSX.Element => {
        return !expenses.length ? (
            <EmptyCard text={t('no_expense_summary_found')} />
        ) : (
            <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
                <PieChart
                    data={expenses}
                    width={CHART_WIDTH}
                    height={CHART_HEIGHT}
                    paddingLeft="15"
                    accessor="amount"
                    backgroundColor="transparent"
                    chartConfig={{ ...chartConfig, propsForLabels: { fill: 'none', stroke: 'red' } }}
                />
            </View>
        );
    }, [expenses, t, colors.card]);

    const incomeContent = React.useMemo((): JSX.Element => {
        return !incomes.length ? (
            <EmptyCard text={t('no_income_summary_found')} />
        ) : (
            <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
                <PieChart
                    data={incomes}
                    width={CHART_WIDTH}
                    height={CHART_HEIGHT}
                    paddingLeft="15"
                    accessor="amount"
                    backgroundColor="transparent"
                    hasLegend
                    chartConfig={chartConfig}
                />
            </View>
        );
    }, [incomes, t, colors.card]);

    const onContentSizeChange = React.useCallback(
        (_, h: number) => {
            setScrollEnabled(h > height);
        },
        [height],
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <Header goBackTitle={t('close')} goBackIcon="times" />
            </View>
            <ScrollView
                scrollEnabled={scrollEnabled}
                onContentSizeChange={onContentSizeChange}
                contentContainerStyle={styles.container}
            >
                <View style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: colors.text, fontWeight: 'bold' }}>{format(from, DISPLAY_DATE_FORMAT)}</Text>
                    <Text style={{ color: colors.text, fontWeight: 'bold' }}> - </Text>
                    <Text style={{ color: colors.text, fontWeight: 'bold' }}>{format(to, DISPLAY_DATE_FORMAT)}</Text>
                </View>
                <View style={styles.margin}>
                    <Text style={{ color: colors.text, fontWeight: 'bold' }}>{t('cash_balance')}</Text>
                </View>
                {balanceContent}
                <View style={styles.margin}>
                    <Text style={{ color: colors.text, fontWeight: 'bold' }}>{t('expense_summary')}</Text>
                </View>
                {expenseContent}
                <View style={styles.margin}>
                    <Text style={{ color: colors.text, fontWeight: 'bold' }}>{t('income_summary')}</Text>
                </View>
                {incomeContent}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Summary;
