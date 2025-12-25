import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/create-user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ReportsModule, TypeOrmModule.forRoot({ // forRoot method configures global providers(DB connection, cache, config, etc.)
    type: "postgres",
    host: "localhost",
    port: 5440,
    username: "div",
    password: "divpassword",
    database: "divdata",
    entities: [User], // 
    synchronize: true, // don't use it in production because this will automatically update the table once we update the entity no need of migrations.
    autoLoadEntities: true // automatically loads entity into entities array don't need to add it manually. For this entity must need to register it in forFeature method of each module.
  }), UserModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
