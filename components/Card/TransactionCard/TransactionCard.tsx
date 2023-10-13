import React from 'react';
import { Dimensions, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { currencyFormat, normalizeHeight, normalizeWidth } from '@utils';
import { DISPLAY_DATE_FORMAT } from '@config';
import { useProjects } from '@contexts';
import Transaction from '@models/Transaction';
import { color } from '@theme/colors';
import { Text } from '@components/Text';
import { GradientIcon } from '@components/Gradient';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = 170;

const styles = StyleSheet.create({
    viewContainer: {
        padding: 10,
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
    paddingVertical: {
        paddingVertical: normalizeHeight(3.73),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cellContainer: {
        flexDirection: 'row',
        paddingHorizontal: normalizeWidth(18.18),
    },
    label: {
        fontSize: 10,
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 12,
        textTransform: 'uppercase',
        marginRight: 20,
    },
    textContainer: {
        flexDirection: 'row',
    },
    dateContainer: {},
});

interface TransactionCardProps {
    transaction: Transaction;
    onPress?: (transaction: Transaction) => void;
}

const TransactionCard: React.FunctionComponent<TransactionCardProps> = ({ transaction, onPress }) => {
    const { colors } = useTheme();
    const { project } = useProjects();
    const { t } = useTranslation();
    const tintColor = transaction.debit ? color.red : color.green;
    const { category, paymentMethod } = transaction;
    const doneOn = format(new Date(transaction.doneAt), DISPLAY_DATE_FORMAT);
    const createdAt = format(new Date(transaction.createdAt), DISPLAY_DATE_FORMAT);

    const handlePress = React.useCallback(() => {
        if (onPress) {
            onPress(transaction);
        }
    }, [onPress, transaction]);

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View
                style={[
                    styles.viewContainer,
                    { backgroundColor: colors.card, borderLeftColor: category.color, borderLeftWidth: 10 },
                ]}
            >
                <Text
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.5}
                    bold
                    fontSize={16}
                    style={{ color: colors.text }}
                >
                    {transaction.name}
                </Text>
                <View>
                    <Text
                        bold
                        fontSize={16}
                        style={{
                            color: tintColor,
                            textAlign: 'right',
                            paddingVertical: 5,
                        }}
                    >
                        {currencyFormat(transaction.amount, project?.currency || 'USD')}
                    </Text>
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
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={styles.dateContainer}>
                            <Text style={styles.label}>{t('done_on')}</Text>
                            <Text style={styles.value}>{doneOn}</Text>
                        </View>
                        <View style={styles.dateContainer}>
                            <Text style={styles.label}>{t('created_on')}</Text>
                            <Text style={styles.value}>{createdAt}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default TransactionCard;
