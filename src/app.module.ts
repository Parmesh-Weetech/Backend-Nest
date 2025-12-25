import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, ReportsModule, TypeOrmModule.forRoot({ // forRoot method configures global providers(DB connection, cache, config, etc.)
    type: "postgres",
    host: "localhost",
    port: 5440,
    username: "div",
    password: "divpassword",
    database: "divdata",
    entities: [User], // 
    synchronize: true, // don't use it in production because then we will lose our whole data.
    autoLoadEntities: true // automatically loads entity into entities array don't need to add it manually. For this entity must need to register it in forFeature method of each module.
  }), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
