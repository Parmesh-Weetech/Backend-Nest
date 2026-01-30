import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class LoggingService {
    constructor(
        @InjectRepository(Log)
        private readonly loggingRepository: Repository<Log>
    ) {}

}
