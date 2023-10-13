import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PRIMARY, SECONDARY } from '@theme';
import { ShortWeekDay } from '@constants';
import { Text } from '@components/Text';

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 10,
        height: 75,
        width: 75,
        margin: 10,
        padding: 2,
        borderColor: PRIMARY,
        justifyContent: 'center',
    },
    text: {
        color: PRIMARY,
        fontSize: 16,
        textAlign: 'center',
    },
    dayText: {
        fontSize: 24,
    },
    activeText: {
        color: '#FFFFFF',
    },
});

interface DayProps {
    date: Date;
    active: boolean;
    onPress: (date: Date) => void;
}

const Day: React.FunctionComponent<DayProps> = ({ active, ...props }) => {
    const { t } = useTranslation();
    const day = React.useMemo(() => t(ShortWeekDay[props.date.getDay()]), [props.date, t]);
    const date = React.useMemo(() => props.date.getDate(), [props.date]);

    const onPress = React.useCallback(() => {
        props.onPress(props.date);
    }, [props]);

    const renderContent = React.useCallback(() => {
        if (active) {
            return (
                <LinearGradient colors={[PRIMARY, SECONDARY]} style={styles.container}>
                    <Text bold style={[styles.text, styles.activeText]}>
                        {day}
                    </Text>
                    <Text bold style={[styles.text, styles.dayText, styles.activeText]}>
                        {date}
                    </Text>
                </LinearGradient>
            );
        }
        return (
            <View style={[styles.container]}>
                <Text bold style={styles.text}>
                    {day}
                </Text>
                <Text bold style={[styles.text, styles.dayText]}>
                    {date}
                </Text>
            </View>
        );
    }, [active, day, date]);

    return <TouchableWithoutFeedback onPress={onPress}>{renderContent()}</TouchableWithoutFeedback>;
};

export default Day;
