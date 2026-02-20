import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron } from '@nestjs/schedule';
import * as tar from 'tar';
import fsExtra from 'fs-extra';
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class AutoUpdateMaxmindFile {
    constructor(private readonly configService: ConfigService) { }

    @Cron('0 0 1 */1 *')
    async update() {
        await this.updateGeoLiteDB(
            this.configService.get("MAXMIND_ACCOUNT_ID")!,
            this.configService.get("MAXMIND_LICENSE_KEY")!
        );
    }

    async downloadGeoLiteTar(accountId: string, licenseKey: string) {
        const url = this.configService.get("DOWNLOAD_COMMAND")!;
        const tar_file = this.configService.get("TAR_FILE")!;
        const destPath = path.join(process.cwd(), '../project', 'assets', 'tar.gz', tar_file);

        const res = await fetch(url, {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${accountId}:${licenseKey}`).toString('base64'),
            },
            redirect: 'follow',
        });

        if (!res.ok || !res.body) {
            throw new Error(`Failed to download: ${res.status} ${res.statusText}`);
        }

        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(destPath, buffer);
        return destPath;
    }

    async extractAndMoveMMDB(tarPath: string) {
        const mmdb_file = this.configService.get("MMDB_FILE")!;
        const extractDir = path.join(process.cwd(), 'temp_maxmind');
        await fsExtra.ensureDir(extractDir);

        await tar.x({ file: tarPath, cwd: extractDir });

        const files = await fs.promises.readdir(extractDir);
        const innerFolder = path.join(extractDir, files[0]);
        const mmdbFile = path.join(innerFolder, mmdb_file);

        if (!(await fsExtra.pathExists(mmdbFile))) throw new Error('.mmdb file not found');

        const finalDir = path.join(process.cwd(), '../project', 'assets', 'maxmind');
        await fsExtra.ensureDir(finalDir);

        const finalPath = path.join(finalDir, mmdb_file);
        await fsExtra.move(mmdbFile, finalPath, { overwrite: true });

        await fsExtra.remove(extractDir);
        await fsExtra.remove(tarPath);

        console.log('GeoLite2-City.mmdb extracted to', finalPath);
    }

    async updateGeoLiteDB(accountId: string, licenseKey: string) {
        try {
            const tarPath = await this.downloadGeoLiteTar(accountId, licenseKey);
            await this.extractAndMoveMMDB(tarPath);
            console.log('GeoLite2 DB updated successfully!');
        } catch (err) {
            console.error('Failed to update GeoLite2 DB:', err);
        }
    }
}