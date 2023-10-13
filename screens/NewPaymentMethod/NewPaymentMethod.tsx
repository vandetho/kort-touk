import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { usePaymentMethods } from '@contexts';
import { Header, IconPicker, TextField } from '@components';
import { useTranslation } from 'react-i18next';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { showToast } from '@utils';
import { CreatePaymentMethod } from '@interfaces';
import { useNavigation } from '@react-navigation/native';

interface NewPaymentMethodProps {}

const NewPaymentMethod = React.memo<NewPaymentMethodProps>(() => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { allPaymentMethods, addPaymentMethod } = usePaymentMethods();
    const { paymentMethodRepository } = useDatabaseConnection();
    const [state, setState] = React.useState<CreatePaymentMethod>({ icon: 'ellipsis-h', name: '' });

    const onSave = React.useCallback(async () => {
        if (!state.name) {
            showToast(t('payment_method_name_required'));
            return;
        }
        const paymentMethod: CreatePaymentMethod = { ...state, sort: allPaymentMethods.length };
        addPaymentMethod(await paymentMethodRepository.save(paymentMethod));
        showToast(t('payment_method_added', { name: paymentMethod.name }));
        navigation.goBack();
    }, [addPaymentMethod, allPaymentMethods.length, navigation, paymentMethodRepository, state, t]);

    const onChangeText = React.useCallback((name: string) => {
        setState((prevState) => ({ ...prevState, name }));
    }, []);

    const onChangeIcon = React.useCallback((icon: string) => {
        setState((prevState) => ({ ...prevState, icon }));
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
                <Header
                    goBackTitle={t('back')}
                    headerRightIcon="check"
                    headerRightTitle={t('save')}
                    onRightButtonPress={onSave}
                />
            </View>
            <TextField label={t('payment_method_name')} value={state.name} onChangeText={onChangeText} />
            <IconPicker value={state.icon} onValueChange={onChangeIcon} />
        </SafeAreaView>
    );
});

export default NewPaymentMethod;
