import React from 'react';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { useCategories, useProjects } from '@contexts';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, View } from 'react-native';
import { Button, CheckItem, Header } from '@components';
import { useTranslation } from 'react-i18next';
import Category from '@models/Category';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { showToast } from '@utils';

interface ProjectCategoriesProps {}

const ProjectCategories = React.memo<ProjectCategoriesProps>(() => {
    const [selectedCategories, setSelectedCategories] = React.useState<{ [key: number]: Category }>({});
    const insets = useSafeAreaInsets();
    const { project } = useProjects();
    const { projectRepository } = useDatabaseConnection();
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const { allCategories, categories, onUpdateSelectedCategories } = useCategories();
    const [isSelectAll, setIsSelectAll] = React.useState(true);
    const { t } = useTranslation();
    const { colors } = useTheme();

    useFocusEffect(
        React.useCallback(() => {
            return (): void => {
                setSelectedCategories([]);
            };
        }, []),
    );

    React.useEffect((): void => {
        const data = {};
        categories.forEach((category) => {
            data[category.id] = category;
        });
        setSelectedCategories(data);
        setIsSelectAll(Object.keys(data).length !== allCategories.length);
    }, [allCategories.length, categories]);

    const onPress = React.useCallback(
        (category: Category): void => {
            const data = { ...selectedCategories };
            if (data[category.id]) {
                delete data[category.id];
            } else {
                data[category.id] = category;
            }
            setIsSelectAll(Object.keys(data).length !== allCategories.length);
            setSelectedCategories(data);
        },
        [allCategories.length, selectedCategories],
    );

    const onPressButton = React.useCallback((): void => {
        const data = {};
        if (isSelectAll) {
            allCategories.forEach((category) => {
                data[category.id] = category;
            });
        }
        setIsSelectAll((prevState) => !prevState);
        setSelectedCategories(data);
    }, [allCategories, isSelectAll]);

    const onSave = React.useCallback(async () => {
        project.categories = Object.values(selectedCategories);
        await projectRepository.update(project);
        onUpdateSelectedCategories(project.categories);
        showToast(t('project_category_updated'));
    }, [onUpdateSelectedCategories, project, projectRepository, selectedCategories, t]);

    const renderItem = React.useCallback(
        ({ item }: { item: Category }): JSX.Element => {
            return (
                <CheckItem item={item} checked={!!selectedCategories[item.id]} color={colors.text} onPress={onPress} />
            );
        },
        [colors.text, onPress, selectedCategories],
    );

    const onScroll = React.useCallback(
        ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
            const y = nativeEvent.contentOffset.y;

            if (y >= 0 && y <= nativeEvent.contentSize.height - nativeEvent.layoutMeasurement.height) {
                animatedValue.setValue(y);
            }
        },
        [animatedValue],
    );

    const Separator = React.useCallback(
        (): JSX.Element => <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border }} />,
        [colors.border],
    );

    const keyExtractor = React.useCallback((item: Category): string => `categories-${item.id}`, []);

    const getItemLayout = React.useCallback((_, index: number) => ({ length: 40, offset: 40 * index, index }), []);

    return (
        <SafeAreaView>
            <Animated.View
                style={{
                    backgroundColor: colors.background,
                    position: 'absolute',
                    zIndex: 1,
                    top: insets.top,
                    left: 0,
                    right: 0,
                    transform: [
                        {
                            translateY: Animated.diffClamp(animatedValue, 0, 60).interpolate({
                                inputRange: [0, 60],
                                outputRange: [0, -180],
                            }),
                        },
                    ],
                }}
            >
                <Header
                    goBackTitle={t('back')}
                    onRightButtonPress={onSave}
                    headerRightTitle={t('save')}
                    headerRightIcon="check"
                />
                <Button
                    label={isSelectAll ? t('select_all') : t('unselect_all')}
                    onPress={onPressButton}
                    style={{ marginVertical: 10 }}
                />
            </Animated.View>
            <Animated.FlatList
                data={allCategories}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ItemSeparatorComponent={Separator}
                getItemLayout={getItemLayout}
                scrollEventThrottle={16}
                onScroll={onScroll}
                contentContainerStyle={{
                    paddingBottom: 20,
                    paddingTop: 100,
                    flexGrow: 1,
                }}
            />
        </SafeAreaView>
    );
});

export default ProjectCategories;
