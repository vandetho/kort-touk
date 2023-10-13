import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useCategories } from '@contexts';
import { Header, IconPicker, TextField } from '@components';
import { useTranslation } from 'react-i18next';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { colorCodeGenerator, showToast } from '@utils';
import { CreateCategory } from '@interfaces';
import { useNavigation } from '@react-navigation/native';
import { ColorPicker, fromHsv } from 'react-native-color-picker';
import { HsvColor } from 'react-native-color-picker/dist/typeHelpers';

interface NewCategoryProps {}

const NewCategory = React.memo<NewCategoryProps>(() => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { allCategories, addCategory } = useCategories();
    const { categoryRepository } = useDatabaseConnection();
    const [state, setState] = React.useState<CreateCategory>({
        color: colorCodeGenerator(),
        icon: 'ellipsis-h',
        name: '',
    });

    const onSave = React.useCallback(async () => {
        if (!state.name) {
            showToast(t('category_name_required'));
            return;
        }
        if (!state.color) {
            showToast(t('category_color_required'));
            return;
        }
        const category: CreateCategory = { ...state, sort: allCategories.length };
        addCategory(await categoryRepository.save(category));
        showToast(t('category_added', { name: category.name }));
        navigation.goBack();
    }, [addCategory, allCategories.length, navigation, categoryRepository, state, t]);

    const onChangeText = React.useCallback((name: string) => {
        setState((prevState) => ({ ...prevState, name }));
    }, []);

    const onChangeColor = React.useCallback((color: HsvColor) => {
        setState((prevState) => ({ ...prevState, color: fromHsv(color) }));
    }, []);

    const onChangeIcon = React.useCallback((icon: string) => {
        setState((prevState) => ({ ...prevState, icon }));
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
                <Header
                    goBackTitle={t('back')}
                    headerRightIcon="check"
                    headerRightTitle={t('save')}
                    onRightButtonPress={onSave}
                />
            </View>
            <TextField label={t('category_name')} value={state.name} onChangeText={onChangeText} />
            <IconPicker value={state.icon} onValueChange={onChangeIcon} />
            <ColorPicker defaultColor={state.color} hideSliders onColorChange={onChangeColor} style={{ flex: 1 }} />
        </SafeAreaView>
    );
});

export default NewCategory;
