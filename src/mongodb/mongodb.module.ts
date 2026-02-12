import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MongodbService } from './mongodb.service';
import { MongodbController } from './mongodb.controller';
import { Demo, DemoSchema } from './schemas/demo.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Demo.name, schema: DemoSchema }])],
  providers: [MongodbService],
  controllers: [MongodbController]
})
export class MongodbModule {}
