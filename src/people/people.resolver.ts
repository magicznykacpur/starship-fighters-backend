import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PeopleService } from './people.service';
import { Person } from 'src/generated/models/person/person.model';
import { FindManyPersonArgs } from 'src/generated/models/person/find-many-person.args';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FindUniquePersonArgs } from 'src/generated/models/person/find-unique-person.args';
import { CreateOnePersonArgs } from 'src/generated/models/person/create-one-person.args';
import { CreateManyPersonArgs } from 'src/generated/models/person/create-many-person.args';
import { UpdateOnePersonArgs } from 'src/generated/models/person/update-one-person.args';
import { UpdateManyPersonArgs } from 'src/generated/models/person/update-many-person.args';
import { DeleteOnePersonArgs } from 'src/generated/models/person/delete-one-person.args';
import { DeleteManyPersonArgs } from 'src/generated/models/person/delete-many-person.args';

@Resolver('people')
export class PeopleResolver {
  constructor(private readonly peopleService: PeopleService) {}

  @Query(() => [Person])
  async findAllPeople(): Promise<Person[] | null> {
    return this.peopleService.findAll();
  }

  @Query(() => [Person])
  async findManyPeople(@Args() args: FindManyPersonArgs) {
    const people = await this.peopleService.findMany(args);

    if (people?.length === 0 || !people) {
      throw new NotFoundException(
        `People ${JSON.stringify(args.where)} do not exist`,
      );
    }

    return people;
  }

  @Query(() => Person)
  async findPerson(@Args() args: FindUniquePersonArgs) {
    const person = await this.peopleService.find(args);

    if (!person) {
      throw new NotFoundException(
        `Person ${JSON.stringify(args.where)} does not exist`,
      );
    }

    return person;
  }

  @Mutation(() => Person)
  async createPerson(
    @Args() args: CreateOnePersonArgs,
  ): Promise<Person | void> {
    try {
      const person = await this.peopleService.create(args);

      return person;
    } catch (e: unknown) {
      if (
        (e as Error).message.includes(
          'Unique constraint failed on the fields: (`name`)',
        )
      ) {
        throw new BadRequestException('Name must be unique');
      }
    }
  }

  @Mutation(() => [Person])
  async createPeople(
    @Args() args: CreateManyPersonArgs,
  ): Promise<Person[] | void> {
    try {
      const people = await this.peopleService.createMany(args);

      return people;
    } catch (e: unknown) {
      if (
        (e as Error).message.includes(
          'Unique constraint failed on the fields: (`name`)',
        )
      ) {
        throw new BadRequestException('Names must be unique');
      }
    }
  }

  @Mutation(() => Person)
  async updatePerson(
    @Args() args: UpdateOnePersonArgs,
  ): Promise<Person | void> {
    try {
      const person = await this.peopleService.update(args);

      return person;
    } catch (e: unknown) {
      if ((e as Error).message.includes('No record was found for an update.')) {
        throw new BadRequestException('No record was found for an update.');
      }
    }
  }

  @Mutation(() => Person)
  async updatePeople(@Args() args: UpdateManyPersonArgs): Promise<Person[]> {
    const people = await this.peopleService.findMany(args);

    if (!people || people.length === 0) {
      throw new NotFoundException('No records were found for an update.');
    }

    return this.peopleService.updateMany(args);
  }

  @Mutation(() => Person)
  async deletePerson(@Args() args: DeleteOnePersonArgs): Promise<void> {
    const person = await this.peopleService.find(args);

    if (!person) {
      throw new NotFoundException(
        `Person ${JSON.stringify(args.where)} does not exist`,
      );
    }

    await this.peopleService.delete(args);
  }

  @Mutation(() => Person)
  async deletePeople(@Args() args: DeleteManyPersonArgs): Promise<void> {
    const people = await this.peopleService.findMany(args);

    if (!people || people.length === 0) {
      throw new NotFoundException(
        `People ${JSON.stringify(args.where)} do not exist`,
      );
    }

    await this.peopleService.deleteMany(args);
  }
}
