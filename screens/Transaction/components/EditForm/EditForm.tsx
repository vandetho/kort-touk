import React from 'react';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import {
    Alert,
    Keyboard,
    StyleSheet,
    TextInput,
    TextStyle,
    TouchableWithoutFeedback,
    useWindowDimensions,
    View,
} from 'react-native';
import { CategoryPicker, DatePicker, Header, PaymentMethodPicker, Switch, Text, TextField } from '@components';
import { MaterialIcons } from '@expo/vector-icons';
import { useProjects } from '@contexts';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Transaction from '@models/Transaction';
import Category from '@models/Category';
import PaymentMethod from '@models/PaymentMethod';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { showToast } from '@utils';

const SPACING = 10;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: 100,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING,
    },
});

interface EditFormProps {
    index: number;
    transaction: Transaction;
    onChangeIndex: (index: number) => void;
    onEdited: (transaction: Transaction) => void;
}

export interface EditFormRefProps {
    expend: () => void;
    collapse: () => void;
}

export const EditForm = React.memo(
    React.forwardRef<EditFormRefProps, EditFormProps>(({ transaction, index, onChangeIndex, onEdited }, ref) => {
        const { height } = useWindowDimensions();
        const { colors } = useTheme();
        const { t } = useTranslation();
        const { transactionRepository, projectRepository } = useDatabaseConnection();
        const bottomRef = React.useRef<BottomSheet>(null);
        const { project, refreshCurrentProject } = useProjects();
        const [state, setState] = React.useState<{
            name: string;
            category: Category | undefined;
            paymentMethod: PaymentMethod | undefined;
            note: string;
            amount: string;
            doneAt: Date;
            debit: boolean;
        }>({
            amount: String(transaction.amount),
            category: transaction.category,
            debit: transaction.debit,
            doneAt: new Date(transaction.doneAt),
            name: transaction.name,
            note: transaction.note,
            paymentMethod: transaction.paymentMethod,
        });

        const onClose = React.useCallback(() => {
            if (bottomRef.current) {
                bottomRef.current.collapse();
            }
        }, []);

        React.useImperativeHandle(ref, () => ({
            expend: () => {
                if (bottomRef.current) {
                    bottomRef.current.expand();
                }
            },
            collapse: onClose,
        }));

        const onSave = React.useCallback(async () => {
            if (project) {
                const error = t('error');
                const tmpAmount = Number(state.amount.replace(',', '.'));
                const name = state.name.trim();
                if (!name) {
                    Alert.alert(error, t('empty_transaction_name'));
                    return;
                }
                if (isNaN(tmpAmount)) {
                    Alert.alert(error, t('amount_number_error'));
                    return;
                }
                if (tmpAmount < 0) {
                    Alert.alert(error, t('amount_error'));
                    return;
                }
                if (state.category === undefined) {
                    Alert.alert(error, t('empty_category'));
                    return;
                }
                if (state.paymentMethod === undefined) {
                    Alert.alert(error, t('empty_payment_method'));
                    return;
                }
                try {
                    const multiplier = state.debit ? -1 : 1;
                    project.balances = project.balances - transaction.amount + tmpAmount * multiplier;
                    await projectRepository.update(project);
                    const updatedTransaction = await transactionRepository.update({
                        ...transaction,
                        name,
                        debit: state.debit,
                        doneAt: state.doneAt.getTime(),
                        amount: tmpAmount,
                        category: state.category,
                        paymentMethod: state.paymentMethod,
                        note: state.note,
                    });
                    refreshCurrentProject();
                    onEdited({ ...transaction, ...updatedTransaction });
                    showToast(t('transaction_edited'));
                    if (bottomRef.current) {
                        bottomRef.current.collapse();
                    }
                } catch (e) {
                    showToast(e);
                }
                refreshCurrentProject();
            }
        }, [
            onEdited,
            project,
            projectRepository,
            refreshCurrentProject,
            state.amount,
            state.category,
            state.debit,
            state.doneAt,
            state.name,
            state.note,
            state.paymentMethod,
            t,
            transaction,
            transactionRepository,
        ]);

        const textColor = React.useMemo<TextStyle>(() => ({ color: colors.text }), [colors.text]);
        const borderBottom = React.useMemo<TextStyle>(
            () => ({
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
            }),
            [colors.border],
        );

        const onChange = React.useCallback(
            (value: any, name: string) => setState((prevState) => ({ ...prevState, [name]: value })),
            [],
        );

        const onSwitchExpense = React.useCallback(() => {
            setState((prevState) => ({ ...prevState, debit: !prevState.debit }));
        }, []);

        return (
            <BottomSheet
                snapPoints={[1, height]}
                index={index}
                onChange={onChangeIndex}
                ref={bottomRef}
                backgroundStyle={{ backgroundColor: colors.background }}
                handleIndicatorStyle={{ backgroundColor: colors.text }}
            >
                <BottomSheetScrollView>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{ padding: 20 }}>
                            <Header
                                onRightButtonPress={onSave}
                                goBackIcon="times"
                                goBackTitle={t('close')}
                                onGoBack={onClose}
                                headerRightIcon="save"
                                headerRightTitle={t('save')}
                            />
                            <TextField
                                label={t('name')}
                                name="name"
                                value={state.name}
                                startIcon={<MaterialIcons name="article" size={26} color={colors.text} />}
                                onChangeText={onChange}
                                returnKeyType="next"
                            />
                            <TextField
                                label={t('amount')}
                                name="amount"
                                keyboardType="numeric"
                                value={state.amount}
                                startIcon={<MaterialIcons name="attach-money" size={26} color={colors.text} />}
                                onChangeText={onChange}
                            />
                            <TouchableWithoutFeedback onPress={onSwitchExpense}>
                                <View style={[styles.row, borderBottom]}>
                                    <Text style={[textColor]}>{t('expense')}</Text>
                                    <Switch value={state.debit} onValueChange={onSwitchExpense} />
                                </View>
                            </TouchableWithoutFeedback>
                            <DatePicker value={state.doneAt} onChange={onChange} />
                            <CategoryPicker selected={state.category} onValueChange={onChange} />
                            <PaymentMethodPicker selected={state.paymentMethod} onValueChange={onChange} />
                            <View style={{ padding: 10, borderBottomColor: colors.border, borderBottomWidth: 1 }}>
                                <Text style={[textColor]}>{t('note')}</Text>
                                <TextInput
                                    multiline
                                    numberOfLines={5}
                                    value={state.note}
                                    onChangeText={(text) => onChange(text, 'note')}
                                    style={[{ height: 100 }, textColor]}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </BottomSheetScrollView>
            </BottomSheet>
        );
    }),
);
