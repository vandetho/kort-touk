import React from 'react';
import { NavigatorScreenParams, useTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Animated, Dimensions, GestureResponderEvent, TouchableWithoutFeedback, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FontAwesome5 } from '@expo/vector-icons';
import { DashboardScreen, FullAppVersionScreen } from '@screens';
import { PRIMARY } from '@theme';
import { TemplateNavigator, TemplateStackParamList } from '@navigations/TemplateNavigator';
import { LoanNavigator, LoanStackParamList } from '@navigations/LoanNavigator';
import { SettingNavigator, SettingStackParamsList } from '@navigations/SettingNavigator';
import { useApplication } from '@contexts';

const { width } = Dimensions.get('window');
const TAB_HEIGHT = 65;
const ICON_SIZE = 24;

type IconName = 'tachometer-alt' | 'copy' | 'money-check-alt' | 'cog';

interface BottomTabButtonProps {
    iconName: IconName;
    label: string;
    isFocused: boolean;
    onPress?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent) => void;
}

const BottomTabButton: React.FunctionComponent<BottomTabButtonProps> = ({ iconName, label, isFocused, onPress }) => {
    const viewTranslate = React.useRef(new Animated.Value(-10)).current;
    const textTranslate = React.useRef(new Animated.Value(1)).current;
    const textScale = React.useRef(new Animated.Value(1)).current;
    const textOpacity = React.useRef(new Animated.Value(1)).current;
    const { colors } = useTheme();

    const speed = 30;

    React.useEffect(() => {
        if (isFocused) {
            Animated.parallel([
                Animated.spring(viewTranslate, { toValue: -5, useNativeDriver: true, speed }),
                Animated.spring(textScale, { toValue: 1, useNativeDriver: true, speed }),
                Animated.spring(textOpacity, { toValue: 1, useNativeDriver: true, speed }),
                Animated.spring(textTranslate, { toValue: -5, useNativeDriver: true, speed }),
            ]).start();
            return;
        }

        Animated.parallel([
            Animated.spring(viewTranslate, { toValue: 0, useNativeDriver: true, speed }),
            Animated.spring(textScale, { toValue: 0.5, useNativeDriver: true, speed }),
            Animated.spring(textOpacity, { toValue: 0, useNativeDriver: true, speed }),
            Animated.spring(textTranslate, { toValue: 0, useNativeDriver: true, speed }),
        ]).start();
    }, [isFocused, textOpacity, textScale, textTranslate, viewTranslate]);

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: TAB_HEIGHT,
                    width: 50,
                }}
            >
                <Animated.View style={{ transform: [{ translateY: viewTranslate }] }}>
                    <FontAwesome5 name={iconName} size={ICON_SIZE} color={isFocused ? PRIMARY : colors.text} />
                </Animated.View>
                <Animated.Text
                    style={{
                        color: PRIMARY,
                        fontFamily: 'Nunito_400Regular',
                        fontSize: 10,
                        opacity: textOpacity,
                        transform: [{ scale: textScale }, { translateY: textTranslate }],
                    }}
                >
                    {label}
                </Animated.Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

const CustomTabBar = React.memo(({ state, descriptors, navigation }: any) => {
    const icons: Array<IconName> = React.useMemo(() => ['tachometer-alt', 'copy', 'money-check-alt', 'cog'], []);
    const { colors } = useTheme();

    const renderIcons = React.useCallback(
        () =>
            state.routes.map((route: any, index: any) => {
                const { options } = descriptors[route.key];

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate({ name: route.name, merge: true });
                    }
                };

                return (
                    <BottomTabButton
                        onPress={onPress}
                        label={options.tabBarLabel}
                        iconName={icons[index]}
                        isFocused={isFocused}
                        key={`bottom-tab-${index}`}
                    />
                );
            }),
        [descriptors, icons, navigation, state.index, state.routes],
    );

    return (
        <View style={{ height: TAB_HEIGHT, flexDirection: 'row', backgroundColor: colors.card }}>{renderIcons()}</View>
    );
});

const getWidth = () => {
    return (width - 100) / 4;
};

export type BottomTabStackParamsList = {
    Dashboard: undefined;
    FullAppVersion: undefined;
    LoanStack: NavigatorScreenParams<LoanStackParamList>;
    TemplateStack: NavigatorScreenParams<TemplateStackParamList>;
    SettingStack: NavigatorScreenParams<SettingStackParamsList>;
};

