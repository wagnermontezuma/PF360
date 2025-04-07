import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Member } from './domain/entities/member.entity';
import { Contract } from './domain/entities/contract.entity';
import { MemberResolver } from './application/resolvers/member.resolver';
import { MemberService } from './application/services/member.service';
import { KafkaService } from './infrastructure/kafka/kafka.service';
import { AuthGuard } from './application/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production'
    }),
    TypeOrmModule.forFeature([Member, Contract]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: true
    }),
  ],
  providers: [
    MemberResolver,
    MemberService,
    KafkaService,
    AuthGuard,
  ],
})
export class AppModule {} 