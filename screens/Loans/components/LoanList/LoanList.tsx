import React from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useLoans } from '@contexts';
import { Separator } from '@components';
import { Loan } from '@interfaces';
import { CellRenderer, LoanCard } from './components';
import { useIsFocused } from '@react-navigation/native';

const TOP_HEIGHT = 275;
const ITEM_HEIGHT = 220;

interface LoanListProps {
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const LoanList = React.memo<LoanListProps>(({ onScroll }) => {
    const { loans, fetch, isLoading } = useLoans();
    const isFocused = useIsFocused();

    React.useEffect(() => {
        if (isFocused) {
            fetch();
        }
    }, [fetch, isFocused]);

    const keyExtractor = React.useCallback((_, index: number) => `loan-item-${index}`, []);
    const getItemLayout = React.useCallback(
        (_, index: number) => ({ index, length: ITEM_HEIGHT + 10, offset: (ITEM_HEIGHT + 10) * index }),
        [],
    );

    const renderItem = React.useCallback(({ item, index }: { item: Loan; index: number }) => {
        return <LoanCard loan={item} index={index} height={ITEM_HEIGHT} />;
    }, []);

    return (
        <Animated.FlatList
            refreshing={isLoading}
            onRefresh={fetch}
            data={loans}
            renderItem={renderItem}
            scrollEventThrottle={16}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={Separator}
            getItemLayout={getItemLayout}
            CellRendererComponent={CellRenderer}
            onScroll={onScroll}
            contentContainerStyle={{
                flexGrow: 1,
                paddingTop: TOP_HEIGHT + 20,
                paddingBottom: 20,
                paddingHorizontal: 10,
            }}
        />
    );
});

export default LoanList;
