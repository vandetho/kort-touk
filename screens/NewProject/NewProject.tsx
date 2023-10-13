import React from 'react';
import { Keyboard, SafeAreaView, TouchableWithoutFeedback, View } from 'react-native';
import { CurrencyPicker, Header, TextField } from '@components';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Currency } from '@interfaces';
import { colorCodeGenerator, showToast } from '@utils';
import { useCategories, usePaymentMethods, useProjects } from '@contexts';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';

interface NewProjectProps {}

const NewProject: React.FunctionComponent<NewProjectProps> = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { addProject, projects } = useProjects();
    const { allCategories } = useCategories();
    const { allPaymentMethods } = usePaymentMethods();
    const { projectRepository } = useDatabaseConnection();
    const [dispatch, setDispatch] = React.useState(false);
    const [state, setState] = React.useState<{ name: string; currency: Currency }>({ name: '', currency: 'USD' });

    const onChangeName = React.useCallback((text: string) => {
        setState((prevState) => ({ ...prevState, name: text }));
    }, []);

    const onChangeCurrency = React.useCallback((currency: Currency | undefined) => {
        setState((prevState) => ({ ...prevState, currency: currency || 'USD' }));
    }, []);

    const onPressSend = React.useCallback(async () => {
        const name = state.name.trim();
        if (!name) {
            showToast(t('project_name_required'));
            return;
        }
        setDispatch(true);
        const project = await projectRepository.save({
            color: colorCodeGenerator(),
            name,
            currency: state.currency,
            archived: false,
            monthlyExpense: false,
            trackTransaction: true,
            balances: 0,
            sort: projects.length,
            categories: allCategories,
            paymentMethods: allPaymentMethods,
        });
        addProject(project);
        showToast(t('project_added', { name: name }));
        navigation.goBack();
        setDispatch(false);
    }, [
        addProject,
        allCategories,
        allPaymentMethods,
        navigation,
        projectRepository,
        projects.length,
        state.currency,
        state.name,
        t,
    ]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ padding: 20, flex: 1 }}>
                    <Header
                        headerRightIcon="check"
                        goBackTitle={t('back')}
                        loadingRightButton={dispatch}
                        disabledBack={dispatch}
                        headerRightTitle={t('save')}
                        onRightButtonPress={onPressSend}
                    />
                    <View style={{ paddingVertical: 20 }}>
                        <TextField
                            label={t('project_name')}
                            name="name"
                            value={state.name}
                            onChangeText={onChangeName}
                        />
                        <View style={{ marginTop: 40 }}>
                            <CurrencyPicker selected={state.currency} onValueChange={onChangeCurrency} />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default NewProject;
