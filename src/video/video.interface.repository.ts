import { Video } from '../video/entities/video.entity';

export const VIDEO_REPOSITORY = 'VIDEO_REPOSITORY';

export interface IVideoRepository {
    create(data: Partial<Video>): Promise<Video>;
    save(video: Partial<Video>): Promise<Video>;
    findById(id: string): Promise<Video | null>;
    update(id: string, data: Partial<Video>): Promise<void>;
    delete(id: string): Promise<void>;
}
