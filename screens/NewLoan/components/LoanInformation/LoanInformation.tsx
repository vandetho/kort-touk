import React from 'react';
import { Currency, Loan } from '@interfaces';
import { CurrencyPicker, DatePicker, Header, Switch, Text, TextField } from '@components';
import { Animated, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useTheme } from '@react-navigation/native';
import { colorCodeGenerator, showToast } from '@utils';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { useLoans } from '@contexts';
import Transaction from '@models/Transaction';

const DURATION = 500;

interface LoanInformationProps {
    name: string;
    numberOfMonth: string;
    startedOn: Date;
    currency: Currency;
    fixedAmount: boolean;
    debit: boolean;
    onFixedAmount: (fixedAmount: boolean) => void;
    onSave: (name: string, numberOfMonth: string, debit: boolean, startedOn: Date, currency: Currency) => void;
}

const LoanInformation = React.memo<LoanInformationProps>(
    ({ name, numberOfMonth, startedOn, currency, fixedAmount, debit, onFixedAmount, onSave }) => {
        const { t } = useTranslation();
        const { colors } = useTheme();
        const navigation = useNavigation();
        const { addLoan, loans } = useLoans();
        const { height, width } = useWindowDimensions();
        const animatedValue = React.useRef(new Animated.Value(0)).current;
        const { projectRepository, transactionRepository } = useDatabaseConnection();
        const [dispatch, setDispatch] = React.useState(false);
        const [state, setState] = React.useState<{
            name: string;
            numberOfMonth: string;
            startedOn: Date;
            currency: Currency;
            fixedAmount: boolean;
            debit: boolean;
            amount: string;
        }>({
            name,
            currency,
            fixedAmount,
            debit,
            amount: '',
            numberOfMonth,
            startedOn,
        });

        React.useEffect(() => {
            if (state.fixedAmount) {
                Animated.timing(animatedValue, { toValue: 0, duration: DURATION, useNativeDriver: true }).start();
                return;
            }
            Animated.timing(animatedValue, { toValue: 1, duration: DURATION, useNativeDriver: true }).start();
        }, [animatedValue, state.fixedAmount]);

        const handleSave = React.useCallback(async () => {
            const name = state.name.trim();
            if (!name) {
                showToast(t('project_name_required'));
                return;
            }
            const finalNumberOfMonth = Number(state.numberOfMonth.replace(',', '.'));
            if (isNaN(finalNumberOfMonth) || finalNumberOfMonth < 0) {
                showToast(t('number_of_month_required'));
                return;
            }
            if (state.fixedAmount) {
                const finalAmount = Number(state.amount.replace(',', '.'));
                if (isNaN(finalAmount) || finalAmount < 0) {
                    showToast(t('amount_number_error'));
                    return;
                }
                setDispatch(true);
                const endedAt = new Date(state.startedOn);
                endedAt.setUTCMonth(endedAt.getUTCMonth() + finalNumberOfMonth - 1);
                const project = await projectRepository.save({
                    color: colorCodeGenerator(),
                    name,
                    currency: state.currency,
                    archived: false,
                    monthlyExpense: true,
                    trackTransaction: false,
                    sort: loans.length,
                    balances: finalAmount * finalNumberOfMonth * -1,
                    createdAt: state.startedOn.getTime(),
                    updatedAt: endedAt.getTime(),
                    categories: [],
                    paymentMethods: [],
                });
                const transactions: Transaction[] = [];
                for (let i = 0; i < Number(state.numberOfMonth); ++i) {
                    const date = new Date(state.startedOn);
                    date.setUTCMonth(date.getUTCMonth() + i);
                    transactions.push(
                        await transactionRepository.save({
                            amount: finalAmount,
                            name,
                            doneAt: date.getTime(),
                            category: undefined,
                            paymentMethod: undefined,
                            debit: state.debit,
                            project: project,
                        }),
                    );
                }
                const loan = new Loan({ ...project, nextTransaction: transactions[0], remains: project.balances });
                addLoan(loan);
                showToast(t('new_loan_added', { name: project.name }));
                navigation.goBack();
                setDispatch(false);
                return;
            }
            onSave(name, finalNumberOfMonth.toString(), state.debit, state.startedOn, state.currency);
        }, [
            addLoan,
            loans.length,
            navigation,
            onSave,
            projectRepository,
            state.amount,
            state.currency,
            state.debit,
            state.fixedAmount,
            state.name,
            state.numberOfMonth,
            state.startedOn,
            t,
            transactionRepository,
        ]);

        const onChange = React.useCallback(
            (value: any, name: string) => {
                setState((prevState) => ({ ...prevState, [name]: value }));
                if (name === 'fixedAmount') {
                    onFixedAmount(value);
                }
            },
            [onFixedAmount],
        );

        const renderHeader = React.useCallback(() => {
            let icon = 'check';
            let title = t('save');
            if (!state.fixedAmount) {
                icon = 'chevron-right';
                title = t('next');
            }
            return (
                <Header
                    goBackTitle={t('back')}
                    onRightButtonPress={handleSave}
                    disabledBack={dispatch}
                    loadingRightButton={dispatch}
                    headerRightIcon={icon}
                    headerRightTitle={title}
                />
            );
        }, [dispatch, handleSave, state.fixedAmount, t]);

        return (
            <View style={{ height, width: width - 40 }}>
                {renderHeader()}
                <TextField label={t('name')} name="name" value={state.name} onChangeText={onChange} />
                <TextField
                    label={t('number_of_month')}
                    keyboardType="decimal-pad"
                    value={state.numberOfMonth}
                    name="numberOfMonth"
                    onChangeText={onChange}
                />
                <DatePicker label={t('starting_period')} value={state.startedOn} name="startedOn" onChange={onChange} />
                <CurrencyPicker selected={state.currency} name="currency" onValueChange={onChange} />
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: 60,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                    }}
                >
                    <Text>{t('expense')}</Text>
                    <Switch value={state.debit} name="debit" onValueChange={onChange} />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: 60,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                    }}
                >
                    <Text>{t('fixed_amount')}</Text>
                    <Switch value={state.fixedAmount} name="fixedAmount" onValueChange={onChange} />
                </View>
                <Animated.View
                    style={{
                        transform: [{ scaleY: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }],
                    }}
                >
                    <TextField
                        label={t('amount')}
                        name="amount"
                        value={state.amount}
                        keyboardType="decimal-pad"
                        onChangeText={onChange}
                    />
                </Animated.View>
                <Animated.Text
                    style={{
                        fontFamily: 'Nunito_400Regular',
                        color: colors.text,
                        opacity: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                        transform: [
                            { translateY: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [25, 50] }) },
                        ],
                    }}
                >
                    {t('fixed_amount_text')}
                </Animated.Text>
                <Animated.Text
                    style={{
                        fontFamily: 'Nunito_400Regular',
                        color: colors.text,
                        opacity: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                        transform: [
                            {
                                translateY: animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-25, -125],
                                }),
                            },
                        ],
                    }}
                >
                    {t('not_fixed_amount_text')}
                </Animated.Text>
            </View>
        );
    },
);

export default LoanInformation;
