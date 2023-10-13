import React from 'react';
import Modal from 'react-native-modal';
import { FlatList, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { COUNTRY_CODE } from '@config';
import { Text } from '@components/Text';
import { useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientIcon } from '@components/Gradient/GradientIcon';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
    itemContainer: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
});

interface CountryCodePickerProps {
    visible: boolean;
    onChange: (countryCode: string) => void;
    onClose: () => void;
}

const CountryCodePicker = React.memo<CountryCodePickerProps>(({ visible, onClose, onChange }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();
    const data = React.useMemo(() => Object.values(COUNTRY_CODE), []);

    const renderItem = React.useCallback(
        ({ item }) => (
            <TouchableOpacity onPress={() => onChange(item.code)} style={styles.itemContainer}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 200 }}>
                    {item.name}
                </Text>
                <Text>{item.dialCode}</Text>
            </TouchableOpacity>
        ),
        [onChange],
    );

    const getItemLayout = React.useCallback((_, index) => ({ index, length: 40, offset: 40 * index }), []);
    const keyExtractor = React.useCallback((_, index) => `country-code-item-${index}`, []);
    const Separator = React.useCallback(
        () => <View style={{ height: 1, backgroundColor: colors.border }} />,
        [colors.border],
    );

    return (
        <Modal
            isVisible={visible}
            style={{
                margin: 0,
            }}
        >
            <View
                style={{
                    height,
                    backgroundColor: colors.card,
                }}
            >
                <View style={{ height: 80, paddingTop: insets.top, paddingHorizontal: 20 }}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={{ flexDirection: 'row', width: 100, alignItems: 'center' }}
                    >
                        <GradientIcon name="times" />
                        <Text bold style={{ marginHorizontal: 10 }}>
                            {t('close')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    getItemLayout={getItemLayout}
                    ItemSeparatorComponent={Separator}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}
                />
            </View>
        </Modal>
    );
});

export default CountryCodePicker;
