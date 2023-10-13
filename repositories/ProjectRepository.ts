import { DataSource, Repository } from 'typeorm';
import Project from '@models/Project';
import { CreateProject } from '@interfaces';

export default class ProjectRepository {
    private ormRepository: Repository<Project>;

    constructor(dataSource: DataSource) {
        this.ormRepository = dataSource.getRepository(Project);
    }

    public async getAll(): Promise<Project[]> {
        return await this.ormRepository.find({
            relations: ['categories', 'paymentMethods'],
            where: { monthlyExpense: false },
            order: { sort: 'ASC' },
        });
    }

    public async count(): Promise<number> {
        return await this.ormRepository.count({
            where: { monthlyExpense: false },
        });
    }

    public async getLoans(): Promise<Project[]> {
        return await this.ormRepository.find({ where: { monthlyExpense: true }, order: { sort: 'ASC' } });
    }

    public create(data: CreateProject): Project {
        const now = new Date().getTime();
        return this.ormRepository.create({
            ...data,
            createdAt: data.createdAt || now,
            updatedAt: data.updatedAt || now,
        });
    }

    public async save(data: CreateProject): Promise<Project> {
        return await this.ormRepository.save(this.create(data));
    }

    public async update(projects: Project | Project[], withUpdateDate: boolean = true): Promise<Project | Project[]> {
        if (Array.isArray(projects)) {
            if (withUpdateDate) {
                for (let i = 0; i < projects.length; ++i) {
                    projects[i].updatedAt = new Date().getTime();
                }
            }
            return await this.ormRepository.save(projects);
        }
        if (withUpdateDate) {
            projects.updatedAt = new Date().getTime();
        }
        return await this.ormRepository.save(projects);
    }

    public async delete(id: string): Promise<void> {
        await this.ormRepository.delete(id);
    }
}
