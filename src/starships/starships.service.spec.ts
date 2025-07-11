import { Test, TestingModule } from '@nestjs/testing';
import { Starship, StarshipClass } from '@prisma/client';
import { CreateManyStarshipArgs } from 'src/generated/models/starship/create-many-starship.args';
import { StarshipCreateInput } from 'src/generated/models/starship/starship-create.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { StarshipsService } from './starships.service';

describe('StarshipsService', () => {
  let starshipsService: StarshipsService;
  let prismaService: PrismaService;

  const uniqueNameConstraint =
    'Unique constraint failed on the fields: (`name`)';
  const uniqueModelConstraint =
    'Unique constraint failed on the fields: (`model`)';
  const noRecordFoundForDelete = 'No record was found for a delete.';

  const testStarShip: StarshipCreateInput = {
    name: 'test-starship',
    model: 'model-0',
    length: 2500,
    cargoCapacity: 1000,
    maxSpeed: 500,
    hyperdriveRating: 1.0,
    starshipClass: StarshipClass.FIGHTER,
    crewMembers: 42,
  };

  const prepareManyStarshipsArgs = (): CreateManyStarshipArgs => {
    return {
      data: [...Array(5).keys()].map((value) => {
        return {
          name: `test-starship-${value}`,
          model: `model-${value}`,
          length: 2500 * value,
          cargoCapacity: 1000 * value,
          maxSpeed: 500 * value,
          hyperdriveRating: 1.0 * value,
          starshipClass:
            value % 2 === 1 ? StarshipClass.FIGHTER : StarshipClass.SPEEDER,
          crewMembers: 42,
        };
      }),
    };
  };

  const createManyTestStarships = async (): Promise<Starship[]> => {
    const args: CreateManyStarshipArgs = prepareManyStarshipsArgs();

    const starships = await starshipsService.createMany(args);

    return starships;
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StarshipsService, PrismaService],
    }).compile();

    starshipsService = module.get<StarshipsService>(StarshipsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    const allStarships = await starshipsService.findAll();

    const starshipsQuery = allStarships?.map((starship) => {
      return { id: { equals: starship.id } };
    });

    await starshipsService.deleteMany({
      where: {
        OR: starshipsQuery,
      },
    });
  });

  it('should provide starships service', () => {
    expect(starshipsService).toBeDefined();
  });

  it('should provide prisma service', () => {
    expect(prismaService).toBeDefined();
  });

  it('should find unique starship', async () => {
    const createResult = await starshipsService.create({ data: testStarShip });

    const findResult = await starshipsService.find({
      where: { id: createResult.id },
    });

    expect(findResult).toBeDefined();
    expect(findResult!.id).toBe(createResult.id);
  });

  it('should not find unique starship with invalid query', async () => {
    await starshipsService.create({ data: testStarShip });

    const findResult = await starshipsService.find({
      where: { name: 'not-a-starship' },
    });

    expect(findResult).toBe(null);
  });

  it('should find many starships', async () => {
    const starships = await createManyTestStarships();
    const starshipsQuery = starships.map((starship) => {
      return { id: { equals: starship.id } };
    });

    const findManyResult = await starshipsService.findMany({
      where: { OR: starshipsQuery },
    });

    expect(findManyResult).not.toBe(null);
    expect(findManyResult?.length).toBe(5);
    expect(findManyResult?.at(4)?.name).toBe('test-starship-4');
  });

  it('should not find starships with invalid query', async () => {
    await createManyTestStarships();

    const findManyResult = await starshipsService.findMany({
      where: {
        OR: [
          { name: { equals: 'test-starship-0' } },
          { name: { equals: 'test-starship-3' } },
          { name: { equals: 'test-starship-4' } },
        ],
        AND: [{ crewMembers: { equals: 421 } }],
      },
    });

    expect(findManyResult?.length).toBe(0);
  });

  it('should find all the starships', async () => {
    await createManyTestStarships();

    const findAllResult = await starshipsService.findAll();

    expect(findAllResult?.length).toBe(5);
  });

  it('should create a new starship', async () => {
    const result = await starshipsService.create({ data: testStarShip });

    expect(result.id).toBeDefined();
    expect(result.name).toBe('test-starship');
    expect(result.crewMembers).toBe(42);
  });

  it('should fail creating a new starship with not unique name', async () => {
    await starshipsService.create({ data: testStarShip });

    try {
      await starshipsService.create({ data: testStarShip });
    } catch (e: unknown) {
      expect((e as Error).message).toContain(uniqueNameConstraint);
    }
  });

  it('should fail creating a new starship with not unique model', async () => {
    await starshipsService.create({ data: testStarShip });

    try {
      await starshipsService.create({
        data: { ...testStarShip, name: 'new-name' },
      });
    } catch (e: unknown) {
      expect((e as Error).message).toContain(uniqueModelConstraint);
    }
  });

  it('should create many starships', async () => {
    const starships = await createManyTestStarships();
    const starshipsQuery = starships.map((starship) => {
      return { id: { equals: starship.id } };
    });

    const findManyResult = await starshipsService.findMany({
      where: {
        OR: starshipsQuery,
      },
    });

    expect(findManyResult).toBeDefined();
    expect(findManyResult?.length).toBe(5);
    expect(findManyResult?.at(4)?.name).toBe('test-starship-4');
  });

  it('should fail creating many starships with not unique names', async () => {
    const args: CreateManyStarshipArgs = prepareManyStarshipsArgs();

    await starshipsService.createMany(args);

    try {
      await starshipsService.createMany(args);
    } catch (e: unknown) {
      expect((e as Error).message).toContain(uniqueNameConstraint);
    }
  });

  it('should fail creating many starships with not unique models', async () => {
    const args: CreateManyStarshipArgs = prepareManyStarshipsArgs();

    const starships = await starshipsService.createMany(args);

    const uniqueNames = starships.map((starship) => {
      return {
        ...starship,
        id: undefined,
        name: `${starship.id}-${starship.name}`,
      };
    });

    try {
      await starshipsService.createMany({ data: uniqueNames });
    } catch (e: unknown) {
      expect((e as Error).message).toContain(uniqueModelConstraint);
    }
  });

  it('should update single starship', async () => {
    const starship = await starshipsService.create({ data: testStarShip });

    const updatedStarship = await starshipsService.update({
      where: { id: starship?.id },
      data: {
        name: { set: 'updated-starship-name' },
        crewMembers: { set: 421 },
      },
    });

    expect(updatedStarship.name).toBe('updated-starship-name');
    expect(updatedStarship.crewMembers).toBe(421);
    expect(updatedStarship.updatedAt).not.toBe(updatedStarship.createdAt);
  });

  it('should fail to update a starship when not found', async () => {
    await starshipsService.create({ data: testStarShip });

    try {
      await starshipsService.update({
        where: { name: 'not-a-test-starship' },
        data: { name: { set: 'not-updated-test-starship-' } },
      });
    } catch (e: unknown) {
      expect((e as Error).message).toContain(
        'No record was found for an update.',
      );
    }
  });

  it('should update many starships', async () => {
    const starships = await createManyTestStarships();
    const starshipsQuery = starships.map((starship) => {
      return { id: { equals: starship.id } };
    });

    const updatedStarships = await starshipsService.updateMany({
      where: {
        OR: starshipsQuery,
      },
      data: {
        crewMembers: { set: 521 },
      },
    });

    expect(updatedStarships).toBeDefined();
    expect(updatedStarships.length).toBe(5);

    updatedStarships.forEach((starship) => {
      expect(starship.crewMembers).toBe(521);
    });
  });

  it('should fail to update many starships when not found', async () => {
    await createManyTestStarships();

    const updateResult = await starshipsService.updateMany({
      where: {
        OR: [
          { name: { equals: 'test-starship-12' } },
          { name: { equals: 'test-starship-13' } },
        ],
      },
      data: {
        name: { set: 'updated-starship' },
      },
    });

    expect(updateResult.length).toBe(0);
  });

  it('should fail to update many starships when trying to set same name', async () => {
    const starships = await createManyTestStarships();
    const starshipsQuery = starships.map((starship) => {
      return { id: { equals: starship.id } };
    });

    const args = {
      where: {
        OR: starshipsQuery,
      },
      data: {
        name: { set: 'updated-starship' },
      },
    };

    try {
      await starshipsService.updateMany(args);
    } catch (e: unknown) {
      expect((e as Error).message).toContain(uniqueNameConstraint);
    }
  });

  it('should delete a starship', async () => {
    const toDelete = await starshipsService.create({ data: testStarShip });

    await starshipsService.delete({ where: { id: toDelete?.id } });

    const deleted = await starshipsService.find({
      where: { id: toDelete?.id },
    });

    expect(deleted).toBe(null);
  });

  it('should fail to delete a starship when not found', async () => {
    await starshipsService.create({ data: testStarShip });

    try {
      await starshipsService.delete({ where: { name: 'not-a-starship' } });
    } catch (e: unknown) {
      expect((e as Error).message).toContain(noRecordFoundForDelete);
    }
  });

  it('should delete many starships', async () => {
    const starships = await createManyTestStarships();
    const starshipsQuery = starships.map((starship) => {
      return { id: { equals: starship.id } };
    });

    await starshipsService.deleteMany({ where: { OR: starshipsQuery } });

    const deletedStarships = await starshipsService.findMany({
      where: { OR: starshipsQuery },
    });

    expect(deletedStarships?.length).toBe(0);
  });

  it('should fail to delete many starships when not found', async () => {
    const starships = await createManyTestStarships();
    const starshipsQuery = starships.map((starship) => {
      return { id: { equals: starship.id } };
    });

    const deleteQuery = [...Array(5).keys()].map((value) => {
      return { name: { equals: `starship-to-delete-${value}` } };
    });

    const result = await starshipsService.deleteMany({
      where: { OR: deleteQuery },
    });
    expect(result).not.toBeDefined();

    const notDeletedStarships = await starshipsService.findMany({
      where: { OR: starshipsQuery },
    });

    expect(notDeletedStarships?.length).toBe(5);
  });
});
