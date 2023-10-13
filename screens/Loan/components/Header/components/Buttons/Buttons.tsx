import React from 'react';
import { View } from 'react-native';
import { Header as BackHeader } from '@components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoanStackParamList } from '@navigations/LoanNavigator';
import { useTranslation } from 'react-i18next';

type NewLoanPeriodScreenNavigationProps = NativeStackNavigationProp<LoanStackParamList, 'NewLoanPeriod'>;

interface ButtonsProps {}

const Buttons = React.memo<ButtonsProps>(() => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NewLoanPeriodScreenNavigationProps>();
    const { t } = useTranslation();

    const onPressNewPeriod = React.useCallback(() => {
        navigation.navigate('NewLoanPeriod');
    }, [navigation]);

    return (
        <View
            style={{
                position: 'absolute',
                zIndex: 2,
                top: insets.top,
                left: 10,
                right: 10,
            }}
        >
            <BackHeader
                goBackTitle={t('back')}
                headerRightIcon="plus"
                headerRightTitle={t('new_payment_period')}
                withBackground={false}
                textColor="#000000"
                iconColor="#000000"
                onRightButtonPress={onPressNewPeriod}
            />
        </View>
    );
});

export default Buttons;
