import { Test, TestingModule } from '@nestjs/testing';
import { Person } from '@prisma/client';
import { CreateManyPersonArgs } from 'src/generated/models/person/create-many-person.args';
import { PersonCreateInput } from 'src/generated/models/person/person-create.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { PeopleService } from './people.service';

describe('PeopleService', () => {
  let peopleService: PeopleService;

  const uniqueNameConstraint =
    'Unique constraint failed on the fields: (`name`)';
  const noRecordFoundForDelete = 'No record was found for a delete.';

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
          mass: 82 + value * 3,
          birthYear: 1900 + value * 5,
          eyeColor: 'blue',
          hairColor: 'black',
          height: 160 + value * 7,
          homeworld: 'venus',
          skinColor: 'black',
        };
      }),
    };
  };

  const createManyTestPeople = async (): Promise<Person[]> => {
    const args: CreateManyPersonArgs = prepareManyPersonArgs();

    return peopleService.createMany(args);
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeopleService, PrismaService],
    }).compile();

    peopleService = module.get<PeopleService>(PeopleService);
  });

  afterEach(async () => {
    const allPeople = await peopleService.findAll();

    const allPeopleQuery = allPeople?.map((person) => {
      return { id: { equals: person.id } };
    });
    const args = { where: { OR: allPeopleQuery } };

    await peopleService.deleteMany(args);
  });

  it('should provide people service', () => {
    expect(peopleService).toBeDefined();
  });

  it('should find unique person', async () => {
    const createResult = await peopleService.create({ data: testPerson });

    const findResult = await peopleService.find({
      where: { id: createResult.id },
    });

    expect(findResult).toBeDefined();
    expect(findResult!.id).toBe(createResult.id);
  });

  it('should not find unique person with invalid query', async () => {
    await peopleService.create({ data: testPerson });

    const findResult = await peopleService.find({
      where: { name: 'not-a-person' },
    });

    expect(findResult).toBe(null);
  });

  it('should find many people', async () => {
    const people = await createManyTestPeople();
    const peopleQuery = people.map((person) => {
      return { id: { equals: person.id } };
    });
    const args = { where: { OR: peopleQuery } };

    const findManyResult = await peopleService.findMany(args);

    expect(findManyResult).not.toBe(null);
    expect(findManyResult?.length).toBe(5);
    expect(findManyResult?.at(4)?.name).toBe('test-person-4');
  });

  it('should not find people with invalid query', async () => {
    await createManyTestPeople();

    const findManyResult = await peopleService.findMany({
      where: {
        OR: [
          { name: { equals: 'test-person-0' } },
          { name: { equals: 'test-person-3' } },
          { name: { equals: 'test-person-4' } },
        ],
        AND: [{ height: { equals: 5000 } }],
      },
    });

    expect(findManyResult?.length).toBe(0);
  });

  it('should find all the people', async () => {
    await createManyTestPeople();

    const findAllResult = await peopleService.findAll();

    expect(findAllResult?.length).toBe(5);
  });

  it('should create a new person', async () => {
    const result = await peopleService.create({ data: testPerson });

    expect(result.id).toBeDefined();
    expect(result.name).toBe('test-person');
    expect(result.birthYear).toBe(1994);
  });

  it('should fail creating a new person with not unique name', async () => {
    await peopleService.create({ data: testPerson });

    try {
      await peopleService.create({ data: testPerson });
    } catch (e: unknown) {
      expect((e as Error).message).toContain(uniqueNameConstraint);
    }
  });

  it('should create many people', async () => {
    const people = await peopleService.createMany({
      data: [
        { ...testPerson },
        { ...testPerson, name: 'test-person-1' },
        { ...testPerson, name: 'test-person-2' },
        { ...testPerson, name: 'test-person-3' },
        { ...testPerson, name: 'test-person-4' },
      ],
    });

    const peopleQuery = people.map((person) => {
      return { id: { equals: person.id } };
    });
    const args = { where: { OR: peopleQuery } };

    const findManyResult = await peopleService.findMany(args);

    expect(findManyResult).toBeDefined();
    expect(findManyResult?.length).toBe(5);
    expect(findManyResult?.at(4)?.name).toBe('test-person-4');
  });

  it('should fail creating many people with not unique names', async () => {
    const args: CreateManyPersonArgs = prepareManyPersonArgs();

    await peopleService.createMany(args);

    try {
      await peopleService.createMany(args);
    } catch (e: unknown) {
      expect((e as Error).message).toContain(uniqueNameConstraint);
    }
  });

  it('should update single person', async () => {
    const person = await peopleService.create({ data: testPerson });

    const updatedPerson = await peopleService.update({
      where: { id: person?.id },
      data: {
        name: { set: 'updated-person-name' },
        height: { set: 420 },
      },
    });

    expect(updatedPerson.name).toBe('updated-person-name');
    expect(updatedPerson.height).toBe(420);
    expect(updatedPerson.updatedAt).not.toBe(updatedPerson.createdAt);
  });

  it('should fail to update a person when not found', async () => {
    try {
      await peopleService.update({
        where: { name: 'not-a-test-person' },
        data: { name: { set: 'not-updated-test-person' } },
      });
    } catch (e: unknown) {
      expect((e as Error).message).toContain(
        'No record was found for an update.',
      );
    }
  });

  it('should update many people', async () => {
    const people = await createManyTestPeople();
    const peopleQuery = people.map((person) => {
      return { id: { equals: person.id } };
    });
    const args = { where: { OR: peopleQuery }, data: { height: { set: 420 } } };

    const updatedPeople = await peopleService.updateMany(args);

    expect(updatedPeople).toBeDefined();
    expect(updatedPeople.length).toBe(5);

    updatedPeople.forEach((person) => {
      expect(person.height).toBe(420);
    });
  });

  it('should fail to update many people when not found', async () => {
    await createManyTestPeople();

    const updateResult = await peopleService.updateMany({
      where: {
        OR: [
          { name: { equals: 'test-person-12' } },
          { name: { equals: 'test-person-13' } },
        ],
      },
      data: {
        name: { set: 'updated-person-name' },
      },
    });

    expect(updateResult.length).toBe(0);
  });

  it('should fail to update many people when trying to set same name', async () => {
    const people = await createManyTestPeople();
    const peopleQuery = people.map((person) => {
      return { id: { equals: person.id } };
    });

    const args = {
      where: {
        OR: peopleQuery,
      },
      data: {
        name: { set: 'updated-person-name' },
      },
    };

    try {
      await peopleService.updateMany(args);
    } catch (e: unknown) {
      expect((e as Error).message).toContain(uniqueNameConstraint);
    }
  });

  it('should delete a person', async () => {
    const toDelete = await peopleService.create({ data: testPerson });

    await peopleService.delete({ where: { id: toDelete?.id } });

    const deleted = await peopleService.find({
      where: { id: toDelete?.id },
    });

    expect(deleted).toBe(null);
  });

  it('should fail to delete a person when not found', async () => {
    await peopleService.create({ data: testPerson });

    try {
      await peopleService.delete({ where: { name: 'not-a-person' } });
    } catch (e: unknown) {
      expect((e as Error).message).toContain(noRecordFoundForDelete);
    }
  });

  it('should delete many people', async () => {
    const people = await createManyTestPeople();
    const peopleQuery = people.map((person) => {
      return { id: { equals: person.id } };
    });
    const args = { where: { OR: peopleQuery } };

    await peopleService.deleteMany(args);

    const deletedPeople = await peopleService.findMany(args);

    expect(deletedPeople?.length).toBe(0);
  });

  it('should fail to delete many people when not found', async () => {
    const people = await createManyTestPeople();
    const peopleQuery = people.map((person) => {
      return { id: { equals: person.id } };
    });

    const deleteQuery = [...Array(5).keys()].map((value) => {
      return { name: { equals: `person-to-delete-${value}` } };
    });

    const result = await peopleService.deleteMany({
      where: { OR: deleteQuery },
    });

    expect(result).not.toBeDefined();

    const notDeletedPeople = await peopleService.findMany({
      where: { OR: peopleQuery },
    });
    expect(notDeletedPeople?.length).toBe(5);
  });
});
