import React from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useProjects } from '@contexts';
import Project from '@models/Project';
import { ArchivedSwitch, GradientIcon, Header, Text } from '@components';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { showToast } from '@utils';

const ITEM_HEIGHT = 60;

interface ProjectsProps {}

const Projects = React.memo<ProjectsProps>(() => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { projects, onUpdate } = useProjects();
    const { projectRepository } = useDatabaseConnection();
    const [state, setState] = React.useState(projects);

    const renderItem = React.useCallback(
        ({ item, index, drag, isActive }: RenderItemParams<Project>) => {
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
                        <ArchivedSwitch
                            value={item.archived}
                            onValueChange={() => {
                                const projects = [...state];
                                projects[index].archived = !projects[index].archived;
                                setState(projects);
                            }}
                        />
                    </TouchableOpacity>
                </ScaleDecorator>
            );
        },
        [colors.border, state],
    );

    const keyExtractor = React.useCallback((item: Project) => `projects-item-${item.id}`, []);

    const onDragEnd = React.useCallback(({ data }) => setState(data), []);

    const onSave = React.useCallback(async () => {
        const projects = [...state];
        for (let i = 0; i < projects.length; ++i) {
            projects[i].sort = i;
        }
        await projectRepository.update(projects);
        onUpdate(projects);
        showToast(t('projects_updated'));
    }, [onUpdate, projectRepository, state, t]);

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
            <DraggableFlatList
                data={state}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onDragEnd={onDragEnd}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </SafeAreaView>
    );
});

export default Projects;
