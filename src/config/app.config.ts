import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
    port: 3000 | 3001,
    nodenv: 'development',
}));