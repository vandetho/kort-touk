import React from 'react';
import { NavigationProp, useIsFocused, useNavigation, useTheme } from '@react-navigation/native';
import {
    Animated,
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    StyleSheet,
} from 'react-native';
import { endOfDay, startOfDay } from 'date-fns';
import { EmptyTransactionList, Separator, TransactionCard } from '@components';
import { useTransactionsFetcher } from '@fetchers';
import { useProjects, useTransaction } from '@contexts';
import { PRIMARY } from '@theme';
import { ApplicationStackParamsList } from '@navigations/ApplicationNavigator/ApplicationNavigator';
import { CellRenderer } from './components';
import Transaction from '@models/Transaction';

const { height: HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
    contentContainer: {
        alignItems: 'center',
        paddingTop: 160,
        paddingBottom: 10,
        flexGrow: 1,
    },
});

type TransactionScreenNavigationProp = NavigationProp<ApplicationStackParamsList, 'Transaction'>;

let onEndReachedCalledDuringMomentum = true;

interface TransactionListProps {
    date: Date;
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const TransactionListComponent: React.FunctionComponent<TransactionListProps> = ({ date, onScroll }) => {
    const { colors } = useTheme();
    const navigation = useNavigation<TransactionScreenNavigationProp>();
    const isFocused = useIsFocused();
    const { project } = useProjects();
    const { transactions, offset, totalRows, isLoading, fetchMore, fetchTransactions } = useTransactionsFetcher();
    const { onSelect } = useTransaction();
    const flatListRef = React.useRef<FlatList>(null);

    const reload = React.useCallback(() => {
        (async () =>
            await fetchTransactions({
                project: project?.id,
                from: startOfDay(date).getTime(),
                to: endOfDay(date).getTime(),
                category: undefined,
                paymentMethod: undefined,
                name: '',
            }))();
    }, [date, fetchTransactions, project]);

    React.useEffect(() => {
        if (isFocused) {
            reload();
        }
    }, [isFocused, reload]);

    const onPress = React.useCallback(
        (transaction: Transaction) => {
            onSelect(transaction);
            navigation.navigate('Transaction', { edit: false });
        },
        [navigation, onSelect],
    );

    const renderItem = React.useCallback(
        ({ item }: { item: Transaction }) => {
            return <TransactionCard transaction={item} onPress={onPress} />;
        },
        [onPress],
    );

    const keyExtractor = React.useCallback((item: Transaction) => `calendar-record-${item.id}`, []);

    const loadMore = React.useCallback(async () => {
        if (offset <= totalRows && !onEndReachedCalledDuringMomentum) {
            await fetchMore({
                project: project?.id,
                from: startOfDay(date).getTime(),
                to: endOfDay(date).getTime(),
                category: undefined,
                paymentMethod: undefined,
                name: '',
            });
        }
    }, [date, fetchMore, offset, project?.id, totalRows]);

    const onMomentumScrollBegin = React.useCallback(() => {
        onEndReachedCalledDuringMomentum = false;
    }, []);

    const onEndReached = React.useMemo(() => {
        if (offset <= totalRows) {
            return undefined;
        }
        return loadMore;
    }, [loadMore, offset, totalRows]);

    return (
        <Animated.FlatList
            data={transactions}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            CellRendererComponent={CellRenderer}
            ListEmptyComponent={EmptyTransactionList}
            ItemSeparatorComponent={Separator}
            onEndReachedThreshold={1}
            onEndReached={onEndReached}
            onScroll={onScroll}
            onMomentumScrollBegin={onMomentumScrollBegin}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={reload} colors={[PRIMARY]} />}
            style={{ height: HEIGHT, backgroundColor: colors.background }}
            ref={flatListRef}
            contentContainerStyle={[
                styles.contentContainer,
                {
                    backgroundColor: colors.background,
                },
            ]}
        />
    );
};
const TransactionList = React.memo(TransactionListComponent);

export default TransactionList;
