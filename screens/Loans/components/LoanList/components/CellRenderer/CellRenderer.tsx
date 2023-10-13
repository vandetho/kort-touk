import React from 'react';
import { Alert, Animated, Dimensions, StyleSheet, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { FontAwesome5 } from '@expo/vector-icons';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { Loan } from '@interfaces';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = 210;
const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome5);

const styles = StyleSheet.create({
    viewContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
        width: WIDTH - 20,
        height: HEIGHT,
        borderRadius: 15,
    },
});

interface CellRendererProps {
    item: Loan;
}

const CellRenderer = React.memo<CellRendererProps>(({ item, children, ...props }) => {
    const swipeRef = React.useRef<Swipeable>(null);
    const { projectRepository } = useDatabaseConnection();
    const animatedDelete = React.useRef(new Animated.Value(1)).current;
    const { t } = useTranslation();

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
                            backgroundColor: 'red',
                            alignItems: 'center',
                            paddingLeft: 20,
                        },
                        styles.viewContainer,
                    ]}
                >
                    <AnimatedIcon
                        name="trash"
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
                        {t('delete')}
                    </Animated.Text>
                </View>
            );
        },
        [t],
    );

    const onDelete = React.useCallback(() => {
        Alert.alert(t('confirmation'), t('do_you_want_to_delete_loan'), [
            {
                text: t('yes'),
                onPress: () => {
                    Animated.timing(animatedDelete, {
                        toValue: 0,
                        duration: 350,
                        useNativeDriver: true,
                    }).start(async () => {
                        await projectRepository.delete(item.id);
                    });
                },
            },
            {
                text: t('no'),
                onPress: () => {
                    swipeRef.current.close();
                },
            },
        ]);
    }, [animatedDelete, item.id, projectRepository, t]);

    return (
        <Swipeable
            renderLeftActions={swipeLeft}
            onSwipeableLeftWillOpen={onDelete}
            useNativeAnimations
            ref={swipeRef}
            {...props}
        >
            <Animated.View>{children}</Animated.View>
        </Swipeable>
    );
});

export default CellRenderer;
