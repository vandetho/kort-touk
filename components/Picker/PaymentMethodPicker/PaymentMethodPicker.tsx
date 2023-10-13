import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useVisible } from '@hooks';
import { useTranslation } from 'react-i18next';
import PaymentMethod from '@models/PaymentMethod';
import { GradientIcon } from '@components/Gradient';
import { Text } from '@components/Text';
import { PaymentMethodModal } from '@components/Picker/PaymentMethodPicker/components';

interface PaymentMethodPickerProps {
    nullable?: boolean;
    name?: string;
    selected: PaymentMethod | undefined;
    onValueChange: (paymentMethod: PaymentMethod | undefined, name?: string) => void;
}

const PaymentMethodPicker = React.memo<PaymentMethodPickerProps>(
    ({ nullable = false, name = 'paymentMethod', selected, onValueChange }) => {
        const { colors } = useTheme();
        const { t } = useTranslation();
        const { visible, onToggle } = useVisible();

        const handleValueChange = React.useCallback(
            (paymentMethod: PaymentMethod) => {
                onValueChange(paymentMethod, name);
                onToggle();
            },
            [name, onToggle, onValueChange],
        );
        return (
            <React.Fragment>
                <TouchableOpacity
                    onPress={onToggle}
                    style={{
                        height: 60,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}
                >
                    <Text style={{ color: colors.text }}>
                        {selected?.name || t('select_payment_method_placeholder')}
                    </Text>
                    {selected && <GradientIcon name={selected.icon} />}
                </TouchableOpacity>
                <PaymentMethodModal
                    nullable={nullable}
                    visible={visible}
                    selected={selected}
                    onChange={handleValueChange}
                    onClose={onToggle}
                />
            </React.Fragment>
        );
    },
);

export default PaymentMethodPicker;
