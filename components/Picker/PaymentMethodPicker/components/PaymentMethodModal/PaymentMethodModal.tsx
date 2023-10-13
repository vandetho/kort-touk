import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { GradientIcon } from '@components/Gradient';
import { Text } from '@components/Text';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { LineSeparator } from '@components/LineSeparator';
import { usePaymentMethods } from '@contexts';
import PaymentMethod from '@models/PaymentMethod';

export const HEIGHT = 40;

const styles = StyleSheet.create({
    itemContainer: {
        height: HEIGHT,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
});

interface PaymentMethodModalModalProps {
    nullable: boolean;
    visible: boolean;
    selected: PaymentMethod | undefined;
    onChange: (category: PaymentMethod) => void;
    onClose: () => void;
}

const PaymentMethodModal = React.memo<PaymentMethodModalModalProps>(
    ({ nullable, visible, selected, onChange, onClose }) => {
        const { colors } = useTheme();
        const { t } = useTranslation();
        const insets = useSafeAreaInsets();
        const { paymentMethods } = usePaymentMethods();
        const { height } = useWindowDimensions();

        const renderItem = React.useCallback(
            ({ item }: { item: PaymentMethod }) => (
                <TouchableOpacity onPress={() => onChange(item)} style={styles.itemContainer}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 200 }}>
                        {item.name}
                    </Text>
                    {item.id === selected?.id && <GradientIcon name="check" />}
                </TouchableOpacity>
            ),
            [onChange, selected?.id],
        );

        const getItemLayout = React.useCallback((_, index) => ({ index, length: HEIGHT, offset: HEIGHT * index }), []);

        const keyExtractor = React.useCallback((_, index) => `payment-method-item-${index}`, []);

        const data = React.useMemo(
            () => (nullable ? [{ name: t('select_payment_method_placeholder') }, ...paymentMethods] : paymentMethods),
            [paymentMethods, nullable, t],
        );

        return (
            <Modal
                isVisible={visible}
                style={{
                    margin: 0,
                }}
            >
                <View
                    style={{
                        height,
                        backgroundColor: colors.card,
                    }}
                >
                    <View style={{ height: 80, paddingTop: insets.top, paddingHorizontal: 20 }}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{ flexDirection: 'row', width: 100, alignItems: 'center' }}
                        >
                            <GradientIcon name="times" />
                            <Text bold style={{ marginHorizontal: 10 }}>
                                {t('close')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        getItemLayout={getItemLayout}
                        ItemSeparatorComponent={LineSeparator}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}
                    />
                </View>
            </Modal>
        );
    },
);

export default PaymentMethodModal;
