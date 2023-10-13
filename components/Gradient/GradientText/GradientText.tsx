import React from 'react';
import { TextProps } from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import { Point } from 'react-native-svg/lib/typescript/elements/Shape';
import { CustomLinearGradient } from '../CustomLinearGradient';
import { Text } from '@components/Text';

interface GradientTextProps extends TextProps {
    colors?: string[];
    start?: Point | null;
    end?: Point | null;
}

const GradientText: React.FunctionComponent<GradientTextProps> = ({ colors, end, start, ...props }) => {
    return (
        <MaskedView maskElement={<Text {...props} />}>
            <CustomLinearGradient colors={colors} start={start} end={end}>
                <Text {...props} style={[props.style, { opacity: 0 }]} />
            </CustomLinearGradient>
        </MaskedView>
    );
};

export default GradientText;
