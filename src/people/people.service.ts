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
    const person = await this.prisma.person.findUnique(args);

    return person;
  }

  async findAll(): Promise<Person[] | null> {
    const people = await this.prisma.person.findMany();

    return people;
  }

  async findMany(args: FindManyPersonArgs): Promise<Person[] | null> {
    const people = await this.prisma.person.findMany(args);

    return people;
  }

  async create(args: CreateOnePersonArgs): Promise<Person> {
    const person = await this.prisma.person.create(args);

    return person;
  }

  async createMany(args: CreateManyPersonArgs): Promise<Person[]> {
    const people = await this.prisma.person.createManyAndReturn(args);

    return people;
  }

  async update(args: UpdateOnePersonArgs): Promise<Person> {
    const person = await this.prisma.person.update(args);

    return person;
  }

  async updateMany(args: UpdateManyPersonArgs): Promise<Person[]> {
    const people = await this.prisma.person.updateManyAndReturn(args);

    return people;
  }

  async delete(args: DeleteOnePersonArgs): Promise<void> {
    await this.prisma.person.delete(args);
  }

  async deleteMany(args: DeleteManyPersonArgs): Promise<void> {
    await this.prisma.person.deleteMany(args);
  }
}
