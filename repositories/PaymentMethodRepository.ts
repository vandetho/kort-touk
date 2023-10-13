import { DataSource, Repository } from 'typeorm';
import PaymentMethod from '@models/PaymentMethod';
import { CreatePaymentMethod } from '@interfaces';
import Project from '@models/Project';

export default class PaymentMethodRepository {
    private ormRepository: Repository<PaymentMethod>;

    constructor(dataSource: DataSource) {
        this.ormRepository = dataSource.getRepository(PaymentMethod);
    }

    public async getAll(): Promise<PaymentMethod[]> {
        return await this.ormRepository.find({ order: { sort: 'ASC' } });
    }

    public async getByProject(project: string): Promise<PaymentMethod[]> {
        return await this.ormRepository
            .createQueryBuilder('paymentMethod')
            .innerJoin('paymentMethod.projects', 'projects', 'projects.id = :project', { project })
            .orderBy('paymentMethod.sort', 'ASC')
            .getMany();
    }

    public async getByNotProject(project: string): Promise<PaymentMethod[]> {
        return await this.ormRepository
            .createQueryBuilder('paymentMethod')
            .leftJoin('paymentMethod.projects', 'projects', 'projects.id <> :project', { project })
            .orderBy('paymentMethod.sort', 'ASC')
            .getMany();
    }

    public async addProject(project: Project, paymentMethod: PaymentMethod): Promise<void> {
        return await this.ormRepository.createQueryBuilder().relation('projects').of(paymentMethod.id).add(project.id);
    }

    public create(data: CreatePaymentMethod): PaymentMethod {
        const now = new Date().getTime();
        return this.ormRepository.create({
            ...data,
            createdAt: now,
            updatedAt: now,
        });
    }

    public async save(data: CreatePaymentMethod): Promise<PaymentMethod> {
        return await this.ormRepository.save(this.create(data));
    }

    public async update(
        paymentMethods: PaymentMethod | PaymentMethod[],
        withUpdateDate: boolean = true,
    ): Promise<PaymentMethod | PaymentMethod[]> {
        if (Array.isArray(paymentMethods)) {
            if (withUpdateDate) {
                for (let i = 0; i < paymentMethods.length; ++i) {
                    paymentMethods[i].updatedAt = new Date().getTime();
                }
            }
            return await this.ormRepository.save(paymentMethods);
        }
        if (withUpdateDate) {
            paymentMethods.updatedAt = new Date().getTime();
        }
        return await this.ormRepository.save(paymentMethods);
    }

    public async delete(id: number): Promise<void> {
        await this.ormRepository.delete(id);
    }
}
