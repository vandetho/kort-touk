import React from 'react';
import { FlatList } from 'react-native';
import { isEqual } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { Day } from './components';

interface MonthProps {
    date: Date;
    onChangeDate?: (date: Date) => void;
}

const Month: React.FunctionComponent<MonthProps> = ({ date, onChangeDate }) => {
    const navigation = useNavigation();
    const flatListRef = React.useRef<FlatList>(null);
    const [state, setState] = React.useState<{ date: Date; currentDate: Date }>({ currentDate: date, date });

    React.useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index: state.date.getUTCDate() - 1, animated: true });
        }
    }, [navigation, state.date]);

    React.useEffect(() => {
        setState((prevState) => ({ ...prevState, date }));
    }, [date]);

    const onPress = React.useCallback(
        (date: Date) => {
            setState((prevState) => ({ ...prevState, date }));
            if (onChangeDate) {
                onChangeDate(date);
            }
        },
        [onChangeDate],
    );

    const renderDay = React.useCallback(
        ({ item }: { item: Date }): JSX.Element => {
            return <Day date={item} active={isEqual(item, state.date)} onPress={onPress} />;
        },
        [onPress, state.date],
    );

    const getItemLayout = React.useCallback((data, index) => {
        const width = 95;
        return { length: width, offset: width * index, index };
    }, []);

    const days = React.useMemo((): Date[] => {
        const year = state.date.getFullYear();
        const month = state.date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const dates: Date[] = [];
        for (let i = 1; i <= days; ++i) {
            dates.push(new Date(year, month, i, 0, 0, 0, 0));
        }

        return dates;
    }, [state.date]);

    const keyExtractor = React.useCallback((_: Date, index: number) => `calendar-day-${index}`, []);

    return (
        <React.Fragment>
            <FlatList
                data={days}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                initialScrollIndex={state.currentDate.getUTCDate() - 2}
                getItemLayout={getItemLayout}
                renderItem={renderDay}
                keyExtractor={keyExtractor}
                ref={flatListRef}
            />
        </React.Fragment>
    );
};

export default Month;
