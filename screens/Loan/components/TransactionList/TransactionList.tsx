import React from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import Transaction from '@models/Transaction';
import { useTransactionsFetcher } from '@fetchers';
import { useLoans } from '@contexts';
import { BarLoader, Separator } from '@components';
import { TransactionCard } from './components';
import { useIsFocused } from '@react-navigation/native';

const TOP_HEIGHT = 315;
const ITEM_HEIGHT = 135;

let onEndReachedCalledDuringMomentum = true;

interface ProjectListProps {
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const TransactionList = React.memo<ProjectListProps>(({ onScroll }) => {
    const { loan } = useLoans();
    const isFocused = useIsFocused();
    const { fetchTransactions, transactions, fetchMore, isLoading, isLoadingMore } = useTransactionsFetcher();

    const handleFetch = React.useCallback(
        async () => await fetchTransactions({ project: loan.id }),
        [fetchTransactions, loan.id],
    );

    React.useEffect(() => {
        if (isFocused) {
            (async () => await handleFetch())();
        }
    }, [handleFetch, isFocused]);

    const onEndReached = React.useCallback(async () => {
        if (!onEndReachedCalledDuringMomentum && !isLoadingMore) {
            await fetchMore({ project: loan.id });
        }
    }, [fetchMore, isLoadingMore, loan.id]);

    const keyExtractor = React.useCallback((_, index: number) => `loan-transactions-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({ index, offset: (ITEM_HEIGHT + 10) * index, length: ITEM_HEIGHT + 10 }),
        [],
    );

    const currentDate = React.useMemo(() => {
        const date = new Date();
        date.setUTCDate(1);
        date.setUTCHours(0, 0, 0, 0);
        return date;
    }, []);

    const renderItem = React.useCallback(
        ({ item, index }: { item: Transaction; index: number }) => {
            return (
                <TransactionCard transaction={item} index={index + 1} currentDate={currentDate} height={ITEM_HEIGHT} />
            );
        },
        [currentDate],
    );

    const renderFooter = React.useCallback(() => {
        return isLoadingMore ? (
            <View style={{ flex: 1, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                <BarLoader />
            </View>
        ) : null;
    }, [isLoadingMore]);

    const onMomentumScrollBegin = React.useCallback(() => {
        onEndReachedCalledDuringMomentum = false;
    }, []);

    return (
        <Animated.FlatList
            refreshing={isLoading}
            onRefresh={handleFetch}
            data={transactions}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            ItemSeparatorComponent={Separator}
            ListFooterComponent={renderFooter}
            onEndReached={onEndReached}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            scrollEventThrottle={16}
            scrollEnabled={transactions.length >= 2}
            onMomentumScrollBegin={onMomentumScrollBegin}
            onScroll={onScroll}
            contentContainerStyle={{
                flexGrow: 1,
                paddingTop: TOP_HEIGHT + 10,
                paddingBottom: 20,
            }}
        />
    );
});

export default TransactionList;
