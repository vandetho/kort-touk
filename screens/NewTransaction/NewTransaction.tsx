import React from 'react';
import { Alert, Keyboard, StyleSheet, TextInput, TextStyle, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { CategoryPicker, DatePicker, Header, PaymentMethodPicker, Switch, Text, TextField } from '@components';
import { useProjects } from '@contexts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTemplate } from '@contexts/TemplateContext';
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

interface NewTransactionProps {}

const NewTransaction: React.FunctionComponent<NewTransactionProps> = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { project, refreshCurrentProject } = useProjects();
    const { transactionRepository, templateRepository, projectRepository } = useDatabaseConnection();
    const { template } = useTemplate();
    const [dispatch, setDispatch] = React.useState<boolean>(false);
    const [state, setState] = React.useState<{
        name: string;
        category: Category | undefined;
        paymentMethod: PaymentMethod | undefined;
        note: string;
        amount: string;
        doneAt: Date;
        withTemplate: boolean;
        debit: boolean;
    }>({
        amount: '',
        category: undefined,
        debit: true,
        doneAt: new Date(),
        name: '',
        note: '',
        paymentMethod: undefined,
        withTemplate: false,
    });

    React.useEffect(() => {
        if (template) {
            setState((prevState) => ({
                ...prevState,
                debit: template.debit,
                name: template.name,
                amount: String(Math.abs(template.amount)),
                paymentMethod: template.paymentMethod,
                category: template.category,
                doneAt: new Date(),
            }));
        }
    }, [template]);

    const onSave = React.useCallback(async () => {
        if (project) {
            const error = t('error');
            const finalAmount = Number(state.amount.replace(',', '.'));
            const name = state.name.trim();
            if (!name) {
                Alert.alert(error, t('empty_transaction_name'));
                return;
            }
            if (isNaN(finalAmount)) {
                Alert.alert(error, t('amount_number_error'));
                return;
            }
            if (finalAmount < 0) {
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
            setDispatch(true);
            await transactionRepository.save({
                amount: finalAmount,
                name,
                debit: state.debit,
                doneAt: state.doneAt.getTime(),
                category: state.category,
                paymentMethod: state.paymentMethod,
                project,
            });
            const multiplier = state.debit ? -1 : 1;
            project.balances += finalAmount * multiplier;
            await projectRepository.update(project);
            if (state.withTemplate) {
                await templateRepository.save({
                    amount: finalAmount,
                    name: state.name,
                    debit: state.debit,
                    category: state.category,
                    paymentMethod: state.paymentMethod,
                });
            }
            refreshCurrentProject();
            showToast(t('transaction_added'));
            navigation.goBack();
            setDispatch(false);
        }
    }, [
        navigation,
        project,
        projectRepository,
        refreshCurrentProject,
        state.amount,
        state.category,
        state.debit,
        state.doneAt,
        state.name,
        state.paymentMethod,
        state.withTemplate,
        t,
        templateRepository,
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

    const onSwitchWithTemplate = React.useCallback(() => {
        setState((prevState) => ({ ...prevState, withTemplate: !prevState.withTemplate }));
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                <View style={{ padding: 10 }}>
                    <Header
                        goBackIcon="times"
                        goBackTitle={t('close')}
                        loadingRightButton={dispatch}
                        onRightButtonPress={onSave}
                        headerRightIcon="check"
                        headerRightTitle={t('save')}
                    />
                </View>
                <KeyboardAwareScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingTop: 0,
                        paddingHorizontal: 10,
                        paddingBottom: 20,
                    }}
                >
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
                    <View style={{ paddingVertical: 10, borderBottomColor: colors.border, borderBottomWidth: 1 }}>
                        <Text style={[textColor]}>{t('note')}</Text>
                        <TextInput
                            value={state.note}
                            multiline
                            numberOfLines={5}
                            onChangeText={(text) => onChange(text, 'note')}
                            style={[{ minHeight: 100 }, textColor]}
                        />
                    </View>
                    <TouchableWithoutFeedback onPress={onSwitchWithTemplate}>
                        <View style={[styles.row, borderBottom]}>
                            <Text style={[textColor]}>{t('create_template')}</Text>
                            <Switch value={state.withTemplate} onValueChange={onSwitchWithTemplate} />
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAwareScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default NewTransaction;
