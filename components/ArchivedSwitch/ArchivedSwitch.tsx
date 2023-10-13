import React from 'react';
import { Animated, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PRIMARY } from '@theme';
import { useTheme } from '@react-navigation/native';
import { BarLoader } from '../Loader';
import { Text } from '@components/Text';

const HEIGHT = 40;
const ITEM_HEIGHT = HEIGHT - 10;
const WIDTH = 175;
const ITEM_WIDTH = WIDTH / 2 - 5;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 4,
        borderRadius: HEIGHT / 2,
        borderColor: PRIMARY,
        borderWidth: 1,
        width: WIDTH,
        height: HEIGHT,
    },
    item: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatedView: {
        position: 'absolute',
        zIndex: -1,
        top: 4,
        backgroundColor: PRIMARY,
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        borderRadius: ITEM_HEIGHT / 2,
    },
});

interface ArchivedSwitchProps {
    value: boolean;
    isLoading?: boolean;
    disabled?: boolean;
    onValueChange?: (checked: boolean) => void;
}

const ArchivedSwitch = React.memo<ArchivedSwitchProps>(
    ({ disabled = false, isLoading = false, value, onValueChange }) => {
        const { t } = useTranslation();
        const { colors } = useTheme();
        const bar = React.useRef(new Animated.Value(value ? ITEM_WIDTH + 4 : 4)).current;

        React.useEffect(() => {
            if (value) {
                return Animated.spring(bar, { toValue: ITEM_WIDTH + 4, useNativeDriver: true }).start();
            }
            return Animated.spring(bar, { toValue: 4, useNativeDriver: true }).start();
        }, [bar, value]);

        const handlePress = React.useCallback(() => {
            if (onValueChange) {
                onValueChange(!value);
            }
        }, [onValueChange, value]);

        if (isLoading) {
            return <BarLoader />;
        }

        return (
            <TouchableWithoutFeedback onPress={handlePress}>
                <View style={[styles.container, disabled && { borderColor: `${PRIMARY}80` }]}>
                    <View style={styles.item}>
                        <Text style={{ color: disabled ? colors.border : value ? colors.text : '#FFFFFF' }}>
                            {t('active')}
                        </Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={{ color: disabled ? colors.border : value ? '#FFFFFF' : colors.text }}>
                            {t('archived')}
                        </Text>
                    </View>
                    <Animated.View
                        style={[styles.animatedView, { opacity: disabled ? 0.5 : 1, transform: [{ translateX: bar }] }]}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    },
);

export default ArchivedSwitch;
