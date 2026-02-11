import { Injectable } from "@nestjs/common";
import { Files } from "./entities/File.entity";
import { DataSource, In, Not, Repository } from "typeorm";

@Injectable()
export class FileRepository extends Repository<Files> {

    constructor(private dataSource: DataSource) {
        super(Files, dataSource.createEntityManager());
    }

    async saveFile(
        userId: string,
        path: string,
        mimeType: string,
        originalFileName: string,
        status: "PENDING" | "ACTIVE" | "ORPHAN" = "PENDING",
        bucket: string
    ): Promise<Files | null> {
        const newFile = await this.save({
            bucket: bucket,
            mimeType: mimeType,
            originalFileName: originalFileName,
            path: path,
            status: status,
            user: { id: userId }
        });

        if (!newFile) return null;

        return newFile;
    }

    async findAll(userId: string): Promise<Files[] | [] | null> {
        const files = await this.find({
            where: {
                user: { id: userId },
                status: Not(In(['ORPHAN', 'PENDING'])),
            },
        });

        if (!files) return null;

        if (files.length === 0) return [];

        return files;
    }

    async findById(id: string): Promise<Files | null> {
        const file = await this.findOne({ where: { id: id }, relations: ["user"] });

        if(!file) return null;

        return file;
    }

    async updateFile(updateFileMetadata: Files): Promise<Files | null> {
        const file = await this.save(updateFileMetadata);

        if(!file) return null;

        return file;
    }

    async hardDeleteFile(id: string): Promise<boolean> {
        const affectedRows = await this.delete(id);

        if(affectedRows.affected === undefined || affectedRows.affected === null || affectedRows.affected === 0) return false;

        return true;
    }
}