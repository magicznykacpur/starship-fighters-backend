import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { StarshipsModule } from './starships/starships.module';
import { PeopleModule } from './people/people.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: 'api',
      graphiql: process.env.NODE_ENV !== 'production',
      autoSchemaFile: true,
    }),
    StarshipsModule,
    PeopleModule,
  ],
})
export class AppModule {}
