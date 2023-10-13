import { DataSource, Repository } from 'typeorm';
import Template from '@models/Template';
import { CreateTemplate } from '@interfaces';

export default class TemplateRepository {
    private ormRepository: Repository<Template>;

    constructor(dataSource: DataSource) {
        this.ormRepository = dataSource.getRepository(Template);
    }

    public async getAll(offset?: number, limit?: number): Promise<Template[]> {
        return await this.ormRepository.find({ relations: ['category', 'paymentMethod'], take: limit, skip: offset });
    }

    public async count(): Promise<number> {
        return await this.ormRepository.count();
    }

    public create(data: CreateTemplate): Template {
        const now = new Date().getTime();
        return this.ormRepository.create({
            ...data,
            createdAt: now,
            updatedAt: now,
        });
    }

    public async save(data: CreateTemplate): Promise<Template> {
        return await this.ormRepository.save(this.create(data));
    }

    public async update(template: Template): Promise<Template> {
        template.updatedAt = new Date().getTime();
        return await this.ormRepository.save(template);
    }

    public async delete(id: string): Promise<void> {
        await this.ormRepository.delete(id);
    }
}
