import { Files } from '../../src/files/entities/File.entity';
import { Organization } from '../../src/organization/entities/organization.entity';
import { Permission } from '../../src/permission/entities/permission.entity';
import { Role } from '../../src/role/entities/role.entity';
import { Refresh_token } from '../../src/user/entities/refresh_token.entity';
import { User } from '../../src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Video } from '../../src/video/entities/video.entity';
import { Notification } from '../../src/notification/entities/notification.entity';
import { Conversation } from '../../src/websocket/entities/conversation.entity';
import { Message } from '../../src/websocket/entities/message.entity';
import { MessageAttachment } from '../../src/websocket/entities/MessageAttachment.entity';
import { Product } from '../../src/product/entities/product.entity';
import { PostEntity } from '../../src/post/entities/post.entity';

const workerId = process.env.JEST_WORKER_ID || '0';
const schema = `test_${workerId}`;

export const testDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5441,
    username: 'div',
    password: 'divpassword',
    database: 'divdata',
    schema,
    entities: [User, Role, Permission, Organization, Refresh_token, Files, Video, Notification, Conversation, Message, MessageAttachment, Product, PostEntity],
    synchronize: true,
    logging: false,
});
