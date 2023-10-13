import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { GradientIcon } from '@components/Gradient';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Text } from '@components/Text';

const BUTTON_SIZE = 40;
const BUTTON_RADIUS = BUTTON_SIZE / 2;

interface BackButtonProps {
    icon?: string;
    label?: string;
}

const BackButton = React.memo<BackButtonProps>(({ icon = 'chevron-left', label }) => {
    const { colors } = useTheme();
    const navigation = useNavigation();

    const onPress = React.useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <TouchableOpacity style={{ position: 'absolute', top: 50, left: 20, zIndex: 1 }} onPress={onPress}>
            <View
                style={{
                    backgroundColor: colors.card,
                    height: BUTTON_SIZE,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: BUTTON_RADIUS,
                    width: BUTTON_SIZE,
                }}
            >
                <GradientIcon name={icon} size={24} />
                {label && <Text style={{ marginHorizontal: 10 }}>{label}</Text>}
            </View>
        </TouchableOpacity>
    );
});

export default BackButton;
