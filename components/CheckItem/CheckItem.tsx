import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '../Text';
import { GradientIcon } from '@components/Gradient';

const styles = StyleSheet.create({
    itemContainer: {
        paddingHorizontal: 20,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

interface CheckItemProps<T> {
    item: T;
    checked: boolean;
    color: string;
    onPress: (item: T) => void;
}

const CheckItem = React.memo<CheckItemProps<any>>(({ item, checked, color, onPress }) => (
    <TouchableWithoutFeedback onPress={(): void => onPress(item)}>
        <View style={styles.itemContainer}>
            <Text style={{ color: color }}>{item.name}</Text>
            <View
                style={{
                    width: 75,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <GradientIcon name={item.icon} />
                {checked && <MaterialIcons name="check" size={24} color={color} />}
            </View>
        </View>
    </TouchableWithoutFeedback>
));

export default CheckItem;
