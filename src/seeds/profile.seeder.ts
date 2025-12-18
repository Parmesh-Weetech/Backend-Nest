import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Profile } from '../entity/Profile.js';
import AppDataSource from '../data-source.js';

export default class ProfileSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const repository = AppDataSource.getRepository(Profile);
        await repository.insert([
            {
                bio: "this is a random bio for seeder user",
                id: "207aab0d-7a1c-4fe9-a7e2-678f33f5db49",
            }
        ]);

        // ---------------------------------------------------

        const profileFactory = factoryManager.get(Profile);
        // save 1 factory generated entity, to the database
        await profileFactory.save();

        // save 5 factory generated entities, to the database
        await profileFactory.saveMany(1);
    }
}