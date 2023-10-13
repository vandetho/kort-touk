import { DataSource, Repository } from 'typeorm';
import Category from '@models/Category';
import { CreateCategory } from '@interfaces';
import Project from '@models/Project';

export default class CategoryRepository {
    private ormRepository: Repository<Category>;

    constructor(dataSource: DataSource) {
        this.ormRepository = dataSource.getRepository(Category);
    }

    public async getAll(): Promise<Category[]> {
        return await this.ormRepository.find({ order: { sort: 'ASC' } });
    }

    public async getByProject(project: string): Promise<Category[]> {
        return await this.ormRepository
            .createQueryBuilder('category')
            .innerJoin('category.projects', 'projects', 'projects.id = :project', { project })
            .orderBy('category.sort', 'ASC')
            .getMany();
    }

    public async getByNotProject(project: string): Promise<Category[]> {
        return await this.ormRepository
            .createQueryBuilder('category')
            .leftJoin('category.projects', 'projects', 'projects.id <> :project', { project })
            .orderBy('category.sort', 'ASC')
            .getMany();
    }

    public async addProject(project: Project, category: Category): Promise<void> {
        return await this.ormRepository.createQueryBuilder().relation('projects').of(category.id).add(project.id);
    }

    public create(data: CreateCategory): Category {
        const now = new Date().getTime();
        return this.ormRepository.create({
            ...data,
            createdAt: now,
            updatedAt: now,
        });
    }

    public async save(data: CreateCategory): Promise<Category> {
        return await this.ormRepository.save(this.create(data));
    }

    public async update(
        categories: Category | Category[],
        withUpdateDate: boolean = true,
    ): Promise<Category | Category[]> {
        if (Array.isArray(categories)) {
            if (withUpdateDate) {
                for (let i = 0; i < categories.length; ++i) {
                    categories[i].updatedAt = new Date().getTime();
                }
            }
            return await this.ormRepository.save(categories);
        }
        if (withUpdateDate) {
            categories.updatedAt = new Date().getTime();
        }
        return await this.ormRepository.save(categories);
    }

    public async delete(id: number): Promise<void> {
        await this.ormRepository.delete(id);
    }
}
