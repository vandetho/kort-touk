import React from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useApplication, usePaymentMethods } from '@contexts';
import { GradientIcon, Header, Text } from '@components';
import { useTranslation } from 'react-i18next';
import { useNavigation, useTheme } from '@react-navigation/native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { showToast } from '@utils';
import PaymentMethod from '@models/PaymentMethod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingStackParamsList } from '@navigations/SettingNavigator';

const ITEM_HEIGHT = 60;

type NewPaymentMethodScreenNavigationProps = NativeStackNavigationProp<SettingStackParamsList, 'NewPaymentMethod'>;

interface PaymentMethodsProps {}

const PaymentMethods = React.memo<PaymentMethodsProps>(() => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { isLite } = useApplication();
    const navigation = useNavigation<NewPaymentMethodScreenNavigationProps>();
    const { allPaymentMethods } = usePaymentMethods();
    const { paymentMethodRepository } = useDatabaseConnection();
    const [state, setState] = React.useState(allPaymentMethods);

    const renderItem = React.useCallback(
        ({ item, drag, isActive }: RenderItemParams<PaymentMethod>) => {
            return (
                <TouchableOpacity
                    style={{
                        height: ITEM_HEIGHT,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 15,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                    }}
                    disabled={isActive}
                    onLongPress={drag}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <GradientIcon name="sort" />
                        <Text style={{ marginLeft: 20 }}>{item.name}</Text>
                    </View>
                    <GradientIcon name={item.icon} />
                </TouchableOpacity>
            );
        },
        [colors.border],
    );

    const keyExtractor = React.useCallback((item) => `payment-methods-item-${item.id}`, []);

    const onDragEnd = React.useCallback(({ data }) => setState(data), []);

    const onPressAdd = React.useCallback(() => {
        navigation.navigate('NewPaymentMethod');
    }, [navigation]);

    const onSave = React.useCallback(async () => {
        const paymentMethods = [...state];
        for (let i = 0; i < paymentMethods.length; ++i) {
            paymentMethods[i].sort = i;
        }
        await paymentMethodRepository.update(paymentMethods);
        showToast(t('payment_methods_updated'));
    }, [paymentMethodRepository, state, t]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
                <Header
                    goBackTitle={t('back')}
                    headerRightIcon="check"
                    onMiddleButtonPress={isLite ? undefined : onPressAdd}
                    headerMiddleIcon="plus"
                    headerMiddleTitle={t('add')}
                    headerRightTitle={t('save')}
                    onRightButtonPress={onSave}
                />
            </View>
            <DraggableFlatList
                data={state}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onDragEnd={onDragEnd}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </SafeAreaView>
    );
});

export default PaymentMethods;
