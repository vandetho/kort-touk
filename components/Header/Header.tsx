import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { GradientIcon } from '@components/Gradient';
import { BarLoader } from '@components/Loader';
import { Text } from '@components/Text';
import { useNavigation, useTheme } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

const BUTTON_HEIGHT = 40;
const PADDING = 15;

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: PADDING,
        height: BUTTON_HEIGHT,
        borderRadius: 25,
    },
});

interface HeaderProps {
    headerRightIcon?: string;
    headerRightTitle?: string;
    headerMiddleIcon?: string;
    headerMiddleTitle?: string;
    goBackIcon?: string;
    goBackTitle?: string;
    disabledBack?: boolean;
    loadingRightButton?: boolean;
    loadingMiddleButton?: boolean;
    withBackButton?: boolean;
    iconColor?: string;
    textColor?: string;
    withBackground?: boolean;
    onGoBack?: () => void;
    onRightButtonPress?: (data?: any) => void;
    onMiddleButtonPress?: (data?: any) => void;
    containerStyle?: StyleProp<ViewStyle>;
}

const Header = React.memo<HeaderProps>(
    ({
        headerRightIcon,
        headerRightTitle,
        headerMiddleIcon,
        headerMiddleTitle,
        goBackIcon = 'chevron-left',
        goBackTitle,
        disabledBack = false,
        loadingRightButton = false,
        loadingMiddleButton = false,
        iconColor,
        withBackButton = true,
        withBackground = true,
        onGoBack,
        containerStyle,
        onRightButtonPress,
        onMiddleButtonPress,
        ...props
    }) => {
        const { colors } = useTheme();
        const { textColor = colors.text } = props;
        const navigation = useNavigation();

        const handleGoBack = React.useCallback(() => {
            if (!disabledBack) {
                if (onGoBack) {
                    return onGoBack();
                }
                navigation.goBack();
            }
        }, [disabledBack, navigation, onGoBack]);

        const renderMiddleButtonContent = React.useCallback(() => {
            if (loadingMiddleButton) {
                return <BarLoader />;
            }
            const content = [];
            if (headerMiddleTitle) {
                content.push(
                    <Text color={textColor} style={{ marginHorizontal: 10 }} key="header-right-button-text">
                        {headerMiddleTitle}
                    </Text>,
                );
            }
            if (headerMiddleIcon) {
                content.push(<GradientIcon name={headerMiddleIcon} key="header-middle-button-icon" />);
            }
            return content;
        }, [headerMiddleIcon, headerMiddleTitle, loadingMiddleButton, textColor]);

        const renderRightButtonContent = React.useCallback(() => {
            if (loadingRightButton) {
                return <BarLoader />;
            }
            const content = [];
            if (headerRightTitle) {
                content.push(
                    <Text color={textColor} style={{ marginHorizontal: 10 }} key="header-right-button-text">
                        {headerRightTitle}
                    </Text>,
                );
            }
            if (headerRightIcon) {
                if (iconColor) {
                    content.push(
                        <FontAwesome5
                            name={headerRightIcon}
                            size={24}
                            color={iconColor}
                            key="header-right-button-icon"
                        />,
                    );
                } else {
                    content.push(<GradientIcon name={headerRightIcon} key="header-right-button-icon" />);
                }
            }
            return content;
        }, [headerRightIcon, headerRightTitle, iconColor, loadingRightButton, textColor]);

        const background = React.useMemo<ViewStyle>(
            () => (withBackground ? { backgroundColor: colors.card } : undefined),
            [colors.card, withBackground],
        );

        return (
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }, containerStyle]}>
                {withBackButton && (
                    <TouchableOpacity
                        disabled={disabledBack}
                        style={[styles.buttonContainer, background]}
                        onPress={handleGoBack}
                    >
                        {iconColor ? (
                            <FontAwesome5 name="chevron-left" size={24} color={iconColor} />
                        ) : (
                            <GradientIcon name={goBackIcon} />
                        )}
                        {goBackTitle && (
                            <Text color={textColor} style={{ marginHorizontal: 10 }}>
                                {goBackTitle}
                            </Text>
                        )}
                    </TouchableOpacity>
                )}
                {onMiddleButtonPress && (
                    <TouchableOpacity style={[styles.buttonContainer, background]} onPress={onMiddleButtonPress}>
                        {renderMiddleButtonContent()}
                    </TouchableOpacity>
                )}
                {onRightButtonPress && (
                    <TouchableOpacity style={[styles.buttonContainer, background]} onPress={onRightButtonPress}>
                        {renderRightButtonContent()}
                    </TouchableOpacity>
                )}
            </View>
        );
    },
);

export default Header;
