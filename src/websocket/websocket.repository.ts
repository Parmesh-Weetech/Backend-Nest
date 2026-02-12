import { DataSource, Repository } from "typeorm";
import { Conversation } from "./entities/conversation.entity";
import { Message } from "./entities/message.entity";

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
}

export class MessageRepository extends Repository<Message> {

    constructor(private dataSource: DataSource) {
        super(Conversation, dataSource.createEntityManager());
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

        if(!messages) return null;

        return messages;
    }
}