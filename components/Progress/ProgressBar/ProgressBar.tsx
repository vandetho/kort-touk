import React from 'react';
import { Animated, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { CustomLinearGradient } from '@components/Gradient';
import { Text } from '@components/Text';

interface ProgressBarProps {
    steps: number;
    currentIndex: number;
    height?: number;
}

const ProgressBar = React.memo<ProgressBarProps>(({ steps, currentIndex, height = 10 }) => {
    const [width, setWidth] = React.useState(0);
    const animatedValue = React.useRef(new Animated.Value(-1000)).current;
    const reactive = React.useRef(new Animated.Value(-1000)).current;
    const { colors } = useTheme();

    React.useEffect(() => {
        Animated.timing(animatedValue, { toValue: reactive, duration: 750, useNativeDriver: true }).start();
    }, [animatedValue, reactive]);

    React.useEffect(() => {
        reactive.setValue(-width + (width * currentIndex) / steps);
    }, [animatedValue, currentIndex, reactive, steps, width]);

    const onLayout = React.useCallback((event: LayoutChangeEvent) => {
        const newWidth = event.nativeEvent.layout.width;
        setWidth(newWidth);
    }, []);

    return (
        <React.Fragment>
            <Text>
                {currentIndex} / {steps}
            </Text>
            <View
                onLayout={onLayout}
                style={[styles.container, { backgroundColor: colors.border, height, borderRadius: height }]}
            >
                <Animated.View
                    style={{
                        width: '100%',
                        height,
                        transform: [
                            {
                                translateX: animatedValue,
                            },
                        ],
                    }}
                >
                    <CustomLinearGradient style={{ width: '100%', height, borderRadius: height / 2 }} />
                </Animated.View>
            </View>
        </React.Fragment>
    );
});

export default ProgressBar;

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
});
