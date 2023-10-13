import React from 'react';
import { CustomLinearGradient } from '@components';
import { Animated } from 'react-native';
import { useNextMonthPaymentFetcher } from '@fetchers';
import { currencyFormat } from '@utils';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import { color } from '@theme/colors';

const TOP_HEIGHT = 275;

interface HeaderProps {
    animatedValue: Animated.Value;
}

const Header = React.memo<HeaderProps>(({ animatedValue }) => {
    const { expense, income, fetch } = useNextMonthPaymentFetcher();
    const isFocused = useIsFocused();
    const { t } = useTranslation();

    React.useEffect(() => {
        if (isFocused) {
            (async () => fetch())();
        }
    }, [fetch, isFocused]);

    const inputRange = React.useMemo(() => [0, TOP_HEIGHT], []);

    const textTransforms = React.useMemo(
        () => [
            {
                translateX: animatedValue.interpolate({
                    inputRange,
                    outputRange: [0, -100],
                    extrapolate: 'clamp',
                }),
            },
            {
                translateY: animatedValue.interpolate({
                    inputRange,
                    outputRange: [50, 160],
                    extrapolate: 'clamp',
                }),
            },
            {
                scale: animatedValue.interpolate({
                    inputRange,
                    outputRange: [1, 0.75],
                    extrapolate: 'clamp',
                }),
            },
        ],
        [animatedValue, inputRange],
    );

    return (
        <Animated.View
            style={{
                position: 'absolute',
                zIndex: 1,
                top: 0,
                left: 0,
                right: 0,
                transform: [
                    {
                        translateY: animatedValue.interpolate({
                            inputRange,
                            outputRange: [0, -100],
                            extrapolate: 'clamp',
                        }),
                    },
                ],
            }}
        >
            <CustomLinearGradient style={{ justifyContent: 'center', alignItems: 'center', height: TOP_HEIGHT }}>
                <Animated.Text
                    style={{
                        fontSize: 20,
                        fontFamily: 'Nunito_400Regular',
                        transform: textTransforms,
                    }}
                >
                    {t('next_month')}
                </Animated.Text>
                <Animated.Text
                    style={{
                        fontSize: 20,
                        fontFamily: 'Nunito_400Regular',
                        transform: textTransforms,
                    }}
                >
                    {t('expense')}
                </Animated.Text>
                <Animated.Text
                    style={{
                        color: color.red,
                        fontSize: 30,
                        paddingVertical: 20,
                        fontFamily: 'Nunito_900Black',
                        transform: [
                            {
                                translateX: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [0, 125],
                                    extrapolate: 'clamp',
                                }),
                            },
                            {
                                translateY: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [30, 90],
                                    extrapolate: 'clamp',
                                }),
                            },
                            {
                                scale: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [1, 0.7],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    {currencyFormat(expense)}
                </Animated.Text>
                <Animated.Text
                    style={{
                        fontSize: 20,
                        fontFamily: 'Nunito_400Regular',
                        transform: [
                            {
                                translateX: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [0, -105],
                                    extrapolate: 'clamp',
                                }),
                            },
                            {
                                translateY: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [20, 75],
                                    extrapolate: 'clamp',
                                }),
                            },
                            {
                                scale: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [1, 0.75],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    {t('income')}
                </Animated.Text>
                <Animated.Text
                    style={{
                        color: color.green,
                        fontSize: 30,
                        paddingVertical: 20,
                        fontFamily: 'Nunito_900Black',
                        transform: [
                            {
                                translateX: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [0, 117],
                                    extrapolate: 'clamp',
                                }),
                            },
                            {
                                translateY: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [0, 10],
                                    extrapolate: 'clamp',
                                }),
                            },
                            {
                                scale: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [1, 0.7],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    {currencyFormat(income)}
                </Animated.Text>
            </CustomLinearGradient>
        </Animated.View>
    );
});

export default Header;
