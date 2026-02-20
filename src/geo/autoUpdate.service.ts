import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron } from '@nestjs/schedule';
import * as tar from 'tar';
import fsExtra from 'fs-extra';
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class AutoUpdateService {
    constructor(private readonly configService: ConfigService) { }

    @Cron('0 0 1 */1 *')
    async update() {
        await this.updateGeoLiteDB(
            this.configService.get("MAXMIND_ACCOUNT_ID")!,
            this.configService.get("MAXMIND_LICENSE_KEY")!
        );
    }

    async downloadGeoLiteTar(accountId: string, licenseKey: string) {
        const url =
            'https://download.maxmind.com/geoip/databases/GeoLite2-City/download?suffix=tar.gz';
        const destPath = path.join(process.cwd(), 'assets', 'tar.gz', 'GeoLite2-City.tar.gz');

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
        const extractDir = path.join(process.cwd(), 'temp_maxmind');
        await fsExtra.ensureDir(extractDir);

        await tar.x({ file: tarPath, cwd: extractDir }); // ✅ fixed

        const files = await fs.promises.readdir(extractDir);
        const innerFolder = path.join(extractDir, files[0]);
        const mmdbFile = path.join(innerFolder, 'GeoLite2-City.mmdb');

        if (!(await fsExtra.pathExists(mmdbFile))) throw new Error('.mmdb file not found');

        const finalDir = path.join(process.cwd(), 'assets', 'maxmind');
        await fsExtra.ensureDir(finalDir);

        const finalPath = path.join(finalDir, 'GeoLite2-City.mmdb');
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