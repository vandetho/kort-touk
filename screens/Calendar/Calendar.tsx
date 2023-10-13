import React from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { Header } from '@components';
import { useTranslation } from 'react-i18next';
import { useDate } from '@contexts/DateContext';
import { Month as MonthConstant } from '@constants';
import { Month, TransactionList } from './components';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useVisible } from '@hooks';
import { useTheme } from '@react-navigation/native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    monthContainer: {
        height: 125,
    },
});

interface CalendarProps {}

const Calendar: React.FunctionComponent<CalendarProps> = () => {
    const { t } = useTranslation();
    const { dark } = useTheme();
    const { date, updateDate } = useDate();
    const { visible, onToggle } = useVisible();
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const [state, setState] = React.useState<{ date: Date }>({
        date: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
    });

    const onPressToday = React.useCallback(() => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        updateDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
        setState((prevState) => ({ ...prevState, date }));
    }, [updateDate]);

    const onChangeDate = React.useCallback(
        (date: Date) => {
            const newDate = new Date();
            newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
            updateDate(newDate);
            setState((prevState) => ({ ...prevState, date }));
        },
        [updateDate],
    );

    const onConfirm = React.useCallback(
        (date: Date) => {
            date.setHours(0, 0, 0, 0);
            setState((prevState) => ({ ...prevState, date }));
            onToggle();
            onChangeDate(date);
        },
        [onChangeDate, onToggle],
    );

    const display = React.useMemo((): any => (Platform.OS === 'ios' ? 'inline' : 'calendar'), []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={{
                    position: 'absolute',
                    zIndex: 1,
                    top: 20,
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange: [0, 75],
                                outputRange: [0, -175],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                <Header
                    goBackTitle={t('close')}
                    goBackIcon="times"
                    headerMiddleIcon="chevron-down"
                    headerMiddleTitle={`${t(MonthConstant[state.date.getUTCMonth()])}, ${state.date.getUTCFullYear()}`}
                    onMiddleButtonPress={onToggle}
                    onRightButtonPress={onPressToday}
                    headerRightTitle={t('today')}
                />
                <View style={styles.monthContainer}>
                    <Month date={state.date} onChangeDate={onChangeDate} />
                </View>
            </Animated.View>
            <TransactionList
                date={state.date}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                    useNativeDriver: true,
                })}
            />
            <DateTimePickerModal
                isVisible={visible}
                date={state.date}
                mode="date"
                isDarkModeEnabled={dark}
                display={display}
                onConfirm={onConfirm}
                onCancel={onToggle}
            />
        </View>
    );
};

export default Calendar;
