import React from 'react';
import { Dimensions, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { normalizeHeight, normalizeWidth } from '@utils';
import { FontAwesome5 } from '@expo/vector-icons';
import { Text } from '@components/Text';

const BORDER_RADIUS = normalizeHeight(25);
const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalizeHeight(14.93),
        width: WIDTH,
        borderRadius: BORDER_RADIUS,
    },
    buttonContainer: {
        marginVertical: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        width: '90%',
        alignSelf: 'center',
        height: normalizeHeight(29.85),
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
        marginRight: normalizeWidth(9.09),
        marginTop: normalizeHeight(3.73),
    },
});

interface EmptyCardProps {
    borderRadius?: number;
    fontSize?: number;
    text: string;
    style?: ViewStyle;
}

const EmptyCardComponent: React.FunctionComponent<EmptyCardProps> = ({ fontSize = 20, borderRadius, text, style }) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.card, borderRadius: borderRadius }, style]}>
            <View style={{ marginVertical: 10 }}>
                <FontAwesome5 name="comment-slash" size={60} color={colors.text} />
            </View>
            <View style={{ marginVertical: 10 }}>
                <Text fontSize={fontSize} bold>
                    {text}
                </Text>
            </View>
        </View>
    );
};

const EmptyCard = React.memo(EmptyCardComponent);

export default EmptyCard;
