import { Module } from '@nestjs/common';
import { StarshipResolver } from './starships.resolver';
import { StarshipService } from './starships.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [StarshipResolver, StarshipService, PrismaService],
})
export class StarshipsModule {}
