import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import fs from "fs";

@Injectable()
export class FfmpegService {
    async generateHls(videoId: string, outputDir: string) {
        await fs.promises.mkdir(outputDir, { recursive: true });

        return new Promise((resolve, reject) => {
            const ffmpeg = spawn('ffmpeg', [
                '-i', videoId,

                // Video variants
                '-filter_complex',
                '[0:v]split=3[v1][v2][v3]; \
                [v1]scale=640:360[v1out]; \
                [v2]scale=854:480[v2out]; \
                [v3]scale=1280:720[v3out]',

                // Map streams
                '-map', '[v1out]', '-map', '0:a',
                '-map', '[v2out]', '-map', '0:a',
                '-map', '[v3out]', '-map', '0:a',

                // HLS settings
                '-f', 'hls',
                '-hls_time', '6',
                '-hls_playlist_type', 'vod',
                '-hls_segment_filename',
                `${outputDir}/%v/seg_%03d.ts`,
                '-master_pl_name', 'master.m3u8',
                `${outputDir}/%v/index.m3u8`,
            ]);

            ffmpeg.on('close', code =>
                code === 0 ? resolve(true) : reject(new Error('FFmpeg failed')),
            );
        });
    }
}
