import React from 'react';
import { Dimensions, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { currencyFormat, normalizeHeight, normalizeWidth } from '@utils';
import { useProjects } from '@contexts';
import Template from '@models/Template';
import { color } from '@theme/colors';
import { Text } from '@components/Text';
import { GradientIcon } from '@components/Gradient';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = 120;

const styles = StyleSheet.create({
    viewContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: WIDTH - 20,
        height: HEIGHT,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    amountContainer: {
        height: HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paddingVertical: { paddingVertical: normalizeHeight(3.73), flexDirection: 'row', justifyContent: 'space-between' },
    cellContainer: {
        flexDirection: 'row',
        paddingHorizontal: normalizeWidth(18.18),
    },
    value: {
        fontSize: 11,
        textTransform: 'uppercase',
        marginRight: 20,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

interface TemplateCardProps {
    template: Template;
    onPress: (template: Template) => void;
}

const TemplateCard: React.FunctionComponent<TemplateCardProps> = ({ template, onPress }) => {
    const { colors } = useTheme();
    const { project } = useProjects();
    const tintColor = template.debit ? color.red : color.green;
    const { category, paymentMethod } = template;

    const handlePress = React.useCallback(() => {
        if (onPress) {
            onPress(template);
        }
    }, [onPress, template]);

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View
                style={[
                    styles.viewContainer,
                    { backgroundColor: colors.card, borderLeftColor: category.color, borderLeftWidth: 10 },
                ]}
            >
                <Text bold adjustsFontSizeToFit={true} minimumFontScale={0.5}>
                    {template.name}
                </Text>
                <View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: normalizeHeight(3.73),
                        }}
                    >
                        <Text
                            bold
                            fontSize={16}
                            style={{
                                color: tintColor,
                                textAlign: 'right',
                            }}
                        >
                            {currencyFormat(template.amount, project.currency)}
                        </Text>
                    </View>
                    <View style={styles.paddingVertical}>
                        <View style={styles.textContainer}>
                            <Text style={styles.value}>{category.name}</Text>
                            <GradientIcon name={category.icon} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.value}>{paymentMethod.name}</Text>
                            <GradientIcon name={paymentMethod.icon} />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default TemplateCard;
