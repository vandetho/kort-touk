import React from 'react';
import { CustomLinearGradient } from '@components';
import { Animated } from 'react-native';
import { useLoans } from '@contexts';
import { BottomSection, Buttons, MiddleSection, NextMonthAmount } from './components';

const TOP_HEIGHT = 315;

interface HeaderProps {
    animatedValue: Animated.Value;
}

const Header = React.memo<HeaderProps>(({ animatedValue }) => {
    const { loan } = useLoans();

    const inputRange = React.useMemo(() => [0, TOP_HEIGHT], []);

    return (
        <React.Fragment>
            <Buttons />
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
                                outputRange: [0, -TOP_HEIGHT + 220],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                <CustomLinearGradient style={{ justifyContent: 'center', alignItems: 'center', height: TOP_HEIGHT }}>
                    <NextMonthAmount animatedValue={animatedValue} />
                    <MiddleSection animatedValue={animatedValue} loan={loan} />
                    <BottomSection animatedValue={animatedValue} loan={loan} />
                </CustomLinearGradient>
            </Animated.View>
        </React.Fragment>
    );
});

export default Header;
