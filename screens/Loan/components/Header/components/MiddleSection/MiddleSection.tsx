import React from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';
import { differenceInMonths } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { currencyFormat } from '@utils';
import { Loan } from '@interfaces';
import { useRemainAmountFetcher } from '@fetchers';
import { Text } from '@components';

interface MiddleSectionProps {
    animatedValue: Animated.Value;
    loan: Loan;
}

const MiddleSection = React.memo<MiddleSectionProps>(({ animatedValue, loan }) => {
    const { t } = useTranslation();
    const { amount } = useRemainAmountFetcher();
    const { width } = useWindowDimensions();

    const inputRange = React.useMemo(() => [0, 315], []);

    return (
        <Animated.View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
                width,
                transform: [
                    {
                        translateY: animatedValue.interpolate({
                            inputRange,
                            outputRange: [45, 125],
                            extrapolate: 'clamp',
                        }),
                    },
                    {
                        scale: animatedValue.interpolate({
                            inputRange,
                            outputRange: [1, 0.85],
                            extrapolate: 'clamp',
                        }),
                    },
                ],
            }}
        >
            <View>
                <Text fontSize={16} color="#000000">
                    {t('periods')}
                </Text>
                <Text fontSize={20} color="#000000">
                    {differenceInMonths(loan.updatedAt, loan.createdAt) + 1}
                </Text>
            </View>
            <View>
                <Text fontSize={16} color="#000000">
                    {t('remain_amount')}
                </Text>
                <Text fontSize={20} color="#000000">
                    {currencyFormat(amount, loan.currency)}
                </Text>
            </View>
        </Animated.View>
    );
});

export default MiddleSection;
