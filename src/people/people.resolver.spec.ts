import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Person } from '@prisma/client';
import { CreateManyPersonArgs } from 'src/generated/models/person/create-many-person.args';
import { PersonCreateInput } from 'src/generated/models/person/person-create.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { PeopleResolver } from './people.resolver';
import { PeopleService } from './people.service';

describe('PeopleResolver', () => {
  let peopleResolver: PeopleResolver;

  const testPerson: PersonCreateInput = {
    name: 'test-person',
    mass: 82,
    birthYear: 1994,
    eyeColor: 'blue',
    hairColor: 'black',
    height: 188,
    homeworld: 'venus',
    skinColor: 'black',
  };

  const prepareManyPersonArgs = (): CreateManyPersonArgs => {
    return {
      data: [...Array(5).keys()].map((value) => {
        return {
          name: `test-person-${value}`,
          mass: 200 + value,
          birthYear: 2000 + value,
          eyeColor: 'blue',
          hairColor: 'black',
          height: 200 + value,
          homeworld: 'venus',
          skinColor: 'black',
        };
      }),
    };
  };

  const createManyTestPeople = async (): Promise<Person[] | void> => {
    const args: CreateManyPersonArgs = prepareManyPersonArgs();

    return peopleResolver.createPeople(args);
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeopleResolver, PeopleService, PrismaService],
    }).compile();

    peopleResolver = module.get<PeopleResolver>(PeopleResolver);
  });

  afterEach(async () => {
    const allPeople = await peopleResolver.allPeople();

    if (!allPeople || allPeople?.length === 0) {
      return;
    }

    const allPeopleQuery = allPeople?.map((person) => {
      return { id: { equals: person.id } };
    });
    const args = { where: { OR: allPeopleQuery } };

    await peopleResolver.deletePeople(args);
  });

  it('should define resolver', () => {
    expect(peopleResolver).toBeDefined();
  });

  it('should query person by name', async () => {
    await createManyTestPeople();

    const person = await peopleResolver.person({
      where: { name: 'test-person-0' },
    });

    expect(person).toBeDefined();
    expect(person.name).toBe('test-person-0');
    expect(person.eyeColor).toBe('blue');
  });

  it('should throw exception when person with name not found', async () => {
    await createManyTestPeople();

    const args = {
      where: { name: 'not-a-person' },
    };
    const exceptionMesage = `Person ${JSON.stringify(args.where)} does not exist`;

    await expect(peopleResolver.person(args)).rejects.toThrow(
      new NotFoundException(exceptionMesage),
    );
  });

  it('should query person by id', async () => {
    const people = await createManyTestPeople();

    const person = await peopleResolver.person({
      where: { id: people?.at(0)?.id },
    });

    expect(person).toBeDefined();
    expect(person.name).toBe('test-person-0');
    expect(person.eyeColor).toBe('blue');
  });

  it('should throw exception when person with id not found', async () => {
    await createManyTestPeople();

    const args = {
      where: { id: 'test-uuid' },
    };
    const exceptionMesage = `Person ${JSON.stringify(args.where)} does not exist`;

    await expect(peopleResolver.person(args)).rejects.toThrow(
      new NotFoundException(exceptionMesage),
    );
  });

  it('should query person by eye color and name', async () => {
    await createManyTestPeople();

    const person = await peopleResolver.person({
      where: { name: 'test-person-1', AND: [{ eyeColor: { equals: 'blue' } }] },
    });

    expect(person).toBeDefined();
    expect(person.name).toBe('test-person-1');
    expect(person.eyeColor).toBe('blue');
  });

  it('should query all people', async () => {
    await createManyTestPeople();

    const people = await peopleResolver.allPeople();

    expect(people?.length).toBe(5);
    expect(people?.at(0)?.name).toBe('test-person-0');
  });

  it('should return no people', async () => {
    const people = await peopleResolver.allPeople();

    expect(people?.length).toBe(0);
  });

  it('should query many people', async () => {
    const seededPeople = await createManyTestPeople();
    const peopleQuery = seededPeople!.map((person) => {
      return { id: { equals: person.id } };
    });
    const args = { where: { OR: peopleQuery } };

    const people = await peopleResolver.people(args);

    expect(people).toBeDefined();
    expect(people.length).toBe(5);
    expect(people.at(0)?.name).toBe('test-person-0');
  });

  it('should throw exception when people not found', async () => {
    await createManyTestPeople();

    const args = {
      where: {
        OR: [
          { name: { equals: 'not-a-person-0' } },
          { name: { equals: 'not-a-person-1' } },
          { name: { equals: 'not-a-person-2' } },
        ],
      },
    };
    const exceptionMessage = `People ${JSON.stringify(args.where)} do not exist`;

    await expect(peopleResolver.people(args)).rejects.toThrow(
      new NotFoundException(exceptionMessage),
    );
  });

  it('should create a new person', async () => {
    const person = await peopleResolver.createPerson({
      data: testPerson,
    });

    expect(person).toBeDefined();
    expect(person?.name).toBe(testPerson.name);
    expect(person?.birthYear).toBe(testPerson.birthYear);
  });

  it('should create many people', async () => {
    const manyPersonArgs = prepareManyPersonArgs();

    const people = await peopleResolver.createPeople(manyPersonArgs);

    expect(people).toBeDefined();
    expect(people?.length).toBe(5);
    expect(people?.at(0)?.name).toBe(manyPersonArgs.data[0].name);
  });

  it('should fail to create a person with not unique name', async () => {
    await peopleResolver.createPerson({ data: testPerson });

    await expect(
      peopleResolver.createPerson({ data: testPerson }),
    ).rejects.toThrow(new BadRequestException('Name must be unique'));
  });

  it('should fail to create many people with not unique names', async () => {
    const args: CreateManyPersonArgs = prepareManyPersonArgs();

    await peopleResolver.createPeople(args);

    await expect(peopleResolver.createPeople(args)).rejects.toThrow(
      new BadRequestException('Names must be unique'),
    );
  });

  it('should update person', async () => {
    const person = await peopleResolver.createPerson({
      data: testPerson,
    });

    const updatedPerson = await peopleResolver.updatePerson({
      where: { id: person!.id },
      data: {
        name: { set: 'updated-person' },
        eyeColor: { set: 'updated-eyes' },
        mass: { set: 420 },
        height: { set: 202 },
      },
    });

    expect(updatedPerson).toBeDefined();
    expect(updatedPerson!.updatedAt).not.toBe(updatedPerson!.createdAt);
    expect(updatedPerson!.name).toBe('updated-person');
    expect(updatedPerson!.eyeColor).toBe('updated-eyes');
    expect(updatedPerson!.mass).toBe(420);
    expect(updatedPerson!.height).toBe(202);
  });

  it('should throw exception when person was not found for update', async () => {
    const person = await peopleResolver.createPerson({
      data: testPerson,
    });

    const args = {
      where: { id: `${person!.id}X` },
      data: { name: { set: 'not-updated' } },
    };

    await expect(peopleResolver.updatePerson(args)).rejects.toThrow(
      new BadRequestException('No record was found for an update.'),
    );
  });

  it('should update people', async () => {
    const people = await createManyTestPeople();
    const peopleQuery = people!.map((person) => {
      return { id: { equals: person.id } };
    });

    const updatedPeople = await peopleResolver.updatePeople({
      where: {
        OR: peopleQuery,
      },
      data: {
        homeworld: { set: 'proxima-centauri' },
      },
    });

    expect(updatedPeople.length).toBe(5);

    updatedPeople.forEach((person) => {
      expect(person.homeworld).toBe('proxima-centauri');
    });
  });

  it('should throw exception when people were not found for update', async () => {
    const people = await createManyTestPeople();
    const peopleQuery = people!.map((person) => {
      return { id: { equals: `${person.id}X` } };
    });

    await expect(
      peopleResolver.updatePeople({
        where: { OR: peopleQuery },
        data: { homeworld: { set: 'proxima-centauri' } },
      }),
    ).rejects.toThrow(
      new NotFoundException('No records were found for an update.'),
    );
  });

  it('should delete a person', async () => {
    const toDelete = await peopleResolver.createPerson({
      data: testPerson,
    });

    const args = { where: { id: toDelete!.id } };
    const exceptionMessage = `Person ${JSON.stringify(args.where)} does not exist`;

    await peopleResolver.deletePerson(args);

    await expect(peopleResolver.person(args)).rejects.toThrow(
      new NotFoundException(exceptionMessage),
    );
  });

  it('should throw an exception when person not found during delete', async () => {
    const args = { where: { id: 'uuid' } };
    const exceptionMessage = `Person ${JSON.stringify(args.where)} does not exist`;

    await expect(peopleResolver.deletePerson(args)).rejects.toThrow(
      new NotFoundException(exceptionMessage),
    );
  });

  it('should delete many people', async () => {
    const people = await createManyTestPeople();
    const peopleQuery = people!.map((person) => {
      return {
        id: { equals: person.id },
      };
    });
    const args = { where: { OR: peopleQuery } };

    await peopleResolver.deletePeople(args);

    await expect(peopleResolver.people(args)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should fail to delete many people', async () => {
    const people = await createManyTestPeople();
    const peopleQuery = people!.map((person) => {
      return {
        id: { equals: `${person.id}X` },
      };
    });

    await expect(
      peopleResolver.deletePeople({ where: { OR: peopleQuery } }),
    ).rejects.toThrow(NotFoundException);
  });
});
