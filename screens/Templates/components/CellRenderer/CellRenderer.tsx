import React from 'react';
import { Alert, Animated, Dimensions, StyleSheet, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { useTemplate } from '@contexts/TemplateContext';
import { TemplateStackParamList } from '@navigations/TemplateNavigator/TemplateNavigator';
import Template from '@models/Template';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = 110;
const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons);

const styles = StyleSheet.create({
    viewContainer: {
        flexDirection: 'row',
        width: WIDTH - 20,
        height: HEIGHT,
        borderRadius: 20,
    },
});

type TemplateScreenNavigationProps = NativeStackNavigationProp<TemplateStackParamList, 'Template'>;

interface CellRendererProps {
    item: Template;
}

const CellRenderer = React.memo<CellRendererProps>(({ item, children, ...props }) => {
    const swipeRef = React.useRef<Swipeable>(null);
    const { templateRepository } = useDatabaseConnection();
    const animatedDelete = React.useRef(new Animated.Value(1)).current;
    const navigation = useNavigation<TemplateScreenNavigationProps>();
    const { t } = useTranslation();
    const { onSelect } = useTemplate();

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

    const swipeRight = React.useCallback(
        (_: Animated.AnimatedInterpolation, dragX: Animated.AnimatedInterpolation) => {
            const scale = dragX.interpolate({
                inputRange: [-200, 0],
                outputRange: [1, 0.5],
                extrapolate: 'clamp',
            });
            return (
                <Animated.View
                    style={[
                        {
                            backgroundColor: 'red',
                            alignItems: 'center',
                            paddingRight: 20,
                            opacity: animatedDelete.interpolate({
                                inputRange: [-200, 0],
                                outputRange: [1, 0.5],
                            }),
                            transform: [
                                {
                                    scale: animatedDelete,
                                },
                            ],
                        },
                        styles.viewContainer,
                    ]}
                >
                    <Animated.Text
                        style={{
                            marginLeft: 'auto',
                            marginRight: 10,
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: '#FFFFFF',
                            transform: [{ scale }],
                        }}
                    >
                        {t('delete')}
                    </Animated.Text>
                    <AnimatedIcon
                        name="delete"
                        size={26}
                        color="#FFFFFF"
                        style={{
                            transform: [{ scale }],
                        }}
                    />
                </Animated.View>
            );
        },
        [animatedDelete, t],
    );

    const onEdit = React.useCallback(() => {
        onSelect(item);
        navigation.navigate('Template', { edit: true });
        if (swipeRef.current) {
            swipeRef.current.close();
        }
    }, [item, navigation, onSelect]);

    const onDelete = React.useCallback(() => {
        Alert.alert(t('confirmation'), t('do_you_want_to_delete_template'), [
            {
                text: t('yes'),
                onPress: () => {
                    Animated.timing(animatedDelete, {
                        toValue: 0,
                        duration: 350,
                        useNativeDriver: true,
                    }).start(async () => {
                        await templateRepository.delete(item.id);
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
    }, [animatedDelete, item.id, t, templateRepository]);

    return (
        <Swipeable
            renderLeftActions={swipeLeft}
            onSwipeableLeftWillOpen={onEdit}
            useNativeAnimations
            renderRightActions={swipeRight}
            onSwipeableRightWillOpen={onDelete}
            ref={swipeRef}
            {...props}
        >
            <Animated.View>{children}</Animated.View>
        </Swipeable>
    );
});

export default CellRenderer;
