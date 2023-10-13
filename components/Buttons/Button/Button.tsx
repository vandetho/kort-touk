import React from 'react';
import { StyleProp, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { ERROR, PRIMARY, SECONDARY, SUCCESS } from '@theme';
import { Text } from '@components/Text';
import { BarLoader } from '@components/Loader';

const HEIGHT = 40;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: HEIGHT,
    },
});

interface ButtonProps {
    shape?: 'rectangle' | 'square';
    type?: 'error' | 'success' | 'primary' | 'secondary';
    label: string;
    textColor?: string;
    startIcon?: JSX.Element;
    endIcon?: JSX.Element;
    isLoading?: boolean;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}

const Button = React.memo<ButtonProps>(
    ({ shape = 'rectangle', label, textColor, startIcon, endIcon, isLoading, type = 'primary', style, onPress }) => {
        const handlePress = React.useCallback(() => {
            if (onPress) {
                onPress();
            }
        }, [onPress]);

        const renderStartIcon = React.useCallback(() => {
            if (startIcon) {
                return startIcon;
            }
            return null;
        }, [startIcon]);

        const renderEndIcon = React.useCallback(() => {
            if (endIcon) {
                return endIcon;
            }
            return null;
        }, [endIcon]);

        const radius = React.useMemo(() => {
            const radius = {
                rectangle: 0,
                shape: 5,
            };

            return radius[shape];
        }, [shape]);

        const backgroundColor = React.useMemo(() => {
            const backgroundColors = { error: ERROR, success: SUCCESS, primary: PRIMARY, secondary: SECONDARY };
            return backgroundColors[type];
        }, [type]);

        const color = React.useMemo(() => {
            const colors = { error: '#FFFFFF', success: '#FFFFFF', primary: '#FFFFFF', secondary: '#FFFFFF' };
            return textColor || colors[type];
        }, [textColor, type]);

        const renderContent = React.useCallback(() => {
            if (isLoading) {
                return (
                    <View style={[styles.container, { borderRadius: radius, backgroundColor: backgroundColor }]}>
                        <BarLoader color={color} />
                    </View>
                );
            }
            return (
                <View style={[styles.container, { borderRadius: radius, backgroundColor: backgroundColor }, style]}>
                    {renderStartIcon()}
                    <Text style={{ color, marginHorizontal: 10 }}>{label}</Text>
                    {renderEndIcon()}
                </View>
            );
        }, [backgroundColor, color, isLoading, label, radius, renderEndIcon, renderStartIcon, style]);

        return <TouchableWithoutFeedback onPress={handlePress}>{renderContent()}</TouchableWithoutFeedback>;
    },
);

export default Button;
