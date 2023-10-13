import React from 'react';
import { useTheme } from '@react-navigation/native';
import { TouchableWithoutFeedback, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useVisible } from '@hooks';
import { Currency } from '@interfaces';
import { GradientIcon } from '@components/Gradient';
import { Text } from '@components/Text';
import { CurrencyModal } from './components';

interface CurrencyPickerProps {
    name?: string;
    selected: Currency | undefined;
    onValueChange: (currency: Currency | undefined, name?: string) => void;
}

const CurrencyPicker = React.memo<CurrencyPickerProps>(({ name = 'currency', selected, onValueChange }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { visible, onToggle } = useVisible({ initial: false });

    const handleValueChange = React.useCallback(
        (currency: Currency) => {
            onValueChange(currency, name);
            onToggle();
        },
        [onValueChange, name, onToggle],
    );

    return (
        <React.Fragment>
            <TouchableWithoutFeedback onPress={onToggle}>
                <View
                    style={{
                        height: 60,
                        backgroundColor: colors.background,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottomColor: colors.border,
                        borderBottomWidth: 1,
                    }}
                >
                    <Text style={{ color: colors.text }}>{selected || t('select_currency_placeholder')}</Text>
                    <GradientIcon name="chevron-down" />
                </View>
            </TouchableWithoutFeedback>
            <CurrencyModal visible={visible} selected={selected} onChange={handleValueChange} onClose={onToggle} />
        </React.Fragment>
    );
});

export default CurrencyPicker;
