import React from 'react';
import ProjectRepository from '@repositories/ProjectRepository';
import { DataSource } from 'typeorm';
import Project from '@models/Project';
import Template from '@models/Template';
import Transaction from '@models/Transaction';
import Category from '@models/Category';
import PaymentMethod from '@models/PaymentMethod';
import Constants from 'expo-constants';
import { CreateProjectTable1640065311798 } from '@migrations/1640065311798-CreateProjectTable';
import { CreateCategoryTable1640065769593 } from '@migrations/1640065769593-CreateCategoryTable';
import { CreatePaymentMethodTable1640065777801 } from '@migrations/1640065777801-CreatePaymentMethodTable';
import { CreateTemplateTable1640065753016 } from '@migrations/1640065753016-CreateTemplateTable';
import { CreateTransactionTable1640065759890 } from '@migrations/1640065759890-CreateTransactionTable';
import { CreateProjectCategoryTable1640072642578 } from '@migrations/1640072642578-CreateProjectCategoryTable';
import { CreateProjectPaymentMethodTable1640072634083 } from '@migrations/1640072634083-CreateProjectPaymentMethodTable';
import { SeedCategoryTable1640073660655 } from '@seeds/1640073660655-SeedCategoryTable';
import { SeedPaymentMethodTable1640073668988 } from '@seeds/1640073668988-SeedPaymentMethodTable';
import CategoryRepository from '@repositories/CategoryRepository';
import PaymentMethodRepository from '@repositories/PaymentMethodRepository';
import TemplateRepository from '@repositories/TemplateRepository';
import TransactionRepository from '@repositories/TransactionRepository';
import { AppLoadingScreen } from '@screens/AppLoading';
import { View } from 'react-native';
import { BarLoader } from '@components';

interface DatabaseConnectionContextData {
    categoryRepository: CategoryRepository;
    paymentMethodRepository: PaymentMethodRepository;
    projectRepository: ProjectRepository;
    templateRepository: TemplateRepository;
    transactionRepository: TransactionRepository;
}

const DatabaseConnectionContext = React.createContext<DatabaseConnectionContextData>(
    {} as DatabaseConnectionContextData,
);

export const DatabaseConnectionProvider: React.FunctionComponent = ({ children }) => {
    const [dataSource, setDataSource] = React.useState<DataSource | null>(null);

    const connect = React.useCallback(async () => {
        try {
            const dataSource = new DataSource({
                type: 'expo',
                database: `${Constants.manifest.extra.database}.db`,
                driver: require('expo-sqlite'),
                entities: [Project, Template, Transaction, Category, PaymentMethod],
                migrations: [
                    CreateProjectTable1640065311798,
                    CreateCategoryTable1640065769593,
                    CreatePaymentMethodTable1640065777801,
                    CreateProjectCategoryTable1640072642578,
                    CreateProjectPaymentMethodTable1640072634083,
                    CreateTemplateTable1640065753016,
                    CreateTransactionTable1640065759890,
                    SeedCategoryTable1640073660655,
                    SeedPaymentMethodTable1640073668988,
                ],
                migrationsRun: true,
                synchronize: false,
                logging: !['release', 'production'].includes(process.env.APP_ENV),
            });
            await dataSource.initialize();
            setDataSource(dataSource);
        } catch (e) {
            console.error(e);
        }
    }, []);

    React.useEffect(() => {
        if (!dataSource) {
            (async () => connect())();
        }
    }, [connect, dataSource]);

    if (!dataSource) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <BarLoader />
            </View>
        );
    }

    return (
        <DatabaseConnectionContext.Provider
            value={{
                categoryRepository: new CategoryRepository(dataSource),
                paymentMethodRepository: new PaymentMethodRepository(dataSource),
                projectRepository: new ProjectRepository(dataSource),
                templateRepository: new TemplateRepository(dataSource),
                transactionRepository: new TransactionRepository(dataSource),
            }}
        >
            {children}
        </DatabaseConnectionContext.Provider>
    );
};

export function useDatabaseConnection() {
    return React.useContext(DatabaseConnectionContext);
}
