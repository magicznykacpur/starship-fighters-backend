import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { StarshipsService } from './starships.service';

describe('StarshipsService', () => {
  const crewMembers = 42;
  const uniqueNameConstraint =
    'Unique constraint failed on the fields: (`name`)';
  const noRecordFoundForDelete = 'No record was found for a delete.';

  let starshipsService: StarshipsService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [StarshipsService, PrismaService],
    }).compile();

    starshipsService = app.get<StarshipsService>(StarshipsService);
    prismaService = app.get<PrismaService>(PrismaService);
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
    const createResult = await starshipsService.create({
      data: { name: 'test-starship', crewMembers },
    });

    const findResult = await starshipsService.find({
      where: { id: createResult.id },
    });

    expect(findResult).toBeDefined();
    expect(findResult!.id).toBe(createResult.id);
  });

  it('should not find unique starship with invalid query', async () => {
    const findResult = await starshipsService.find({
      where: { name: 'not-a-starship' },
    });

    expect(findResult).toBe(null);
  });

  it('should find many starships', async () => {
    const data = [...Array(5).keys()].map((value) => {
      return { name: `test-starship-${value}`, crewMembers };
    });

    await starshipsService.createMany({ data });

    const starshipsQuery = data.map((value) => {
      return { name: { equals: value.name } };
    });

    const findManyResult = await starshipsService.findMany({
      where: { OR: starshipsQuery },
    });

    expect(findManyResult).not.toBe(null);
    expect(findManyResult?.length).toBe(5);
    expect(findManyResult?.at(4)?.name).toBe('test-starship-4');
  });

  it('should not find starships with invalid query', async () => {
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
    const data = [...Array(5).keys()].map((value) => {
      return { name: `test-starship-${value}`, crewMembers };
    });

    await starshipsService.createMany({ data });
    const findAllResult = await starshipsService.findAll();

    expect(findAllResult?.length).toBe(5);
  });

  it('should create a new starship', async () => {
    const result = await starshipsService.create({
      data: { name: 'new-test-starship', crewMembers },
    });

    expect(result.id).toBeDefined();
    expect(result.name).toBe('new-test-starship');
    expect(result.crewMembers).toBe(42);
  });

  it('should fail creating a new starship with not unique name', async () => {
    try {
      await starshipsService.create({
        data: { name: 'new-test-starship', crewMembers },
      });
    } catch (e: unknown) {
      expect(e).toBeDefined();
      expect((e as Error).message).toContain(uniqueNameConstraint);
    }
  });

  it('should create many starships', async () => {
    const data = [...Array(5).keys()].map((value) => {
      return { name: `new-test-starship-${value}`, crewMembers };
    });

    await starshipsService.createMany({ data });

    const starshipsQuery = data.map((value) => {
      return { name: { equals: value.name } };
    });

    const findManyResult = await starshipsService.findMany({
      where: {
        OR: starshipsQuery,
      },
    });

    expect(findManyResult).toBeDefined();
    expect(findManyResult?.length).toBe(5);
    expect(findManyResult?.at(4)?.name).toBe('new-test-starship-4');
  });

  it('should fail creating many starships with not unique names', async () => {
    const data = [...Array(5).keys()].map((value) => {
      return { name: `new-test-starship-${value}`, crewMembers };
    });

    try {
      await starshipsService.createMany({ data });
    } catch (e: unknown) {
      expect(e).toBeDefined();
      expect((e as Error).message).toContain(uniqueNameConstraint);
    }
  });

  it('should update single starship', async () => {
    await starshipsService.create({
      data: { name: 'test-starship', crewMembers },
    });

    const starship = await starshipsService.find({
      where: { name: 'test-starship' },
    });

    const updatedStarship = await starshipsService.update({
      where: { id: starship?.id },
      data: {
        name: { set: 'updated-starship-name' },
        crewMembers: { set: 421 },
      },
    });

    expect(updatedStarship.name).toBe('updated-starship-name');
    expect(updatedStarship.crewMembers).toBe(421);
  });

  it('should fail to update a starship when not found', async () => {
    try {
      await starshipsService.update({
        where: { name: 'not-a-test-starship' },
        data: { name: { set: 'not-updated-test-starship-' } },
      });
    } catch (e: unknown) {
      expect(e).toBeDefined();
      expect((e as Error).message).toContain(
        'No record was found for an update.',
      );
    }
  });

  it('should update many starships', async () => {
    const data = [...Array(5).keys()].map((value) => {
      return { name: `test-starship-${value}`, crewMembers };
    });

    await starshipsService.createMany({ data });

    const starshipsQuery = data.map((value) => {
      return { name: { equals: value.name } };
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
    expect(updatedStarships.at(4)?.crewMembers).toBe(521);
  });

  it('should fail to update many starships when not found', async () => {
    try {
      await starshipsService.updateMany({
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
    } catch (e: unknown) {
      expect(e).toBeDefined();
      expect((e as Error).message).toContain(uniqueNameConstraint);
    }
  });

  it('should fail to update many starships when trying to set same name', async () => {
    try {
      await starshipsService.updateMany({
        where: {
          OR: [
            { name: { equals: 'test-starship-0' } },
            { name: { equals: 'test-starship-1' } },
          ],
        },
        data: {
          name: { set: 'updated-starship' },
        },
      });
    } catch (e: unknown) {
      expect(e).toBeDefined();
      expect((e as Error).message).toContain(uniqueNameConstraint);
    }
  });

  it('should delete a starship', async () => {
    const toDelete = await starshipsService.create({
      data: { name: 'starship-to-delete', crewMembers: 1 },
    });

    await starshipsService.delete({ where: { id: toDelete?.id } });

    const deleted = await starshipsService.find({
      where: { id: toDelete?.id },
    });

    expect(deleted).toBe(null);
  });

  it('should fail to delete a starship when not found', async () => {
    try {
      await starshipsService.delete({ where: { name: 'not-a-starship' } });
    } catch (e: unknown) {
      expect(e).toBeDefined();
      expect((e as Error).message).toContain(noRecordFoundForDelete);
    }
  });

  it('should delete many starships', async () => {
    const data = [...Array(5).keys()].map((value) => {
      return { name: `starship-to-delete-${value}`, crewMembers };
    });

    await starshipsService.createMany({ data });

    const queryData = data.map((value) => {
      return {
        name: {
          equals: value.name,
        },
      };
    });

    await starshipsService.deleteMany({ where: { OR: queryData } });

    const starships = await starshipsService.findMany({
      where: { OR: queryData },
    });

    expect(starships?.length).toBe(0);
  });

  it('should fail to delete many starships when not found', async () => {
    const queryData = [...Array(5).keys()].map((value) => {
      return { name: { equals: `starship-to-delete-${value}` } };
    });

    try {
      await starshipsService.deleteMany({ where: { OR: queryData } });
    } catch (e: unknown) {
      expect(e).toBeDefined();
      expect((e as Error).message).toContain(noRecordFoundForDelete);
    }
  });
});
