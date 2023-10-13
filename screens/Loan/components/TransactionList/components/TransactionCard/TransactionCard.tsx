import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoanStackParamList } from '@navigations/LoanNavigator';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Text } from '@components';
import { format } from 'date-fns';
import { DISPLAY_DATE_FORMAT } from '@config';
import Transaction from '@models/Transaction';
import { useLoans } from '@contexts';
import { useTranslation } from 'react-i18next';
import { currencyFormat } from '@utils';
import { color } from '@theme/colors';

type LoanScreenNavigationProps = NativeStackNavigationProp<LoanStackParamList, 'Loan'>;

interface ProjectCardProps {
    currentDate: Date;
    index: number;
    height: number;
    transaction: Transaction;
}

const TransactionCard = React.memo<ProjectCardProps>(({ currentDate, height, index, transaction }) => {
    const { colors } = useTheme();
    const { loan } = useLoans();
    const { t } = useTranslation();
    const navigation = useNavigation<LoanScreenNavigationProps>();

    const disabled = React.useMemo(() => currentDate.getTime() > transaction.doneAt, [currentDate, transaction.doneAt]);

    const onPress = React.useCallback(() => {
        navigation.navigate('Loan');
    }, [navigation]);

    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            style={{
                backgroundColor: disabled ? colors.border : colors.card,
                opacity: disabled ? 0.5 : 1,
                height,
                borderRadius: 15,
                marginHorizontal: 10,
                padding: 10,
            }}
        >
            <View style={{ paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text bold>{transaction.name}</Text>
                <Text bold style={{ color: transaction.debit ? color.red : color.green }}>
                    {currencyFormat(Math.abs(transaction.amount), loan.currency)}
                </Text>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Text>{t('scheduled_for')}</Text>
                <Text>{t('created_on')}</Text>
                <Text>{t('last_update')}</Text>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Text>{format(transaction.doneAt, DISPLAY_DATE_FORMAT)}</Text>
                <Text>{format(transaction.createdAt, DISPLAY_DATE_FORMAT)}</Text>
                <Text>{format(transaction.updatedAt, DISPLAY_DATE_FORMAT)}</Text>
            </View>
            <Text bold>{t('loan_period', { period: index })}</Text>
        </TouchableOpacity>
    );
});

export default TransactionCard;
