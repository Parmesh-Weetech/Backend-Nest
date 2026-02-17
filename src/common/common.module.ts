import { Global, Module } from '@nestjs/common';
import { DatabaseResolver } from './resolvers/database.resolver';

@Global()
@Module({
  providers: [DatabaseResolver],
  exports: [DatabaseResolver],
})
export class CommonModule {}

