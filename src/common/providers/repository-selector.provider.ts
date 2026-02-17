import { Provider, Scope, Type } from '@nestjs/common';
import { DatabaseResolver } from '../resolvers/database.resolver';

export function createDatabaseRepositoryProvider(
  token: string,
  postgresRepository: Type<any>,
  mongoRepository: Type<any>,
): Provider {
  return {
    provide: token,
    scope: Scope.REQUEST,
    inject: [DatabaseResolver, postgresRepository, mongoRepository],
    useFactory: (
      databaseResolver: DatabaseResolver,
      postgresRepo: any,
      mongoRepo: any,
    ) => {
      return databaseResolver.provider === 'mongodb' ? mongoRepo : postgresRepo;
    },
  };
}
