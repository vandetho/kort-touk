import { Between, DataSource, ILike, Repository, SelectQueryBuilder } from 'typeorm';
import Transaction from '@models/Transaction';
import { CreateTransaction } from '@interfaces';
import { TransactionCriteria } from '@fetchers';

export default class TransactionRepository {
    private ormRepository: Repository<Transaction>;

    constructor(dataSource: DataSource) {
        this.ormRepository = dataSource.getRepository(Transaction);
    }

    public async getAll(): Promise<Transaction[]> {
        return await this.ormRepository.find();
    }

    public async getNextPayment(projects: string[]): Promise<Transaction[]> {
        const date = new Date();
        date.setUTCMonth(date.getUTCMonth() + 1, 1);
        date.setUTCHours(0, 0, 0, 0);
        const nextPayment = this.ormRepository
            .createQueryBuilder('t')
            .select('t.id', 't_id')
            .addSelect('MIN(t.doneAt)')
            .addSelect('t.projectId')
            .where('t.doneAt >= :doneAt', { doneAt: date.getTime() })
            .andWhere('t.projectId IN (:...projects)', { projects })
            .groupBy('t.projectId');
        return await this.ormRepository
            .createQueryBuilder('transaction')
            .select('transaction')
            .addSelect('project')
            .innerJoin('transaction.project', 'project')
            .innerJoin(`(${nextPayment.getQuery()})`, 'subt', 'subt.t_id = transaction_id')
            .setParameters(nextPayment.getParameters())
            .getMany();
    }

    public async getRemainPaymentAmount(loan: string): Promise<{ amount: number }> {
        const from = new Date();
        from.setUTCMonth(from.getUTCMonth() + 1);
        from.setUTCDate(1);
        from.setUTCHours(0, 0, 0, 0);
        return await this.ormRepository
            .createQueryBuilder('transaction')
            .select('SUM(transaction.amount) as amount')
            .where('transaction.doneAt >= :from', {
                from: from.getTime(),
            })
            .andWhere('transaction.projectId = :loan', { loan })
            .getRawOne();
    }

    public async getRemainAmounts(loans: string[]): Promise<Array<{ projectId: string; amount: number }>> {
        const from = new Date();
        from.setUTCMonth(from.getUTCMonth() + 1);
        from.setUTCDate(1);
        from.setUTCHours(0, 0, 0, 0);
        return await this.ormRepository
            .createQueryBuilder('transaction')
            .select('SUM(transaction.amount) as amount')
            .addSelect('transaction.projectId as projectId')
            .where('transaction.doneAt >= :from', {
                from: from.getTime(),
            })
            .andWhere('transaction.projectId IN (:...loans)', { loans })
            .groupBy('projectId')
            .getRawMany();
    }

    public async getNextMonthPayment(): Promise<{ expense: number; income: number }> {
        const from = new Date();
        const to = new Date();
        from.setUTCMonth(from.getUTCMonth() + 1);
        from.setUTCDate(1);
        from.setUTCHours(0, 0, 0, 0);
        to.setUTCMonth(to.getUTCMonth() + 2, 0);
        to.setUTCHours(23, 59, 59, 999);
        return await this.ormRepository
            .createQueryBuilder('transaction')
            .select('SUM(IIF(transaction.debit = 1, transaction.amount, 0))', 'expense')
            .addSelect('SUM(IIF(transaction.debit = 0, transaction.amount, 0))', 'income')
            .innerJoin('transaction.project', 'project')
            .where('transaction.doneAt >= :from AND transaction.doneAt <= :to', {
                from: from.getTime(),
                to: to.getTime(),
            })
            .andWhere('project.monthlyExpense = :monthlyExpense', { monthlyExpense: true })
            .andWhere('project.archived = :archived', { archived: false })
            .getRawOne();
    }

    public async getByCriteria(criteria: TransactionCriteria, offset: number, limit = 10): Promise<Transaction[]> {
        const transactionQuery = this.ormRepository
            .createQueryBuilder('transaction')
            .select('transaction')
            .addSelect('category')
            .addSelect('paymentMethod')
            .addSelect('project')
            .innerJoin('transaction.project', 'project')
            .leftJoin('transaction.category', 'category')
            .leftJoin('transaction.paymentMethod', 'paymentMethod')
            .where('transaction.projectId = :project', { project: criteria.project })
            .orderBy('transaction.doneAt', 'ASC')
            .limit(limit)
            .offset(offset);
        return await TransactionRepository.getQueryBuilderWhereCondition(transactionQuery, criteria).getMany();
    }

