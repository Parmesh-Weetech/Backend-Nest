import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';

@Injectable()
export class FfmpegService {
    // A promisified version of exec to allow better error handling
    async generateHls(inputFilePath: string, outputDir: string): Promise<any> {
        // Ensure the output directory exists
        await fs.promises.mkdir(outputDir, { recursive: true });

        // Return a Promise that wraps the FFmpeg process
        return new Promise((resolve, reject) => {
            // Spawn the FFmpeg process
            const ffmpeg = spawn('ffmpeg', [
                '-i', inputFilePath,
                '-filter_complex',
                '[0:v]split=4[v1][v2][v3][v4];' +
                '[v1]scale=640:360[v1out];' +
                '[v2]scale=854:480[v2out];' +
                '[v3]scale=1280:720[v3out];' +
                '[v4]scale=1920:1080[v4out]',
                '-map', '[v1out]', '-map', '0:a',
                '-map', '[v2out]', '-map', '0:a',
                '-map', '[v3out]', '-map', '0:a',
                '-map', '[v4out]', '-map', '0:a',
                '-c:v', 'libx264',
                '-c:a', 'aac',
                '-f', 'hls',
                '-hls_time', '6',
                '-hls_playlist_type', 'vod',
                '-var_stream_map',
                'v:0,a:0,name:360 v:1,a:1,name:480 v:2,a:2,name:720 v:3,a:3,name:1080',
                '-master_pl_name', 'master.m3u8',
                '-hls_segment_filename',
                `${outputDir}/%v/seg_%03d.ts`,
                `${outputDir}/%v/index.m3u8`,
            ]);

            // Stream ffmpeg's stderr to the console for debugging
            ffmpeg.stderr.on('data', (data) => {
                console.error(`FFmpeg stderr: ${data.toString()}`);
            });

            // When FFmpeg finishes, handle the exit
            ffmpeg.on('close', (code) => {
                if (code === 0) {
                    // Success: resolve the Promise
                    resolve({ success: true });
                } else {
                    // Failure: reject with the error
                    reject(new Error(`FFmpeg exited with code ${code}`));
                }
            });

            // Optional: capture stdout (to see the progress, if needed)
            ffmpeg.stdout.on('data', (data) => {
                console.log(`FFmpeg stdout: ${data.toString()}`);
            });

            // Optional: handling for child process errors
            ffmpeg.on('error', (err) => {
                reject(new Error(`FFmpeg process error: ${err.message}`));
            });
        });
    }
}
