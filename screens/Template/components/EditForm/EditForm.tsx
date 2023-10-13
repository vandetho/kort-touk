import React from 'react';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import {
    Alert,
    Keyboard,
    StyleSheet,
    TextStyle,
    TouchableWithoutFeedback,
    useWindowDimensions,
    View,
} from 'react-native';
import { CategoryPicker, Header, PaymentMethodPicker, Switch, Text, TextField } from '@components';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import Template from '@models/Template';
import Category from '@models/Category';
import PaymentMethod from '@models/PaymentMethod';

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
    template: Template;
    onChangeIndex: (index: number) => void;
    onEdited: (template: Template) => void;
}

export interface EditFormRefProps {
    expend: () => void;
    collapse: () => void;
}

export const EditForm = React.memo(
    React.forwardRef<EditFormRefProps, EditFormProps>(({ template, index, onChangeIndex, onEdited }, ref) => {
        const { height } = useWindowDimensions();
        const { colors } = useTheme();
        const { t } = useTranslation();
        const bottomRef = React.useRef<BottomSheet>(null);
        const { templateRepository } = useDatabaseConnection();
        const [state, setState] = React.useState<{
            name: string;
            category: Category | undefined;
            paymentMethod: PaymentMethod | undefined;
            amount: string;
            debit: boolean;
        }>({
            amount: String(template.amount),
            category: template.category,
            debit: template.debit,
            name: template.name,
            paymentMethod: template.paymentMethod,
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
            const error = t('error');
            const amount = Number(state.amount.replace(',', '.'));
            const name = state.name.trim();
            if (!name) {
                Alert.alert(error, t('empty_template_name'));
                return;
            }
            if (isNaN(amount)) {
                Alert.alert(error, t('amount_number_error'));
                return;
            }
            if (amount < 0) {
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
            const updatedTemplate = await templateRepository.update({
                ...template,
                amount,
                name,
                debit: state.debit,
                category: state.category,
                paymentMethod: state.paymentMethod,
            });
            onEdited(updatedTemplate);
        }, [
            t,
            state.amount,
            state.name,
            state.category,
            state.paymentMethod,
            state.debit,
            templateRepository,
            template,
            onEdited,
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
                backgroundStyle={{ backgroundColor: colors.card }}
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
                            <CategoryPicker selected={state.category} onValueChange={onChange} />
                            <PaymentMethodPicker selected={state.paymentMethod} onValueChange={onChange} />
                        </View>
                    </TouchableWithoutFeedback>
                </BottomSheetScrollView>
            </BottomSheet>
        );
    }),
);
