import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import fs from "fs";

@Injectable()
export class FfmpegService {
    async generateHls(inputFilePath: string, outputDir: string) {
        await fs.promises.mkdir(outputDir, { recursive: true });

        return new Promise((resolve, reject) => {
            const ffmpeg = spawn('ffmpeg', [
                '-i', inputFilePath,

                '-filter_complex',
                // split into 4 streams
                '[0:v]split=4[v1][v2][v3][v4];' +
                '[v1]scale=640:360[v1out];' +
                '[v2]scale=854:480[v2out];' +
                '[v3]scale=1280:720[v3out];' +
                '[v4]scale=1920:1080[v4out]',

                // map each video output + audio
                '-map', '[v1out]', '-map', '0:a',
                '-map', '[v2out]', '-map', '0:a',
                '-map', '[v3out]', '-map', '0:a',
                '-map', '[v4out]', '-map', '0:a',

                '-c:v', 'libx264',
                '-c:a', 'aac',

                '-f', 'hls',
                '-hls_time', '6',
                '-hls_playlist_type', 'vod',

                // updated var_stream_map with 4 resolutions
                '-var_stream_map',
                'v:0,a:0,name:360 v:1,a:1,name:480 v:2,a:2,name:720 v:3,a:3,name:1080',

                '-master_pl_name', 'master.m3u8',
                '-hls_segment_filename',
                `${outputDir}/%v/seg_%03d.ts`,

                `${outputDir}/%v/index.m3u8`,
            ]);

            ffmpeg.stderr.on('data', d => console.log(d.toString()));

            ffmpeg.on('close', code =>
                code === 0
                    ? resolve(true)
                    : reject(new Error(`FFmpeg exited with ${code}`)),
            );
        });
    }

}
