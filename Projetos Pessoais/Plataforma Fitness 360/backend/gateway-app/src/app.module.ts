import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'members', url: process.env.MEMBERS_GRAPHQL_URL },
            { name: 'billing', url: process.env.BILLING_GRAPHQL_URL },
            { name: 'schedule', url: process.env.SCHEDULE_GRAPHQL_URL }
          ],
        }),
        buildService({ url }) {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }) {
              request.http.headers.set('tenant-id', context.tenantId);
              request.http.headers.set('user-id', context.userId);
            },
          });
        },
      },
    }),
  ],
})
export class AppModule {} 