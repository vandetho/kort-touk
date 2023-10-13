import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Header } from '@components';
import { useTranslation } from 'react-i18next';
import { useTemplate } from '@contexts';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Detail, EditForm, EditFormRefProps } from './components';
import { TemplateStackParamList } from '@navigations/TemplateNavigator/TemplateNavigator';

type TemplateScreenParamsProps = RouteProp<TemplateStackParamList, 'Template'>;

interface TemplateProps {}

const Template: React.FunctionComponent<TemplateProps> = () => {
    const { t } = useTranslation();
    const { template, onSelect } = useTemplate();
    const {
        params: { edit },
    } = useRoute<TemplateScreenParamsProps>();
    const formRef = React.useRef<EditFormRefProps>(null);
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

    if (template === undefined) {
        return null;
    }

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
            <Detail template={template} />
            <EditForm template={template} onChangeIndex={setIndex} index={index} onEdited={onSelect} ref={formRef} />
        </SafeAreaView>
    );
};

export default Template;
