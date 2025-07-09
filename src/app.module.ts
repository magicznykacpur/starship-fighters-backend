import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      ...(process.env.NODE_ENV === 'PRODUCTION' && { graphiql: false }),
    }),
  ],
  controllers: [],
})
export class AppModule {}
