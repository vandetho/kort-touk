import React from 'react';
import { usePaymentMethods, useProjects } from '@contexts';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, View } from 'react-native';
import { Button, CheckItem, Header } from '@components';
import PaymentMethod from '@models/PaymentMethod';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { showToast } from '@utils';

interface ProjectPaymentMethodsProps {}

const ProjectPaymentMethods = React.memo<ProjectPaymentMethodsProps>(() => {
    const [selectedPaymentMethods, setSelectedPaymentMethods] = React.useState<{ [key: number]: PaymentMethod }>({});
    const [isSelectAll, setIsSelectAll] = React.useState(true);
    const { project } = useProjects();
    const insets = useSafeAreaInsets();
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const { projectRepository } = useDatabaseConnection();
    const { allPaymentMethods, paymentMethods, onUpdateSelectedPaymentMethods } = usePaymentMethods();
    const { t } = useTranslation();
    const { colors } = useTheme();

    useFocusEffect(
        React.useCallback(() => {
            return (): void => {
                setSelectedPaymentMethods([]);
            };
        }, []),
    );

    React.useEffect((): void => {
        const data = {};
        paymentMethods.forEach((paymentMethod) => {
            data[paymentMethod.id] = paymentMethod;
        });
        setSelectedPaymentMethods(data);
        setIsSelectAll(Object.keys(data).length !== allPaymentMethods.length);
    }, [allPaymentMethods.length, paymentMethods]);

    const onPress = React.useCallback(
        (paymentMethod: PaymentMethod): void => {
            const data = { ...selectedPaymentMethods };
            if (data[paymentMethod.id]) {
                delete data[paymentMethod.id];
            } else {
                data[paymentMethod.id] = paymentMethod;
            }
            setIsSelectAll(Object.keys(data).length !== allPaymentMethods.length);
            setSelectedPaymentMethods(data);
        },
        [allPaymentMethods.length, selectedPaymentMethods],
    );

    const onPressButton = React.useCallback((): void => {
        const data = {};
        if (isSelectAll) {
            allPaymentMethods.forEach((paymentMethod) => {
                data[paymentMethod.id] = paymentMethod;
            });
        }
        setIsSelectAll((prevState) => !prevState);
        setSelectedPaymentMethods(data);
    }, [isSelectAll, allPaymentMethods]);

    const onSave = React.useCallback(async () => {
        project.paymentMethods = Object.values(selectedPaymentMethods);
        await projectRepository.update(project);
        onUpdateSelectedPaymentMethods(project.paymentMethods);
        showToast(t('project_payment_method_updated'));
    }, [onUpdateSelectedPaymentMethods, project, projectRepository, selectedPaymentMethods, t]);

    const renderItem = React.useCallback(
        ({ item }: { item: PaymentMethod }): JSX.Element => {
            return (
                <CheckItem
                    item={item}
                    checked={!!selectedPaymentMethods[item.id]}
                    color={colors.text}
                    onPress={onPress}
                />
            );
        },
        [colors.text, onPress, selectedPaymentMethods],
    );

    const onScroll = React.useCallback(
        ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
            const y = nativeEvent.contentOffset.y;

            if (y >= 0 && y <= nativeEvent.contentSize.height - nativeEvent.layoutMeasurement.height) {
                animatedValue.setValue(y);
            }
        },
        [animatedValue],
    );

    const Separator = React.useCallback(
        (): JSX.Element => <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border }} />,
        [colors.border],
    );

    const keyExtractor = React.useCallback((item: PaymentMethod): string => `payment-methods-${item.id}`, []);

    const getItemLayout = React.useCallback((_, index: number) => ({ length: 40, offset: 40 * index, index }), []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Animated.View
                style={{
                    backgroundColor: colors.background,
                    position: 'absolute',
                    zIndex: 1,
                    top: insets.top,
                    left: 0,
                    right: 0,
                    transform: [
                        {
                            translateY: Animated.diffClamp(animatedValue, 0, 60).interpolate({
                                inputRange: [0, 60],
                                outputRange: [0, -180],
                            }),
                        },
                    ],
                }}
            >
                <Header
                    goBackTitle={t('back')}
                    onRightButtonPress={onSave}
                    headerRightTitle={t('save')}
                    headerRightIcon="check"
                />
                <Button
                    label={isSelectAll ? t('select_all') : t('unselect_all')}
                    onPress={onPressButton}
                    style={{ marginVertical: 10 }}
                />
            </Animated.View>
            <Animated.FlatList
                data={allPaymentMethods}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ItemSeparatorComponent={Separator}
                getItemLayout={getItemLayout}
                scrollEventThrottle={16}
                onScroll={onScroll}
                contentContainerStyle={{
                    paddingBottom: 20,
                    paddingTop: 100,
                    flexGrow: 1,
                }}
            />
        </SafeAreaView>
    );
});

export default ProjectPaymentMethods;
