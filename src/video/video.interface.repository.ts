import { Video } from "./entities/video.entity";

export interface IVideoRepository {
    findOneById(id: string): Promise<Video | null>;
    save(video: Video): Promise<Video>;
    update(id: string, videoData: Partial<Video>): Promise<Video>;
    delete(id: string): Promise<void>;
}