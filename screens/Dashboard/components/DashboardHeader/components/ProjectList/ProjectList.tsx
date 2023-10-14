import React from 'react';
import { Animated, FlatList, useWindowDimensions, View } from 'react-native';
import {
    Directions,
    FlingGestureHandler,
    FlingGestureHandlerEventPayload,
    HandlerStateChangeEvent,
    State,
} from 'react-native-gesture-handler';
import { useProjects, useSearch } from '@contexts';
import { CARD_HEIGHT, ProjectCard } from './components';
import Project from '@models/Project';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';

const VISIBLE_ITEMS = 3;

interface ProjectListProps {}

const ProjectListComponent: React.FunctionComponent<ProjectListProps> = () => {
    const { width } = useWindowDimensions();
    const { projects, onSelect } = useProjects();
    const { projectRepository } = useDatabaseConnection();
    const { from, to, isSearch } = useSearch();
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const scrollXIndex = React.useRef(new Animated.Value(0)).current;
    const scrollXAnimated = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.spring(scrollXAnimated, {
            toValue: scrollXIndex,
            speed: 10,
            useNativeDriver: true,
        }).start();
    }, [scrollXAnimated, scrollXIndex]);

    React.useEffect(() => {
        onSelect(projects[currentIndex], currentIndex);
    }, [currentIndex, onSelect, projects]);

    const setActiveIndex = React.useCallback(
        (activeIndex: number) => {
            scrollXIndex.setValue(activeIndex);
            setCurrentIndex(activeIndex);
        },
        [scrollXIndex],
    );

    const items = React.useMemo(() => {
        const items: Project[] = projects ? projects.filter((project) => !project.archived) : [];
        if (items.length > 0) {
            return items;
        }
        items.push(
            projectRepository.create({
                sort: projects.length,
                name: 'New Project',
                archived: false,
                currency: 'USD',
                color: '',
                trackTransaction: true,
                monthlyExpense: false,
                balances: 0,
                categories: [],
                paymentMethods: [],
            }),
        );

        return items;
    }, [ projectRepository, projects]);

    const onHandlerLeftDirectionChange = React.useCallback(
        (event: HandlerStateChangeEvent<FlingGestureHandlerEventPayload>) => {
            if (event.nativeEvent.state === State.END) {
                if (currentIndex === items.length - 1) {
                    return;
                }
                setActiveIndex(currentIndex + 1);
            }
        },
        [currentIndex, items.length, setActiveIndex],
    );

    const onHandlerRightDirectionChange = React.useCallback(
        (event: HandlerStateChangeEvent<FlingGestureHandlerEventPayload>) => {
            if (event.nativeEvent.state === State.END) {
                if (currentIndex === 0) {
                    return;
                }
                setActiveIndex(currentIndex - 1);
            }
        },
        [currentIndex, setActiveIndex],
    );

    const renderItem = React.useCallback(
        ({ item, index }: { item: Project; index: number }) => (
            <ProjectCard
                isSearch={isSearch}
                from={from}
                to={to}
                project={item}
                index={index}
                visibleItems={VISIBLE_ITEMS}
                scrollXAnimated={scrollXAnimated}
            />
        ),
        [from, isSearch, scrollXAnimated, to],
    );

    const CellRenderer = React.useCallback(
        ({ item, index, children, style, ...props }) => {
            const newStyle = [style, { zIndex: projects.length - index, backgroundColor: 'red' }];
            return (
                <View style={newStyle} {...props}>
                    {children}
                </View>
            );
        },
        [projects.length],
    );

    const keyExtractor = React.useCallback((_: Project, index: number) => `project-list-${index}`, []);

    return (
        <View style={{ height: CARD_HEIGHT + 20 }}>
            <FlingGestureHandler
                key="left"
                direction={Directions.LEFT}
                onHandlerStateChange={onHandlerLeftDirectionChange}
            >
                <FlingGestureHandler
                    key="right"
                    direction={Directions.RIGHT}
                    onHandlerStateChange={onHandlerRightDirectionChange}
                >
                    <FlatList
                        data={items}
                        renderItem={renderItem}
                        horizontal
                        keyExtractor={keyExtractor}
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={false}
                        removeClippedSubviews={false}
                        CellRendererComponent={CellRenderer}
                        contentContainerStyle={{
                            width,
                            justifyContent: 'center',
                            paddingVertical: 10,
                        }}
                    />
                </FlingGestureHandler>
            </FlingGestureHandler>
        </View>
    );
};

export const ProjectList = React.memo(ProjectListComponent);
