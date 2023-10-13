import React from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, View } from 'react-native';
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';
import { EmptyTransactionList, TransactionCard } from '@components';
import { useProjects, useSearch, useTransaction } from '@contexts';
import { useTransactionsFetcher } from '@fetchers';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { PRIMARY } from '@theme';
import { ApplicationStackParamsList } from '@navigations/ApplicationNavigator';
import Transaction from '@models/Transaction';
import { CellRenderer } from './components';

type TransactionScreenNavigationProps = NativeStackNavigationProp<ApplicationStackParamsList, 'Transaction'>;

interface TransactionListProps {
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

let onEndReachedCalledDuringMomentum = true;

const TransactionList: React.FunctionComponent<TransactionListProps> = ({ onScroll }) => {
    const { colors } = useTheme();
    const { project } = useProjects();
    const isFocus = useIsFocused();
    const navigation = useNavigation<TransactionScreenNavigationProps>();
    const { isLoading, transactions, offset, totalRows, fetchTransactions, fetchMore } = useTransactionsFetcher();
    const { from, category, to, name, paymentMethod } = useSearch();
    const { onSelect } = useTransaction();

    const loadTransactions = React.useCallback(async () => {
        await fetchTransactions({
            project: project?.id,
            from,
            to,
            name: name,
            paymentMethod: paymentMethod?.id,
            category: category?.id,
        });
    }, [category?.id, fetchTransactions, from, name, paymentMethod?.id, project?.id, to]);

    React.useEffect(() => {
        if (isFocus) {
            (async () => {
                await loadTransactions();
            })();
        }
    }, [isFocus, loadTransactions]);

    const onPress = React.useCallback(
        (transaction: Transaction) => {
            onSelect(transaction);
            navigation.navigate('Transaction', { edit: false });
        },
        [navigation, onSelect],
    );

    const renderItem = React.useCallback(
        ({ item }: { item: Transaction }) => <TransactionCard transaction={item} onPress={onPress} />,
        [onPress],
    );

    const loadMore = React.useCallback(async () => {
        if (offset <= totalRows && !onEndReachedCalledDuringMomentum) {
            await fetchMore({
                project: project.id,
                from,
                to,
                name: name,
                paymentMethod: paymentMethod?.id,
                category: category?.id,
            });
        }
    }, [category?.id, fetchMore, from, name, offset, paymentMethod?.id, project?.id, to, totalRows]);

    const Separator = React.useCallback(() => <View style={{ height: 10 }} />, []);

    const keyExtractor = React.useCallback((_: Transaction, index: number) => `transaction-list-item-${index}`, []);

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
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={EmptyTransactionList}
            CellRendererComponent={CellRenderer}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            onEndReached={onEndReached}
            scrollEnabled={transactions.length >= 2}
            onScroll={onScroll}
            onMomentumScrollBegin={onMomentumScrollBegin}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadTransactions} colors={[PRIMARY]} />}
            contentContainerStyle={{
                alignItems: 'center',
                backgroundColor: colors.background,
                paddingBottom: 20,
                paddingHorizontal: 10,
                paddingTop: 330,
                flexGrow: 1,
            }}
        />
    );
};

export default TransactionList;
