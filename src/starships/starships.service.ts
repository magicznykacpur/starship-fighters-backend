import { Injectable } from '@nestjs/common';
import { CreateManyStarshipArgs } from 'src/generated/models/starship/create-many-starship.args';
import { CreateOneStarshipArgs } from 'src/generated/models/starship/create-one-starship.args';
import { DeleteManyStarshipArgs } from 'src/generated/models/starship/delete-many-starship.args';
import { DeleteOneStarshipArgs } from 'src/generated/models/starship/delete-one-starship.args';
import { FindManyStarshipArgs } from 'src/generated/models/starship/find-many-starship.args';
import { FindUniqueStarshipArgs } from 'src/generated/models/starship/find-unique-starship.args';
import { Starship } from 'src/generated/models/starship/starship.model';
import { UpdateManyStarshipArgs } from 'src/generated/models/starship/update-many-starship.args';
import { UpdateOneStarshipArgs } from 'src/generated/models/starship/update-one-starship.args';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StarshipsService {
  constructor(private readonly prisma: PrismaService) {}

  async find({ where }: FindUniqueStarshipArgs): Promise<Starship | null> {
    const starship = await this.prisma.starship.findUnique({ where });

    return starship;
  }

  async findAll(): Promise<Starship[] | null> {
    const starships = await this.prisma.starship.findMany();

    return starships;
  }

  async findMany({
    where,
    take,
    skip,
    orderBy,
  }: FindManyStarshipArgs): Promise<Starship[] | null> {
    const starships = await this.prisma.starship.findMany({
      where,
      take,
      skip,
      orderBy,
    });

    return starships;
  }

  async create({ data }: CreateOneStarshipArgs): Promise<Starship> {
    const starship = await this.prisma.starship.create({ data });

    return starship;
  }

  async createMany({ data }: CreateManyStarshipArgs): Promise<Starship[]> {
    const starships = await this.prisma.starship.createManyAndReturn({ data });

    return starships;
  }

  async update({ where, data }: UpdateOneStarshipArgs): Promise<Starship> {
    const starship = await this.prisma.starship.update({ where, data });

    return starship;
  }

  async updateMany({
    where,
    data,
  }: UpdateManyStarshipArgs): Promise<Starship[]> {
    const starships = await this.prisma.starship.updateManyAndReturn({
      where,
      data,
    });

    return starships;
  }

  async delete({ where }: DeleteOneStarshipArgs): Promise<void> {
    await this.prisma.starship.delete({ where });
  }

  async deleteMany({ where }: DeleteManyStarshipArgs): Promise<void> {
    await this.prisma.starship.deleteMany({ where });
  }
}
