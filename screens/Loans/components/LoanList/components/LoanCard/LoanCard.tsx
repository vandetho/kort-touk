import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoanStackParamList } from '@navigations/LoanNavigator';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Text } from '@components';
import { format } from 'date-fns';
import { DISPLAY_DATE_FORMAT } from '@config';
import { currencyFormat } from '@utils';
import { useLoans } from '@contexts';
import { useTranslation } from 'react-i18next';
import { Loan } from '@interfaces';
import { color } from '@theme/colors';

type LoanScreenNavigationProps = NativeStackNavigationProp<LoanStackParamList, 'Loan'>;

interface LoanCardProps {
    loan: Loan;
    index: number;
    height: number;
}

const LoanCard = React.memo<LoanCardProps>(({ loan, index, height }) => {
    const { colors } = useTheme();
    const { onSelect } = useLoans();
    const { t } = useTranslation();
    const navigation = useNavigation<LoanScreenNavigationProps>();

    const onPress = React.useCallback(() => {
        onSelect(loan, index);
        navigation.navigate('Loan');
    }, [index, navigation, onSelect, loan]);

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: colors.card,
                height,
                borderRadius: 15,
                padding: 15,
            }}
        >
            <View style={{ paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>{loan.name}</Text>
                <Text style={{ color: loan.nextTransaction.debit ? color.red : color.green }}>
                    {currencyFormat(Math.abs(loan.balances), loan.currency)}
                </Text>
            </View>
            <View style={{ paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>{t('next_payment')}</Text>
                <Text style={{ color: loan.nextTransaction.debit ? color.red : color.green }}>
                    {loan.nextTransaction ? currencyFormat(Math.abs(loan.nextTransaction?.amount), loan.currency) : '-'}
                </Text>
            </View>
            <View style={{ paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>{t('next_payment_on')}</Text>
                <Text>{loan.nextTransaction ? format(loan.nextTransaction.doneAt, DISPLAY_DATE_FORMAT) : '-'}</Text>
            </View>
            <View style={{ paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>{t('remain_amount')}</Text>
                <Text>{loan.remains ? currencyFormat(Math.abs(loan.remains), loan.currency) : '-'}</Text>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Text>{t('started_on')}</Text>
                <Text>{t('ended_on')}</Text>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Text>{format(loan.createdAt, DISPLAY_DATE_FORMAT)}</Text>
                <Text>{format(loan.updatedAt, DISPLAY_DATE_FORMAT)}</Text>
            </View>
        </TouchableOpacity>
    );
});

export default LoanCard;
