import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PeopleResolver } from './people.resolver';
import { PeopleService } from './people.service';

@Module({
  providers: [PeopleResolver, PeopleService, PrismaService],
})
export class PeopleModule {}
