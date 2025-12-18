import { setSeederFactory } from 'typeorm-extension';
import { User } from '../entity/User.js';
import { Profile } from '../entity/Profile.js';

export default setSeederFactory(User, async (faker) => {
    const user = new User();

    user.id = faker.string.uuid();
    user.name = faker.person.firstName(); 

    const profile = new Profile();
    profile.id = faker.string.uuid();
    profile.bio = faker.lorem.paragraph(1);

    user.profile = profile;

    return user;
});

