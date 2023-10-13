import React from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { GradientIcon, Text } from '@components';
import { currencyFormat } from '@utils';
import { format } from 'date-fns';
import { DISPLAY_DATE_FORMAT } from '@config';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Template from '@models/Template';

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
    template: Template;
}

const Detail = React.memo<DetailProps>(({ template }) => {
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
                <Text>{template.name}</Text>
            </View>
            <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text>{t('amount')}</Text>
                <Text style={{ color: template.debit ? 'red' : 'green' }}>{currencyFormat(template.amount)}</Text>
            </View>
            <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text>{t('category')}</Text>
                <GradientIcon name={template.category.icon} />
                <Text>{template.category.name}</Text>
            </View>
            <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text>{t('payment_method')}</Text>
                <GradientIcon name={template.paymentMethod.icon} />
                <Text>{template.paymentMethod.name}</Text>
            </View>
            <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text>{t('last_update')}</Text>
                <Text>{format(new Date(template.updatedAt), DISPLAY_DATE_FORMAT)}</Text>
            </View>
        </ScrollView>
    );
});

export default Detail;
