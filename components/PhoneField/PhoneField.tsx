import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COUNTRY_CODE } from '@config';
import { useVisible } from '@hooks';
import { CountryCodePicker } from './components';
import { useTheme } from '@react-navigation/native';
import { TextField, TextFieldRefProps } from '@components/TextField';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    countryCodeContainer: {
        height: 45,
    },
});

interface PhoneFieldProps {
    countryCode?: string;
    value?: string;
    textHelper?: string;
    error?: boolean;
    onBlur?: () => void;
    onFocus?: () => void;
    onChangePhoneNumber: (value: string) => void;
}

const PhoneFieldComponent: React.FunctionComponent<PhoneFieldProps> = ({
    countryCode = 'KH',
    value = '',
    textHelper,
    error,
    onBlur,
    onFocus,
    onChangePhoneNumber,
}) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { visible, onToggle } = useVisible();
    const countryInputRef = React.useRef<TextFieldRefProps>(null);
    const [state, setState] = React.useState<{ countryCode: string; value: string }>({
        countryCode,
        value: value.replace(COUNTRY_CODE[countryCode].dialCode, ''),
    });

    const handleChangePhoneNumber = React.useCallback(
        (value: string) => {
            setState((prevState) => ({ ...prevState, value }));
            onChangePhoneNumber(`${COUNTRY_CODE[state.countryCode].dialCode}${parseInt(value, 10) || ''}`);
        },
        [onChangePhoneNumber, state.countryCode],
    );

    const onPressCountry = React.useCallback(() => {
        onToggle();
        if (countryInputRef.current) {
            countryInputRef.current.onBlur();
        }
    }, [onToggle]);

    const onChangeCountryCode = React.useCallback(
        (countryCode: string) => {
            onToggle();
            setState((prevState) => ({ ...prevState, countryCode }));
            onChangePhoneNumber(`${COUNTRY_CODE[countryCode].dialCode}${state.value}`);
        },
        [onChangePhoneNumber, onToggle, state.value],
    );

    return (
        <React.Fragment>
            <View style={styles.container}>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <TextField
                        label={t('country_code')}
                        selectionColor={colors.primary}
                        autoCapitalize="none"
                        keyboardType="number-pad"
                        value={`${COUNTRY_CODE[state.countryCode].code} ${COUNTRY_CODE[state.countryCode].dialCode}`}
                        onFocus={onPressCountry}
                        onChangeText={handleChangePhoneNumber}
                        ref={countryInputRef}
                        style={{
                            color: colors.text,
                        }}
                    />
                </View>
                <View style={{ flex: 2, marginLeft: 10 }}>
                    <TextField
                        label={t('phone_number')}
                        selectionColor={colors.primary}
                        clearButtonMode="always"
                        autoCapitalize="none"
                        keyboardType="number-pad"
                        onBlur={onBlur}
                        onFocus={onFocus}
                        value={state.value}
                        onChangeText={handleChangePhoneNumber}
                        error={error}
                        textHelper={textHelper}
                        style={{
                            color: colors.text,
                        }}
                    />
                </View>
            </View>
            <CountryCodePicker visible={visible} onChange={onChangeCountryCode} onClose={onToggle} />
        </React.Fragment>
    );
};

const PhoneField = React.memo(PhoneFieldComponent);

export default PhoneField;
