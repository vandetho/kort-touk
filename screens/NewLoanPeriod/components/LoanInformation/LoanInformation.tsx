import React from 'react';
import { DatePicker, Header, Switch, Text, TextField } from '@components';
import { Animated, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useTheme } from '@react-navigation/native';
import { showToast } from '@utils';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { useLoans } from '@contexts';
import Project from '@models/Project';

const DURATION = 500;

interface LoanInformationProps {
    numberOfMonth: string;
    startedOn: Date;
    fixedAmount: boolean;
    onFixedAmount: (fixedAmount: boolean) => void;
    onSave: (numberOfMonth: string, startedOn: Date) => void;
}

const LoanInformation = React.memo<LoanInformationProps>(
    ({ numberOfMonth, startedOn, fixedAmount, onFixedAmount, onSave }) => {
        const { t } = useTranslation();
        const { colors } = useTheme();
        const navigation = useNavigation();
        const { loan, refreshCurrentLoan } = useLoans();
        const { height, width } = useWindowDimensions();
        const animatedValue = React.useRef(new Animated.Value(0)).current;
        const { projectRepository, transactionRepository } = useDatabaseConnection();
        const [dispatch, setDispatch] = React.useState(false);
        const [state, setState] = React.useState<{
            numberOfMonth: string;
            startedOn: Date;
            fixedAmount: boolean;
            amount: string;
        }>({
            fixedAmount,
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

        let handleSave: () => Promise<void>;
        handleSave = React.useCallback(async () => {
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
                const { nextTransaction, ...tmp } = loan;
                const project: Project = (await projectRepository.update(
                    {
                        ...tmp,
                        balances: loan.balances + finalAmount * finalNumberOfMonth * -1,
                        updatedAt: endedAt.getTime(),
                        categories: [],
                        paymentMethods: [],
                    },
                    false,
                )) as Project;
                for (let i = 0; i < Number(state.numberOfMonth); ++i) {
                    const date = new Date(startedOn);
                    date.setUTCMonth(date.getUTCMonth() + i);
                    await transactionRepository.save({
                        amount: finalAmount,
                        name: loan.name,
                        doneAt: date.getTime(),
                        category: undefined,
                        paymentMethod: undefined,
                        debit: true,
                        project: project,
                    });
                }
                refreshCurrentLoan();
                showToast(t('new_loan_period_added', { name: project.name }));
                navigation.goBack();
                setDispatch(false);
                return;
            }
            onSave(finalNumberOfMonth.toString(), state.startedOn);
        }, [
            loan,
            navigation,
            onSave,
            projectRepository,
            refreshCurrentLoan,
            startedOn,
            state.amount,
            state.fixedAmount,
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
                    containerStyle={{ marginVertical: 20 }}
                />
            );
        }, [dispatch, handleSave, state.fixedAmount, t]);

        return (
            <View style={{ height, width: width - 40 }}>
                {renderHeader()}
                <TextField
                    label={t('number_of_month')}
                    keyboardType="decimal-pad"
                    value={state.numberOfMonth}
                    name="numberOfMonth"
                    onChangeText={onChange}
                />
                <DatePicker
                    minDate={new Date(loan.updatedAt)}
                    label={t('starting_period')}
                    value={state.startedOn}
                    name="startedOn"
                    onChange={onChange}
                />
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
