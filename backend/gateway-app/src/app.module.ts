import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      path: '/graphql',
      cors: true,
      introspection: true,
      gateway: {
        serviceList: [
          { name: 'members', url: 'http://members-svc:3001/graphql' },
          { name: 'billing', url: 'http://billing-svc:3002/graphql' },
        ],
      },
    }),
  ],
})
export class AppModule {} 