const BottomTabStack = createBottomTabNavigator<BottomTabStackParamsList>();

interface BottomNavigatorProps {}

const BottomTabNavigator = React.memo<BottomNavigatorProps>(() => {
    const tabTranslate = React.useRef(new Animated.Value(0)).current;
    const { t } = useTranslation();
    const { isLite } = useApplication();

    return (
        <React.Fragment>
            <BottomTabStack.Navigator
                screenOptions={{ headerShown: false }}
                tabBar={(props) => <CustomTabBar {...props} />}
            >
                <BottomTabStack.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={{
                        tabBarLabel: t('dashboard'),
                    }}
                    listeners={() => ({
                        tabPress: () => {
                            Animated.parallel([
                                Animated.spring(tabTranslate, { toValue: 0, useNativeDriver: true }),
                            ]).start();
                        },
                        focus: () => {
                            Animated.parallel([
                                Animated.spring(tabTranslate, { toValue: 0, useNativeDriver: true }),
                            ]).start();
                        },
                    })}
                />
                <BottomTabStack.Screen
                    name="TemplateStack"
                    component={TemplateNavigator}
                    options={{
                        tabBarLabel: t('templates'),
                    }}
                    listeners={() => ({
                        tabPress: () => {
                            Animated.parallel([
                                Animated.spring(tabTranslate, { toValue: getWidth() + 25, useNativeDriver: true }),
                            ]).start();
                        },
                        focus: () => {
                            Animated.parallel([
                                Animated.spring(tabTranslate, { toValue: getWidth() + 25, useNativeDriver: true }),
                            ]).start();
                        },
                    })}
                />

                {isLite ? (
                    <BottomTabStack.Screen
                        name="FullAppVersion"
                        component={FullAppVersionScreen}
                        options={{
                            tabBarLabel: t('Loan'),
                        }}
                        listeners={() => ({
                            tabPress: () => {
                                Animated.parallel([
                                    Animated.spring(tabTranslate, {
                                        toValue: getWidth() * 2 + 45,
                                        useNativeDriver: true,
                                    }),
                                ]).start();
                            },
                            focus: () => {
                                Animated.parallel([
                                    Animated.spring(tabTranslate, {
                                        toValue: getWidth() * 2 + 45,
                                        useNativeDriver: true,
                                    }),
                                ]).start();
                            },
                        })}
                    />
                ) : (
                    <BottomTabStack.Screen
                        name="LoanStack"
                        component={LoanNavigator}
                        options={{
                            tabBarLabel: t('Loan'),
                        }}
                        listeners={() => ({
                            tabPress: () => {
                                Animated.parallel([
                                    Animated.spring(tabTranslate, {
                                        toValue: getWidth() * 2 + 45,
                                        useNativeDriver: true,
                                    }),
                                ]).start();
                            },
                            focus: () => {
                                Animated.parallel([
                                    Animated.spring(tabTranslate, {
                                        toValue: getWidth() * 2 + 45,
                                        useNativeDriver: true,
                                    }),
                                ]).start();
                            },
                        })}
                    />
                )}
                <BottomTabStack.Screen
                    name="SettingStack"
                    component={SettingNavigator}
                    options={{
                        tabBarLabel: t('setting'),
                    }}
                    listeners={() => ({
                        tabPress: () => {
                            Animated.parallel([
                                Animated.spring(tabTranslate, { toValue: getWidth() * 3 + 75, useNativeDriver: true }),
                            ]).start();
                        },
                        focus: () => {
                            Animated.parallel([
                                Animated.spring(tabTranslate, { toValue: getWidth() * 3 + 75, useNativeDriver: true }),
                            ]).start();
                        },
                    })}
                />
            </BottomTabStack.Navigator>
            <Animated.View
                style={{
                    backgroundColor: PRIMARY,
                    width: getWidth(),
                    height: 4,
                    position: 'absolute',
                    bottom: TAB_HEIGHT - 4,
                    borderRadius: 2,
                    left: 15,
                    transform: [{ translateX: tabTranslate }],
                }}
            />
        </React.Fragment>
    );
});

export default BottomTabNavigator;
