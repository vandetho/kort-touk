import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { format } from 'date-fns';
import Collapsible from 'react-native-collapsible';
import { useTheme } from '@react-navigation/native';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { useVisible } from '@hooks';
import { DISPLAY_DATE_FORMAT, DISPLAY_TIME_FORMAT } from '@config';
import { useApplication } from '@contexts';
import { color } from '@theme/colors';

const styles = StyleSheet.create({
    doneAtContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
    },
    pickerContainer: {
        padding: 15,
    },
});

interface DoneAtProps {
    name?: string;
    label?: string;
    clearable?: boolean;
    withBorder?: boolean;
    minDate?: Date;
    maxDate?: Date;
    mode?: 'date' | 'time';
    value: Date | undefined;
    onOpen?: () => void;
    onClose?: () => void;
    onChange: (date?: Date, name?: string) => void;
}

const DatePicker: React.FunctionComponent<DoneAtProps> = ({
    name = 'doneAt',
    label,
    clearable = false,
    withBorder = false,
    minDate,
    maxDate,
    mode = 'date',
    value,
    onOpen,
    onClose,
    onChange,
}) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { isAndroid } = useApplication();
    const { visible, onOpen: handleOpen, onClose: handleClose } = useVisible({ initial: !isAndroid });
    const textColor = React.useMemo<TextStyle>(() => ({ color: colors.text }), [colors.text]);
    const borderBottom = React.useMemo<TextStyle>(
        () =>
            withBorder
                ? {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                  }
                : undefined,
        [colors.border, withBorder],
    );

    const handleChange = React.useCallback(
        (event: Event, date?: Date) => {
            onChange(date, name);
        },
        [name, onChange],
    );

    const onClear = React.useCallback(() => {
        onChange(undefined, name);
    }, [name, onChange]);

    const handlePress = React.useCallback(() => {
        if (visible) {
            if (onOpen) {
                onOpen();
            }
            handleClose();
            return;
        }
        if (onClose) {
            onClose();
        }
        handleOpen();
    }, [handleClose, handleOpen, onClose, onOpen, visible]);

    const renderClearButton = React.useCallback(() => {
        if (clearable && value) {
            return (
                <TouchableOpacity
                    onPress={onClear}
                    style={{
                        backgroundColor: color.grey,
                        paddingHorizontal: 7,
                        paddingVertical: 2,
                        marginLeft: 20,
                        borderRadius: 30,
                    }}
                >
                    <Text style={{ fontSize: 12 }}>{t('clear')}</Text>
                </TouchableOpacity>
            );
        }
        return null;
    }, [clearable, onClear, t, value]);

    const displayFormat = React.useMemo(() => {
        const format = {
            date: DISPLAY_DATE_FORMAT,
            time: DISPLAY_TIME_FORMAT,
        };
        return format[mode];
    }, [mode]);

    const renderPicker = React.useCallback(() => {
        if (isAndroid) {
            if (visible) {
                return (
                    <DateTimePicker
                        testID={name}
                        value={value || new Date()}
                        minimumDate={minDate}
                        maximumDate={maxDate}
                        textColor={colors.text}
                        mode={mode}
                        is24Hour
                        display="spinner"
                        onChange={handleChange}
                    />
                );
            }
            return null;
        }
        return (
            <Collapsible collapsed={visible}>
                <View style={[styles.pickerContainer, borderBottom]}>
                    <DateTimePicker
                        testID={name}
                        value={value || new Date()}
                        minimumDate={minDate}
                        maximumDate={maxDate}
                        textColor={colors.text}
                        mode={mode}
                        is24Hour
                        display="spinner"
                        onChange={handleChange}
                    />
                </View>
            </Collapsible>
        );
    }, [borderBottom, colors.text, handleChange, isAndroid, maxDate, minDate, mode, name, value, visible]);

    return (
        <React.Fragment>
            <TouchableWithoutFeedback onPress={handlePress}>
                <View style={[styles.doneAtContainer, borderBottom]}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[textColor]}>{label || t('done_on')}</Text>
                        {renderClearButton()}
                    </View>
                    <Text style={[textColor]}>{value && format(value, displayFormat)}</Text>
                </View>
            </TouchableWithoutFeedback>
            {renderPicker()}
        </React.Fragment>
    );
};

export default DatePicker;
