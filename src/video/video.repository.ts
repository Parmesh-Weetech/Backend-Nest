import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Video } from "./entities/video.entity";

@Injectable()
export class VideoRepository extends Repository<Video> {

    constructor(private dataSource: DataSource) {
        super(Video, dataSource.createEntityManager());
    }

    async saveVideo(
        id: string, 
        path: string, 
        status: "PENDING" | "PROCESSING" | "ACTIVE" | "FAILED", 
        userId: string, 
        originalVideoName,
        mimeType: string,
        bucket: string,
    ): Promise<Video | null> {
        const video = await this.save({
            id: id,
            bucket: bucket,
            mimeType: mimeType,
            originalVideoName: originalVideoName,
            path: path,
            status: status,
            user: { id: userId }
        });

        if(!video) return null;

        return video;
    }

    async findById(id: string): Promise<Video | null> {
        const video = this.findOne({ where: { id: id } });

        if(!video) return null;
        
        return video;
    }
}