import React from 'react';
import { Point } from 'react-native-svg/lib/typescript/elements/Shape';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleProp, ViewStyle } from 'react-native';
import { PRIMARY, SECONDARY } from '@theme';

interface CustomLinearGradientProps {
    locations?: number[] | null;
    start?: Point | null;
    end?: Point | null;
    colors?: string[];
    style?: StyleProp<ViewStyle>;
}

const CustomLinearGradientComponent: React.FunctionComponent<CustomLinearGradientProps> = (props) => {
    const { children, colors = [PRIMARY, SECONDARY], end = { x: 1, y: 0.25 }, start = { x: 0, y: 1 }, style } = props;
    return (
        <LinearGradient colors={colors} style={[style]} start={start} end={end}>
            {children}
        </LinearGradient>
    );
};

const CustomLinearGradient =
    React.memo<React.PropsWithChildren<CustomLinearGradientProps>>(CustomLinearGradientComponent);
export default CustomLinearGradient;
