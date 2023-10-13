import React from 'react';
import { Dimensions, FlatList, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { normalizeHeight } from '@utils';
import { useTemplatesFetcher } from '@fetchers';
import { useTranslation } from 'react-i18next';
import { Header, TemplateCard, Text } from '@components';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from 'react-native-screens/native-stack';
import { useTemplate } from '@contexts/TemplateContext';
import { ApplicationStackParamsList } from '@navigations/ApplicationNavigator/ApplicationNavigator';
import Template from '@models/Template';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height * 0.9;
const ICON_CONTAINER_WIDTH = WIDTH * 0.15;
const ICON_CONTAINER_HEIGHT = WIDTH * 0.15;
const TEXT_CONTAINER_WIDTH = WIDTH * 0.55;
const CHEVRON_CONTAINER_WIDTH = WIDTH * 0.2;
const BORDER_RADIUS = 20;

const ITEM_HEIGHT = 110;

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: normalizeHeight(20),
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        borderBottomWidth: 1,
    },
    iconContainer: {
        width: ICON_CONTAINER_WIDTH,
        height: ICON_CONTAINER_HEIGHT,
        borderRadius: ICON_CONTAINER_WIDTH / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    textContainer: {
        width: TEXT_CONTAINER_WIDTH,
    },
    chevronContainer: {
        width: CHEVRON_CONTAINER_WIDTH,
        alignItems: 'flex-end',
    },
    scrollableModal: {
        height: HEIGHT,
        paddingVertical: 20,
        borderTopRightRadius: BORDER_RADIUS,
        borderTopLeftRadius: BORDER_RADIUS,
    },
    homeBar: {
        height: 5,
        width: 75,
        alignSelf: 'center',
        borderRadius: 2.5,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    close: {
        width: 75,
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 5,
        borderRadius: 75 / 2,
        marginBottom: 25,
    },
});

interface MenuModalProps {
    visible: boolean;
    onClose?: () => void;
}

type NewTransactionScreenNavigationProp = NativeStackScreenProps<
    ApplicationStackParamsList,
    'NewTransaction'
>['navigation'];

const MenuModal: React.FunctionComponent<MenuModalProps> = ({ visible, onClose }) => {
    const { colors } = useTheme();
    const navigation = useNavigation<NewTransactionScreenNavigationProp>();
    const { onSelect } = useTemplate();
    const { t } = useTranslation();
    const { templates, reload } = useTemplatesFetcher();
    const [state, setState] = React.useState({
        scrollOffset: 0,
        scrollEnabled: true,
    });

    React.useEffect(() => {
        if (visible) {
            (async () => await reload())();
        }
    }, [reload, visible]);

    const onPress = React.useCallback(
        (template?: Template) => {
            onSelect(template);
            navigation.navigate('NewTransaction');
            onClose();
        },
        [navigation, onClose, onSelect],
    );

    const renderItem = React.useCallback(
        ({ item }: { item: Template | { name: string } }) =>
            item instanceof Template ? (
                <TemplateCard template={item} onPress={onPress} />
            ) : (
                <TouchableWithoutFeedback onPress={() => onPress()}>
                    <View
                        style={{
                            paddingHorizontal: 20,
                            width: WIDTH - 20,
                            height: ITEM_HEIGHT,
                            borderRadius: 15,
                            backgroundColor: colors.card,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <MaterialIcons name="add" color={colors.text} size={60} />
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                    </View>
                </TouchableWithoutFeedback>
            ),
        [colors.card, colors.text, onPress],
    );

    const Separator = React.useCallback(() => <View style={{ height: 10 }} />, []);

    const keyExtractor = React.useCallback((_: Template, index: number) => `new-transaction-list-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }),
        [],
    );

    const onScroll = React.useCallback((event) => {
        if (event && event.nativeEvent && event.nativeEvent.contentOffset) {
            setState((prevState) => ({
                ...prevState,
                scrollOffset: event.nativeEvent.contentOffset.y,
            }));
        }
    }, []);

    const onContentSizeChange = React.useCallback((contentWidth, contentHeight) => {
        setState((prevState) => ({ ...prevState, scrollEnabled: contentHeight > HEIGHT }));
    }, []);

    const items = React.useMemo(
        (): Array<{ name: string } | Template> => [
            {
                name: t('new_transaction'),
            },
            ...templates,
        ],
        [t, templates],
    );

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection={['down']}
            scrollTo={onScroll}
            scrollOffset={state.scrollOffset}
            scrollOffsetMax={0}
            propagateSwipe={true}
            style={styles.modal}
        >
            <View style={[styles.scrollableModal, { backgroundColor: colors.background }]}>
                <View style={{ paddingHorizontal: 20 }}>
                    <Header onGoBack={onClose} goBackIcon="times" goBackTitle={t('close')} />
                </View>
                <FlatList
                    scrollEnabled={state.scrollEnabled}
                    data={items}
                    renderItem={renderItem}
                    ItemSeparatorComponent={Separator}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={onContentSizeChange}
                    keyExtractor={keyExtractor}
                    getItemLayout={getItemLayout}
                    contentContainerStyle={{
                        alignItems: 'center',
                        paddingVertical: 10,
                    }}
                />
            </View>
        </Modal>
    );
};

export default MenuModal;
