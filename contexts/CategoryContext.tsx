import React from 'react';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import Category from '@models/Category';

export const CategoryContext = React.createContext<{
    allCategories: Category[];
    categories: Category[];
    onUpdateSelectedCategories: (categories: Category[]) => void;
    fetchAll: () => void;
    addCategory: (category: Category) => void;
}>({
    allCategories: [],
    categories: [],
    onUpdateSelectedCategories: (categories: Category[]) => {
        console.log({ context: 'CategoryContext', functionName: 'fetchByNotProject', categories });
    },
    fetchAll: () => {
        console.log({ context: 'CategoryContext', functionName: 'fetchAll' });
    },
    addCategory: (category: Category) => {
        console.log({ context: 'CategoryContext', functionName: 'addCategory', category });
    },
});

export const CategoryProvider: React.FunctionComponent = ({ children }) => {
    const { categoryRepository } = useDatabaseConnection();
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [allCategories, setAllCategories] = React.useState<Category[]>([]);

    const fetchAll = React.useCallback(() => {
        categoryRepository.getAll().then(setAllCategories);
    }, [categoryRepository]);

    React.useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const onUpdateSelectedCategories = React.useCallback((categories: Category[]) => {
        setCategories(categories);
    }, []);

    const addCategory = React.useCallback(
        (category: Category) => {
            const categories = [...allCategories, category];
            setAllCategories(categories);
        },
        [allCategories],
    );
    return (
        <CategoryContext.Provider
            value={{ categories, allCategories, onUpdateSelectedCategories, fetchAll, addCategory }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = () => {
    return React.useContext(CategoryContext);
};
