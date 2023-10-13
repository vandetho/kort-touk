import React from 'react';
import { FlatList, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import { Text } from '@components/Text';
import { CustomLinearGradient, GradientIcon } from '@components/Gradient';
import Modal from 'react-native-modal';
import { useVisible } from '@hooks';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Icons } from '@constants';
import { Header } from '@components/Header';
import { PRIMARY } from '@theme';
import { FontAwesome5 } from '@expo/vector-icons';

interface IconPickerProps {
    value: string | undefined;
    onValueChange: (icon: string) => void;
}

const IconPicker = React.memo<IconPickerProps>(({ value = 'ellipsis-h', onValueChange }) => {
    const { t } = useTranslation();
    const { height, width } = useWindowDimensions();
    const { colors } = useTheme();
    const { visible, onToggle } = useVisible();
    const [icons, setIcons] = React.useState(Icons.slice(0, 60));

    const onEndReached = React.useCallback(() => {
        if (icons.length < Icons.length) {
            setIcons([...icons, ...Icons.slice(icons.length, icons.length + 60)]);
        }
    }, [icons]);

    const renderItem = React.useCallback(
        ({ item }: { item: string }) => {
            if (item === value) {
                return (
                    <TouchableOpacity
                        onPress={() => {
                            onValueChange(item);
                            onToggle();
                        }}
                    >
                        <CustomLinearGradient
                            style={{
                                width: 75,
                                height: 75,
                                margin: 10,
                                borderRadius: 37.5,
                                borderWidth: 1,
                                borderColor: PRIMARY,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <FontAwesome5 name={item} size={40} color="#FFFFFF" />
                        </CustomLinearGradient>
                    </TouchableOpacity>
                );
            }
            return (
                <TouchableOpacity
                    onPress={() => {
                        onValueChange(item);
                        onToggle();
                    }}
                    style={{
                        width: 75,
                        height: 75,
                        margin: 10,
                        borderRadius: 37.5,
                        borderWidth: 1,
                        borderColor: PRIMARY,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <GradientIcon name={item} />
                </TouchableOpacity>
            );
        },
        [onToggle, onValueChange, value],
    );

    const keyExtractor = React.useCallback((_, index: number) => `icon-item-${index}`, []);

    const numColumns = React.useMemo(() => Math.ceil(width / 125), [width]);

    return (
        <React.Fragment>
            <TouchableWithoutFeedback onPress={onToggle}>
                <View
                    style={{
                        height: 60,
                        paddingHorizontal: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}
                >
                    <Text style={{ color: colors.text }}>{t('icon')}</Text>
                    <GradientIcon name={value} />
                </View>
            </TouchableWithoutFeedback>
            <Modal
                isVisible={visible}
                useNativeDriverForBackdrop
                propagateSwipe={true}
                style={{ height, width, margin: 0, justifyContent: 'flex-end' }}
            >
                <View style={{ height: height * 0.9, backgroundColor: colors.card, padding: 20 }}>
                    <View style={{ paddingBottom: 10 }}>
                        <Header onGoBack={onToggle} goBackTitle={t('close')} goBackIcon="times" />
                    </View>
                    <FlatList
                        data={icons}
                        renderItem={renderItem}
                        numColumns={numColumns}
                        keyExtractor={keyExtractor}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.05}
                        extraData={icons}
                        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 30 }}
                    />
                </View>
            </Modal>
        </React.Fragment>
    );
});

export default IconPicker;
