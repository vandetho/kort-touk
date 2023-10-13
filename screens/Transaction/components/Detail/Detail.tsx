import React from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { GradientIcon, Text } from '@components';
import { currencyFormat } from '@utils';
import { format } from 'date-fns';
import { DISPLAY_DATE_FORMAT } from '@config';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Transaction from '@models/Transaction';
import { color } from '@theme/colors';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: 10,
    },
});

interface DetailProps {
    transaction: Transaction;
}

const Detail = React.memo<DetailProps>(({ transaction }) => {
    const { t } = useTranslation();
    const { height } = useWindowDimensions();
    const [scrollEnabled, setScrollEnabled] = React.useState(false);
    const { colors } = useTheme();

    const onContentSizeChange = React.useCallback(
        (_: number, h: number) => {
            setScrollEnabled(h >= height);
        },
        [height],
    );

    return (
        <ScrollView
            scrollEnabled={scrollEnabled}
            onContentSizeChange={onContentSizeChange}
            contentContainerStyle={{ padding: 20, backgroundColor: colors.card, borderRadius: 15, margin: 20 }}
        >
            <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text>{t('name')}</Text>
                <Text>{transaction.name}</Text>
            </View>
            <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text>{t('amount')}</Text>
                <Text style={{ color: transaction.debit ? color.red : color.green }}>
                    {currencyFormat(transaction.amount)}
                </Text>
            </View>
            <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text>{t('done_on')}</Text>
                <Text>{format(new Date(transaction.doneAt), DISPLAY_DATE_FORMAT)}</Text>
            </View>
            <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text>{t('category')}</Text>
                <GradientIcon name={transaction.category.icon} />
                <Text>{transaction.category.name}</Text>
            </View>
            <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text>{t('payment_method')}</Text>
                <GradientIcon name={transaction.paymentMethod.icon} />
                <Text>{transaction.paymentMethod.name}</Text>
            </View>
            <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text>{t('last_update')}</Text>
                <Text>{format(new Date(transaction.updatedAt), DISPLAY_DATE_FORMAT)}</Text>
            </View>
            <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border, height: 150, padding: 10 }}>
                <Text>{t('note')}</Text>
                <Text style={{ paddingVertical: 10 }}>{transaction.note}</Text>
            </View>
        </ScrollView>
    );
});

export default Detail;
