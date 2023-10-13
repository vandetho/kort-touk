import React from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useApplication, useCategories } from '@contexts';
import { GradientIcon, Header, Text } from '@components';
import { useTranslation } from 'react-i18next';
import { useNavigation, useTheme } from '@react-navigation/native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import Category from '@models/Category';
import { showToast } from '@utils';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingStackParamsList } from '@navigations';

const ITEM_HEIGHT = 60;

type NewCategoryScreenNavigationProps = NativeStackNavigationProp<SettingStackParamsList, 'NewCategory'>;

interface CategoriesProps {}

const Categories = React.memo<CategoriesProps>(() => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { isLite } = useApplication();
    const { allCategories } = useCategories();
    const navigation = useNavigation<NewCategoryScreenNavigationProps>();
    const { categoryRepository } = useDatabaseConnection();
    const [state, setState] = React.useState(allCategories);

    const renderItem = React.useCallback(
        ({ item, drag, isActive }: RenderItemParams<Category>) => {
            return (
                <ScaleDecorator>
                    <TouchableOpacity
                        style={{
                            height: ITEM_HEIGHT,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingHorizontal: 15,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.border,
                        }}
                        disabled={isActive}
                        onLongPress={drag}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <GradientIcon name="sort" />
                            <Text style={{ marginLeft: 20 }}>{item.name}</Text>
                        </View>
                        <GradientIcon name={item.icon} />
                    </TouchableOpacity>
                </ScaleDecorator>
            );
        },
        [colors.border],
    );

    const keyExtractor = React.useCallback((item) => `categories-item-${item.id}`, []);

    const onDragEnd = React.useCallback(({ data }) => setState(data), []);

    const onPressAdd = React.useCallback(() => {
        navigation.navigate('NewCategory');
    }, [navigation]);

    const onSave = React.useCallback(async () => {
        const categories = [...state];
        for (let i = 0; i < categories.length; ++i) {
            categories[i].sort = i;
        }
        await categoryRepository.update(categories);
        showToast(t('categories_updated'));
    }, [categoryRepository, state, t]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 10 }}>
                <Header
                    goBackTitle={t('back')}
                    headerRightIcon="check"
                    onMiddleButtonPress={isLite ? undefined : onPressAdd}
                    headerMiddleIcon="plus"
                    headerMiddleTitle={t('add')}
                    headerRightTitle={t('save')}
                    onRightButtonPress={onSave}
                />
            </View>
            <DraggableFlatList
                data={state}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onDragEnd={onDragEnd}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 75 }}
            />
        </SafeAreaView>
    );
});

export default Categories;
