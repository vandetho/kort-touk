import React from 'react';
import {
    NativeSyntheticEvent,
    StyleProp,
    StyleSheet,
    TextInput,
    TextInputFocusEventData,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from '@components/Text';
import { ERROR } from '@theme';

const HORIZONTAL_SPACING = 5;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginVertical: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    labelContainer: {
        flexDirection: 'row',
    },
    iconContainer: {
        paddingHorizontal: HORIZONTAL_SPACING,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

interface TextFieldProps extends TextInputProps {
    label: string;
    name?: string;
    required?: boolean;
    startIcon?: JSX.Element;
    endIcon?: JSX.Element;
    height?: number;
    textHelper?: string;
    error?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    onChangeText?: (text: string, name?: string) => void;
}

export interface TextFieldRefProps {
    onFocus: () => void;
    onBlur: () => void;
}

const TextFieldComponent = React.forwardRef<TextFieldRefProps, TextFieldProps>(
    (
        {
            label,
            startIcon,
            endIcon,
            required = false,
            textHelper,
            error,
            onFocus,
            onBlur,
            name,
            onChangeText,
            containerStyle,
            style,
            ...props
        },
        ref,
    ) => {
        const inputRef = React.useRef<TextInput>(null);
        const { colors } = useTheme();
        const [focus, setFocus] = React.useState(false);

        React.useImperativeHandle(ref, () => ({
            onFocus: () => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            },
            onBlur: () => {
                if (inputRef.current) {
                    inputRef.current.blur();
                }
            },
        }));

        const onPressLabel = React.useCallback(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, []);

        const handleFocus = React.useCallback(
            (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                if (onFocus) {
                    onFocus(e);
                }
                setFocus((prevState) => !prevState);
            },
            [onFocus],
        );

        const handleBlur = React.useCallback(
            (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
                if (onBlur) {
                    onBlur(e);
                }
                setFocus((prevState) => !prevState);
            },
            [onBlur],
        );

        const renderStartIcon = React.useCallback(() => {
            if (startIcon) {
                return <View style={styles.iconContainer}>{startIcon}</View>;
            }
            return null;
        }, [startIcon]);

        const renderEndIcon = React.useCallback(() => {
            if (endIcon) {
                return <View style={styles.iconContainer}>{endIcon}</View>;
            }
            return null;
        }, [endIcon]);

        const renderTextHelper = React.useCallback(() => {
            if (textHelper) {
                return <Text style={error && { color: ERROR }}>{textHelper}</Text>;
            }
            return null;
        }, [error, textHelper]);

        const handleChangeText = React.useCallback(
            (text: string) => {
                if (onChangeText) {
                    onChangeText(text, name);
                }
            },
            [name, onChangeText],
        );

        const labelStyle = React.useMemo(
            (): TextStyle => ({ flexDirection: 'row', color: focus ? colors.primary : colors.text }),
            [colors.primary, colors.text, focus],
        );

        return (
            <View style={styles.container}>
                <View style={styles.labelContainer}>
                    <Text onPress={onPressLabel} style={labelStyle}>
                        {label}
                    </Text>
                    {required && (
                        <Text bold fontSize={16} onPress={onPressLabel} style={[labelStyle, { marginHorizontal: 2 }]}>
                            *
                        </Text>
                    )}
                </View>
                <View
                    style={[
                        styles.inputContainer,
                        containerStyle,
                        { borderBottomColor: focus ? colors.primary : colors.text },
                    ]}
                >
                    {renderStartIcon()}
                    <TextInput
                        selectionColor={colors.primary}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChangeText={handleChangeText}
                        style={[
                            style,
                            { width: '100%', color: colors.text, fontFamily: 'Nunito_400Regular', paddingVertical: 5 },
                        ]}
                        {...props}
                        ref={inputRef}
                    />
                    {renderEndIcon()}
                </View>
                {renderTextHelper()}
            </View>
        );
    },
);

export const TextField = React.memo(TextFieldComponent);
