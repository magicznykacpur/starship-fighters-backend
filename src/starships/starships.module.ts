import { Module } from '@nestjs/common';
import { StarshipsResolver } from './starships.resolver';
import { StarshipsService } from './starships.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [StarshipsResolver, StarshipsService, PrismaService],
})
export class StarshipsModule {}
