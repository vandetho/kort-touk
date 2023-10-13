import React from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';
import { format } from 'date-fns';
import { DISPLAY_DATE_FORMAT } from '@config';
import { Loan } from '@interfaces';
import { useTranslation } from 'react-i18next';
import { Text } from '@components';

interface BottomSectionProps {
    animatedValue: Animated.Value;
    loan: Loan;
}

const BottomSection = React.memo<BottomSectionProps>(({ animatedValue, loan }) => {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();

    const inputRange = React.useMemo(() => [0, 315], []);

    return (
        <Animated.View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
                width,
                transform: [
                    {
                        translateY: animatedValue.interpolate({
                            inputRange,
                            outputRange: [20, 100],
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
            <View>
                <Text fontSize={16} color="#000000">
                    {t('started_on')}
                </Text>
                <Text fontSize={20} color="#000000" bold>
                    {format(loan.createdAt, DISPLAY_DATE_FORMAT)}
                </Text>
            </View>
            <View>
                <Text fontSize={16} color="#000000">
                    {t('ended_on')}
                </Text>
                <Text fontSize={20} color="#000000" bold>
                    {format(loan.updatedAt, DISPLAY_DATE_FORMAT)}
                </Text>
            </View>
        </Animated.View>
    );
});

export default BottomSection;
