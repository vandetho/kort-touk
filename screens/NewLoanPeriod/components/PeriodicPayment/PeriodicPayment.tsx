import React from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Header, Text, TextField } from '@components';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { DISPLAY_DATE_FORMAT } from '@config';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { useNavigation } from '@react-navigation/native';
import { useLoans } from '@contexts';
import Project from '@models/Project';
import { showToast } from '@utils';

const ITEM_HEIGHT = 120;
type Item = { amount: string; month: Date };

const styles = StyleSheet.create({
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
});

interface PeriodicPaymentProps {
    numberOfMonth: string;
    startedOn: Date;
    onPressBack: () => void;
}

const PeriodicPayment = React.memo<PeriodicPaymentProps>(({ startedOn, numberOfMonth, onPressBack }) => {
    const { height, width } = useWindowDimensions();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { loan, refreshCurrentLoan } = useLoans();
    const { projectRepository, transactionRepository } = useDatabaseConnection();
    const [dispatch, setDispatch] = React.useState(false);
    const [state, setState] = React.useState<Array<Item>>([]);

    React.useEffect(() => {
        const data = [];
        for (let i = 0; i < Number(numberOfMonth); ++i) {
            const date = new Date(startedOn);
            date.setMonth(date.getMonth() + i);
            data.push({ amount: '', month: date });
        }

        setState(data);
    }, [numberOfMonth, startedOn]);

    const amountLabel = React.useMemo(() => t('amount'), [t]);
    const dateLabel = React.useMemo(() => t('date'), [t]);

    const onChangeAmount = React.useCallback(
        (value: string, index: number) => {
            const items = [...state];
            items[index].amount = value;
            setState(items);
        },
        [state],
    );

    const renderItem = React.useCallback(
        ({ item, index }: { item: Item; index: number }) => {
            return (
                <View style={{ height: ITEM_HEIGHT }}>
                    <View style={styles.dateContainer}>
                        <Text>{dateLabel}</Text>
                        <Text>{format(item.month, DISPLAY_DATE_FORMAT)}</Text>
                    </View>
                    <TextField
                        label={amountLabel}
                        value={item.amount}
                        keyboardType="decimal-pad"
                        onChangeText={(text) => onChangeAmount(text, index)}
                    />
                </View>
            );
        },
        [amountLabel, dateLabel, onChangeAmount],
    );

    const keyExtractor = React.useCallback((_, index: number) => `monthly-amount-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({ index, length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index }),
        [],
    );

    const handleSave = React.useCallback(async () => {
        setDispatch(true);
        const endedAt = new Date(startedOn);
        endedAt.setUTCMonth(endedAt.getUTCMonth() + Number(numberOfMonth));
        const project: Project = { ...loan, paymentMethods: [], categories: [], updatedAt: endedAt.getTime() };
        let balances = project.balances;
        const items = [...state];
        for (let i = 0; i < items.length; ++i) {
            const finalAmount = Number(items[i].amount);
            balances -= finalAmount;
            const date = new Date(startedOn);
            date.setMonth(date.getMonth() + i);
            await transactionRepository.save({
                name: project.name,
                amount: finalAmount,
                doneAt: items[i].month.getTime(),
                category: undefined,
                paymentMethod: undefined,
                debit: true,
                project: project,
            });
        }
        project.balances = balances;
        await projectRepository.update(project, false);
        refreshCurrentLoan();
        showToast(t('new_loan_period_added', { name: project.name }));
        navigation.goBack();
        setDispatch(false);
    }, [
        loan,
        navigation,
        numberOfMonth,
        projectRepository,
        refreshCurrentLoan,
        startedOn,
        state,
        t,
        transactionRepository,
    ]);

    return (
        <View style={{ height: height - 135, width: width - 40 }}>
            <Header
                onGoBack={onPressBack}
                goBackTitle={t('back')}
                onRightButtonPress={handleSave}
                disabledBack={dispatch}
                loadingRightButton={dispatch}
                headerRightIcon="check"
                headerRightTitle={t('save')}
            />
            <FlatList
                data={state}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                bounces={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            />
        </View>
    );
});

export default PeriodicPayment;
