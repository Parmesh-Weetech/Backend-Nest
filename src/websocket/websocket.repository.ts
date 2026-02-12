import { DataSource, Repository } from "typeorm";
import { Conversation } from "./entities/conversation.entity";
import { Message } from "./entities/message.entity";
import { User } from "src/user/entities/user.entity";
import { MediaType, MessageAttachment } from "./entities/MessageAttachment.entity";
import { Video } from "src/video/entities/video.entity";
import { Files } from "src/files/entities/File.entity";

export class ConversationRepository extends Repository<Conversation> {

    constructor(private dataSource: DataSource) {
        super(Conversation, dataSource.createEntityManager());
    }

    async findConversation(userId: string, otherUserId: string): Promise<Conversation | null> {
        const conversation = await this.createQueryBuilder('conversation')
            .where(
                '(conversation.user1Id = :userId AND conversation.user2Id = :otherUserId) OR (conversation.user1Id = :otherUserId AND conversation.user2Id = :userId)',
                { userId, otherUserId }
            )
            .getOne();

        if (!conversation) return null;

        return conversation;
    }

    async createConversation(userId: string, otherUserId: string): Promise<Conversation | null> {
        const newConversation = this.create({
            user1: { id: userId },
            user2: { id: otherUserId },
        });

        const saveConversation = await this.save(newConversation);

        if (!saveConversation) return null;

        return saveConversation;
    }

    async findById(id: string): Promise<Conversation | null> {
        const conversation = await this.findOne({
            where: { id: id },
        });

        if (!conversation) return null;

        return conversation;
    }
}

export class MessageRepository extends Repository<Message> {

    constructor(private dataSource: DataSource) {
        super(Message, dataSource.createEntityManager());
    }

    async findAll(conversationId: string, skip: number, take: number): Promise<Message[] | null> {
        const messages = await this.find({
            where: { conversation: { id: conversationId } },
            order: { createdAt: 'DESC' },
            relations: {
                sender: true,
                conversation: true,
                attachments: {
                    media: true,
                },
            },
            skip,
            take,
        });

        if (!messages) return null;

        return messages;
    }

    async createMessage(type: Message['type'], conversation: Conversation, sender: User, content?: string): Promise<Message | null> {
        const newMessage = this.create({
            type: type,
            conversation: conversation,
            sender: sender,
            content: content,
        });

        const savedMessage = await this.save(newMessage);

        if (!savedMessage) return null;

        return savedMessage;
    }
}

export class MessageAttachmentRepository extends Repository<MessageAttachment> {
    constructor(private dataSource: DataSource) {
        super(MessageAttachment, dataSource.createEntityManager());
    }

    async createMessageAttachment(message: Message, mediaType: MediaType, mimeType: string, media: Video | Files, order: number): Promise<MessageAttachment | null> {
        const attachment = this.create({
            message: message,
            media: media,
            mediaType: mediaType,
            mimeType: mimeType,
            order: order,
        });

        if (!attachment) return null;

        return attachment;
    }

    async saveMessageAttachment(messageAttachments: MessageAttachment[]): Promise<MessageAttachment[] | null> {
        const saveMessageAttachments = await this.save(messageAttachments);

        if(!messageAttachments) return null;

        return saveMessageAttachments;
    }
}