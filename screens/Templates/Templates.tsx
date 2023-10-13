import React from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { FlatList, SafeAreaView, View } from 'react-native';
import { TemplateCard } from '@components';
import { useTemplatesFetcher } from '@fetchers';
import { useTemplate } from '@contexts/TemplateContext';
import { CellRenderer } from './components';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { TemplateStackParamList } from '@navigations/TemplateNavigator/TemplateNavigator';
import Template from '@models/Template';
import EmptyTemplateList from '@components/EmptyTemplateList/EmptyTemplateList';

type TemplateScreenNavigationProps = NativeStackNavigationProp<TemplateStackParamList, 'Template'>;

interface TemplatesProps {}

const Templates: React.FunctionComponent<TemplatesProps> = () => {
    const navigation = useNavigation<TemplateScreenNavigationProps>();
    const isFocused = useIsFocused();
    const { onSelect } = useTemplate();
    const { templates, reload } = useTemplatesFetcher();

    React.useEffect(() => {
        if (isFocused) {
            (async () => await reload())();
        }
    }, [isFocused, reload]);

    const onPress = React.useCallback(
        (template: Template) => {
            onSelect(template);
            navigation.navigate('Template', { edit: false });
        },
        [navigation, onSelect],
    );

    const renderItem = React.useCallback(
        ({ item }: { item: Template }) => <TemplateCard template={item} onPress={onPress} />,
        [onPress],
    );

    const Cell = React.useCallback((props) => {
        return <CellRenderer {...props} />;
    }, []);

    const Separator = React.useCallback(() => <View style={{ height: 10 }} />, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            length: 110,
            offset: (10 + 110) * index,
            index,
        }),
        [],
    );

    const keyExtractor = React.useCallback((_: Template, index: number) => `templates-list-item-${index}`, []);

    return (
        <SafeAreaView>
            <FlatList
                data={templates}
                renderItem={renderItem}
                ItemSeparatorComponent={Separator}
                CellRendererComponent={Cell}
                getItemLayout={getItemLayout}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={EmptyTemplateList}
                keyExtractor={keyExtractor}
                contentContainerStyle={{
                    alignItems: 'center',
                    paddingVertical: 10,
                    flexGrow: 1,
                }}
            />
        </SafeAreaView>
    );
};

export default Templates;
