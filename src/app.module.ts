import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { StarshipsModule } from './starships/starships.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      ...(process.env.NODE_ENV === 'production' && { graphiql: false }),
    }),
    StarshipsModule,
  ],
})
export class AppModule {}