    public async getSumByCriteria(
        criteria: TransactionCriteria,
        projects: string[],
    ): Promise<Array<{ projectId: string; amount: number }>> {
        const transactionQuery = this.ormRepository
            .createQueryBuilder('transaction')
            .select('transaction.projectId', 'projectId')
            .addSelect('SUM(IIF(transaction.debit = 1, transaction.amount * -1, transaction.amount))', 'amount')
            .where('transaction.projectId IN (:...projects)', { projects })
            .groupBy('projectId');

        return await TransactionRepository.getQueryBuilderWhereCondition(transactionQuery, criteria).getRawMany<{
            projectId: string;
            amount: number;
        }>();
    }

    public async getBalancesByCriteria(
        criteria: TransactionCriteria,
    ): Promise<{ projectId: string; expense: number; income: number }> {
        const transactionQuery = this.ormRepository
            .createQueryBuilder('transaction')
            .select('transaction.projectId', 'projectId')
            .addSelect('SUM(IIF(transaction.debit = 1, transaction.amount, 0))', 'expense')
            .addSelect('SUM(IIF(transaction.debit = 0, transaction.amount, 0))', 'income')
            .innerJoin('transaction.category', 'category')
            .where('transaction.projectId = :project', { project: criteria.project })
            .groupBy('projectId');

        return await TransactionRepository.getQueryBuilderWhereCondition(transactionQuery, criteria).getRawOne<{
            projectId: string;
            expense: number;
            income: number;
        }>();
    }

    public async getSummariesByCriteria(
        criteria: TransactionCriteria,
    ): Promise<Array<{ projectId: string; amount: number; debit: boolean; color: string; name: string }>> {
        const transactionQuery = this.ormRepository
            .createQueryBuilder('transaction')
            .select('transaction.projectId', 'projectId')
            .addSelect('SUM(transaction.amount)', 'amount')
            .addSelect('transaction.debit', 'debit')
            .addSelect('category.name', 'name')
            .addSelect('category.color', 'color')
            .innerJoin('transaction.category', 'category')
            .where('transaction.projectId = :project', { project: criteria.project })
            .groupBy('projectId')
            .addGroupBy('debit')
            .addGroupBy('category.id');

        return await TransactionRepository.getQueryBuilderWhereCondition(transactionQuery, criteria).getRawMany<{
            projectId: string;
            amount: number;
            debit: boolean;
            color: string;
            name: string;
        }>();
    }

    public async countByCriteria(criteria: TransactionCriteria): Promise<number> {
        return await this.ormRepository.count({
            relations: ['project', 'category', 'paymentMethod'],
            where: TransactionRepository.getWhereCondition(criteria),
        });
    }

    public create(data: CreateTransaction): Transaction {
        const now = new Date().getTime();
        return this.ormRepository.create({
            ...data,
            createdAt: now,
            updatedAt: now,
        });
    }

    public async save(data: CreateTransaction): Promise<Transaction> {
        return await this.ormRepository.save(this.create(data));
    }

    public async update(transaction: Transaction): Promise<Transaction> {
        transaction.updatedAt = new Date().getTime();
        return await this.ormRepository.save(transaction);
    }

    public async delete(id: number): Promise<void> {
        await this.ormRepository.delete(id);
    }

    private static getWhereCondition(criteria: TransactionCriteria) {
        const where: { [key: string]: any } = {
            project: { id: criteria.project },
        };

        if (criteria.from && criteria.to) {
            where.doneAt = Between(criteria.from, criteria.to);
        }

        if (criteria.category) {
            where.category = { id: criteria.category };
        }

        if (criteria.paymentMethod) {
            where.paymentMethod = { id: criteria.paymentMethod };
        }

        if (criteria.name) {
            where.name = ILike(`%${criteria.name}%`);
            where.note = ILike(`%${criteria.name}%`);
        }
        return where;
    }

    private static getQueryBuilderWhereCondition(
        transactionQuery: SelectQueryBuilder<Transaction>,
        criteria: TransactionCriteria,
    ) {
        if (criteria.from && criteria.to) {
            transactionQuery.andWhere({
                doneAt: Between(criteria.from, criteria.to),
            });
        }

        if (criteria.category) {
            transactionQuery.andWhere({
                category: { id: criteria.category },
            });
        }

        if (criteria.paymentMethod) {
            transactionQuery.andWhere({
                paymentMethod: { id: criteria.paymentMethod },
            });
        }

        if (criteria.name) {
            transactionQuery.andWhere({ name: ILike(`%${criteria.name}%`) });
            transactionQuery.orWhere({
                note: ILike(`%${criteria.name}%`),
            });
        }
        return transactionQuery;
    }
}
