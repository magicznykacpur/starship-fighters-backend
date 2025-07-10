import { Injectable } from '@nestjs/common';
import { Person } from '@prisma/client';
import { CreateManyPersonArgs } from 'src/generated/models/person/create-many-person.args';
import { CreateOnePersonArgs } from 'src/generated/models/person/create-one-person.args';
import { DeleteManyPersonArgs } from 'src/generated/models/person/delete-many-person.args';
import { DeleteOnePersonArgs } from 'src/generated/models/person/delete-one-person.args';
import { FindManyPersonArgs } from 'src/generated/models/person/find-many-person.args';
import { FindUniquePersonArgs } from 'src/generated/models/person/find-unique-person.args';
import { UpdateManyPersonArgs } from 'src/generated/models/person/update-many-person.args';
import { UpdateOnePersonArgs } from 'src/generated/models/person/update-one-person.args';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PeopleService {
  constructor(private readonly prisma: PrismaService) {}

  async find(args: FindUniquePersonArgs): Promise<Person | null> {
    return this.prisma.person.findUnique(args);
  }

  async findAll(): Promise<Person[] | null> {
    return this.prisma.person.findMany();
  }

  async findMany({ where }: FindManyPersonArgs): Promise<Person[] | null> {
    return this.prisma.person.findMany({ where });
  }

  async create(args: CreateOnePersonArgs): Promise<Person> {
    return this.prisma.person.create(args);
  }

  async createMany(args: CreateManyPersonArgs): Promise<Person[]> {
    return this.prisma.person.createManyAndReturn(args);
  }

  async update(args: UpdateOnePersonArgs): Promise<Person> {
    return await this.prisma.person.update(args);
  }

  async updateMany(args: UpdateManyPersonArgs): Promise<Person[]> {
    return await this.prisma.person.updateManyAndReturn(args);
  }

  async delete(args: DeleteOnePersonArgs): Promise<void> {
    await this.prisma.person.delete(args);
  }

  async deleteMany(args: DeleteManyPersonArgs): Promise<void> {
    await this.prisma.person.deleteMany(args);
  }
}
