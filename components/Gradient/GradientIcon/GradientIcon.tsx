import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import { FontAwesome5 } from '@expo/vector-icons';
import { Point } from 'react-native-svg/lib/typescript/elements/Shape';
import { CustomLinearGradient } from '../CustomLinearGradient';

interface GradientIconProps {
    name: any;
    colors?: string[];
    start?: Point | null;
    end?: Point | null;
    size?: number;
    style?: TextStyle | ViewStyle;
}

const GradientIcon: React.FunctionComponent<GradientIconProps> = ({ colors, end, start, size = 24, ...props }) => {
    return (
        <MaskedView maskElement={<FontAwesome5 size={size} {...props} />}>
            <CustomLinearGradient colors={colors} start={start} end={end}>
                <FontAwesome5 size={size} {...props} style={[props.style, { opacity: 0 }]} />
            </CustomLinearGradient>
        </MaskedView>
    );
};

export default GradientIcon;
