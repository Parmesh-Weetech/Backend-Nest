import { setSeederFactory } from 'typeorm-extension';
import { Profile } from '../entity/Profile.js';

export default setSeederFactory(Profile, (faker) => {
    const profile = new Profile();
    profile.bio = faker.lorem.sentence(2);
    profile.id = faker.string.uuid()

    return profile;
})