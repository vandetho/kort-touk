import React from 'react';
import { Animated } from 'react-native';
import { currencyFormat } from '@utils';
import { useNextMonthPaymentByProjectFetcher } from '@fetchers';
import { useTranslation } from 'react-i18next';
import { Text } from '@components';
import { color } from '@theme/colors';

interface NextMonthAmountProps {
    animatedValue: Animated.Value;
}

const NextMonthAmount = React.memo<NextMonthAmountProps>(({ animatedValue }) => {
    const { transaction } = useNextMonthPaymentByProjectFetcher();
    const { t } = useTranslation();

    const inputRange = React.useMemo(() => [0, 315], []);

    return (
        <Animated.View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                transform: [
                    {
                        translateY: animatedValue.interpolate({
                            inputRange,
                            outputRange: [65, 155],
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
            <Text color="#000000" fontSize={20}>
                {t('next_month_payment')}
            </Text>
            <Text color={transaction?.debit ? color.red : color.green} fontSize={26} bold>
                {currencyFormat(transaction?.amount || 0)}
            </Text>
        </Animated.View>
    );
});

export default NextMonthAmount;
