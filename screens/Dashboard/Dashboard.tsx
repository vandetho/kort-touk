import React from 'react';
import { Animated, SafeAreaView, StyleSheet } from 'react-native';
import { DashboardHeader, SideMenu, TransactionList } from './components';
import { useTheme } from '@react-navigation/native';
import { useVisible } from '@hooks';
import { DrawerLayout } from 'react-native-gesture-handler';
import { DrawerState } from 'react-native-gesture-handler/src/components/DrawerLayout';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    iconView: {
        position: 'absolute',
        left: 20,
        top: -15,
    },
});

interface DashboardProps {}

const Dashboard: React.FunctionComponent<DashboardProps> = () => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const { visible, onOpen, onClose } = useVisible();
    const { colors } = useTheme();
    const drawerRef = React.useRef<DrawerLayout>(null);

    const onCloseMenu = React.useCallback(() => {
        if (drawerRef.current) {
            drawerRef.current.closeDrawer();
            onClose();
        }
    }, [onClose]);

    const onPressMenu = React.useCallback(() => {
        if (drawerRef.current) {
            if (visible) {
                drawerRef.current.closeDrawer();
                onClose();
                return;
            }
            drawerRef.current.openDrawer();
            onOpen();
        }
    }, [onClose, onOpen, visible]);

    const renderDrawer = React.useCallback(() => <SideMenu onClose={onCloseMenu} />, [onCloseMenu]);

    const onDrawerStateChanged = React.useCallback(
        (newState: DrawerState, drawerWillShow: boolean) => {
            if (newState === 'Settling') {
                if (drawerWillShow) {
                    return onOpen();
                }
                return onClose();
            }
        },
        [onClose, onOpen],
    );

    return (
        <SafeAreaView style={styles.container}>
            <DrawerLayout
                ref={drawerRef}
                drawerWidth={200}
                drawerPosition="left"
                drawerType="slide"
                drawerBackgroundColor={colors.background}
                renderNavigationView={renderDrawer}
                onDrawerStateChanged={onDrawerStateChanged}
                useNativeAnimations
            >
                <DashboardHeader animatedValue={animatedValue} onShowMenu={onPressMenu} />
                <TransactionList
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                        useNativeDriver: true,
                    })}
                />
            </DrawerLayout>
        </SafeAreaView>
    );
};

export default Dashboard;
