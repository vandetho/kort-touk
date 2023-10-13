import React from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { useTransaction } from '@contexts/TransactionContext';
import { normalizeHeight } from '@utils';
import { ApplicationStackParamsList } from '@navigations/ApplicationNavigator';
import Transaction from '@models/Transaction';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = normalizeHeight(125);
const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons);

const styles = StyleSheet.create({
    viewContainer: {
        flexDirection: 'row',
        width: WIDTH - 20,
        height: HEIGHT,
        borderRadius: 20,
    },
});

type TransactionScreenNavigationProps = NativeStackNavigationProp<ApplicationStackParamsList, 'Transaction'>;

interface CellRendererProps {
    item: Transaction;
}

const CellRenderer = React.memo<CellRendererProps>(({ item, children, ...props }) => {
    const swipeRef = React.useRef<Swipeable>(null);
    const navigation = useNavigation<TransactionScreenNavigationProps>();
    const { t } = useTranslation();
    const { onSelect } = useTransaction();

    const swipeLeft = React.useCallback(
        (_: Animated.AnimatedInterpolation, dragX: Animated.AnimatedInterpolation) => {
            const scale = dragX.interpolate({
                inputRange: [0, 200],
                outputRange: [0.5, 1],
                extrapolate: 'clamp',
            });
            return (
                <View
                    style={[
                        {
                            backgroundColor: 'blue',
                            alignItems: 'center',
                            paddingLeft: 20,
                        },
                        styles.viewContainer,
                    ]}
                >
                    <AnimatedIcon
                        name="edit"
                        size={26}
                        color="#FFFFFF"
                        style={{
                            transform: [{ scale }],
                        }}
                    />
                    <Animated.Text
                        style={{
                            marginRight: 'auto',
                            marginLeft: 10,
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: '#FFFFFF',
                            transform: [{ scale }],
                        }}
                    >
                        {t('edit')}
                    </Animated.Text>
                </View>
            );
        },
        [t],
    );

    const onEdit = React.useCallback(() => {
        onSelect(item);
        navigation.navigate('Transaction', { edit: true });
        if (swipeRef.current) {
            swipeRef.current.close();
        }
    }, [item, navigation, onSelect]);

    return (
        <Swipeable
            renderLeftActions={swipeLeft}
            onSwipeableLeftWillOpen={onEdit}
            useNativeAnimations
            ref={swipeRef}
            {...props}
        >
            <Animated.View>{children}</Animated.View>
        </Swipeable>
    );
});

export default CellRenderer;
