import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../entity/User.js';
import AppDataSource from '../data-source.js';
import ProfileSeeder from './profile.seeder.js';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const repository = AppDataSource.getRepository(User);
        await repository.insert([
            {
                name: "kalpesh",
                id: "158b8526-5a78-429d-8b24-1b242cdc3170"
            }
        ]);

        const userFactory = factoryManager.get(User);
        await userFactory.save();

        await userFactory.saveMany(1);
    }
}