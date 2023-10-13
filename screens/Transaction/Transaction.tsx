import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Header } from '@components';
import { useTranslation } from 'react-i18next';
import { useTransaction } from '@contexts';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Detail, EditForm, EditFormRefProps } from './components';
import { ApplicationStackParamsList } from '@navigations/ApplicationNavigator/ApplicationNavigator';

type TransactionScreenParamsProps = RouteProp<ApplicationStackParamsList, 'Transaction'>;

interface TransactionProps {}

const Transaction: React.FunctionComponent<TransactionProps> = () => {
    const { t } = useTranslation();
    const { transaction, onSelect } = useTransaction();
    const formRef = React.useRef<EditFormRefProps>(null);
    const {
        params: { edit },
    } = useRoute<TransactionScreenParamsProps>();
    const [index, setIndex] = React.useState(edit ? 1 : 0);

    const onEdit = React.useCallback(() => {
        if (formRef.current) {
            if (index) {
                formRef.current.collapse();
                setIndex(0);
                return;
            }
            formRef.current.expend();
            setIndex(1);
        }
    }, [index]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 20 }}>
                <Header
                    onRightButtonPress={onEdit}
                    goBackTitle={t('back')}
                    headerRightIcon="edit"
                    headerRightTitle={t('edit')}
                />
            </View>
            <Detail transaction={transaction} />
            <EditForm
                index={index}
                transaction={transaction}
                onChangeIndex={setIndex}
                onEdited={onSelect}
                ref={formRef}
            />
        </SafeAreaView>
    );
};

export default Transaction;
