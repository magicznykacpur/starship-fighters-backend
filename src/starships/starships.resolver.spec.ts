import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Starship, StarshipClass } from '@prisma/client';
import { CreateManyStarshipArgs } from 'src/generated/models/starship/create-many-starship.args';
import { StarshipCreateInput } from 'src/generated/models/starship/starship-create.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { StarshipsResolver } from './starships.resolver';
import { StarshipsService } from './starships.service';

describe('StarshipsResolver', () => {
  let starshipsResolver: StarshipsResolver;

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

  const createManyTestStarships = async (): Promise<Starship[] | void> => {
    const createStarshipArgs: CreateManyStarshipArgs =
      prepareManyStarshipsArgs();

    return starshipsResolver.createStarships({ data: createStarshipArgs.data });
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StarshipsResolver, StarshipsService, PrismaService],
    }).compile();

    starshipsResolver = module.get<StarshipsResolver>(StarshipsResolver);
  });

  afterEach(async () => {
    const allStarships = await starshipsResolver.allStarships();

    if (!allStarships || allStarships?.length === 0) {
      return;
    }

    const starshipsQuery = allStarships?.map((starship) => {
      return { id: { equals: starship.id } };
    });

    await starshipsResolver.deleteStarships({
      where: {
        OR: starshipsQuery,
      },
    });
  });

  it('should define resolver', () => {
    expect(starshipsResolver).toBeDefined();
  });

  it('should query starship by name', async () => {
    await createManyTestStarships();

    const starship = await starshipsResolver.starship({
      where: { name: 'test-starship-0' },
    });

    expect(starship).toBeDefined();
    expect(starship.name).toBe('test-starship-0');
    expect(starship.model).toBe('model-0');
  });

  it('should throw exception when starship with name not found', async () => {
    await createManyTestStarships();

    const args = {
      where: { name: 'not-starship' },
    };
    const exceptionMesage = `Starship ${JSON.stringify(args.where)} does not exist`;

    await expect(starshipsResolver.starship(args)).rejects.toThrow(
      new NotFoundException(exceptionMesage),
    );
  });

  it('should query starship by model', async () => {
    await createManyTestStarships();

    const starship = await starshipsResolver.starship({
      where: { model: 'model-0' },
    });

    expect(starship).toBeDefined();
    expect(starship.name).toBe('test-starship-0');
    expect(starship.model).toBe('model-0');
  });

  it('should throw exception when starship with model not found', async () => {
    await createManyTestStarships();

    const args = {
      where: { model: 'not-a-model' },
    };
    const exceptionMesage = `Starship ${JSON.stringify(args.where)} does not exist`;

    await expect(starshipsResolver.starship(args)).rejects.toThrow(
      new NotFoundException(exceptionMesage),
    );
  });

  it('should query starship by model and cargo capacity', async () => {
    await createManyTestStarships();

    const starship = await starshipsResolver.starship({
      where: { model: 'model-1', AND: [{ cargoCapacity: { gt: 0 } }] },
    });

    expect(starship).toBeDefined();
    expect(starship.name).toBe('test-starship-1');
    expect(starship.model).toBe('model-1');
  });

  it('should query starship by name and length', async () => {
    await createManyTestStarships();

    const starship = await starshipsResolver.starship({
      where: { name: 'test-starship-1', length: { gt: 0 } },
    });

    expect(starship).toBeDefined();
    expect(starship.name).toBe('test-starship-1');
    expect(starship.model).toBe('model-1');
  });

  it('should query all starships', async () => {
    await createManyTestStarships();

    const starships = await starshipsResolver.allStarships();

    expect(starships?.length).toBe(5);
    expect(starships?.at(0)?.name).toBe('test-starship-0');
  });

  it('should return no starships', async () => {
    const starships = await starshipsResolver.allStarships();

    expect(starships?.length).toBe(0);
  });

  it('should query many starships', async () => {
    const seededStarships = await createManyTestStarships();
    const starshipsQuery = seededStarships!.map((starship) => {
      return { name: { equals: starship.name } };
    });

    const starships = await starshipsResolver.starships({
      where: {
        OR: starshipsQuery,
      },
    });

    expect(starships).toBeDefined();
    expect(starships.length).toBe(5);
    expect(starships.at(0)?.name).toBe('test-starship-0');
  });

  it('should throw exception when starships not found', async () => {
    await createManyTestStarships();

    const args = {
      where: {
        OR: [
          { name: { equals: 'not-a-starship-0' } },
          { name: { equals: 'not-a-starship-1' } },
          { name: { equals: 'not-a-starship-2' } },
        ],
      },
    };
    const exceptionMessage = `Starships ${JSON.stringify(args.where)} do not exist`;

    await expect(starshipsResolver.starships(args)).rejects.toThrow(
      new NotFoundException(exceptionMessage),
    );
  });

  it('should create a new starship', async () => {
    const starship = await starshipsResolver.createStarship({
      data: testStarShip,
    });

    expect(starship).toBeDefined();
    expect(starship?.name).toBe('test-starship');
    expect(starship?.model).toBe('model-0');
  });

  it('should fail to create a starship with not unique name', async () => {
    await starshipsResolver.createStarship({ data: testStarShip });

    await expect(
      starshipsResolver.createStarship({
        data: { ...testStarShip, model: 'not-the-same' },
      }),
    ).rejects.toThrow(new BadRequestException('Name must be unique'));
  });

  it('should fail to create a starship with not unique model', async () => {
    await starshipsResolver.createStarship({ data: testStarShip });

    await expect(
      starshipsResolver.createStarship({
        data: { ...testStarShip, name: 'not-the-same' },
      }),
    ).rejects.toThrow(new BadRequestException('Model must be unique'));
  });

  it('should create many starships', async () => {
    const args: CreateManyStarshipArgs = prepareManyStarshipsArgs();

    const starships = await starshipsResolver.createStarships(args);

    expect(starships).toBeDefined();
    expect(starships!.length).toBe(5);
    expect(starships!.at(0)!.name).toBe('test-starship-0');
  });

  it('should fail to create many starships with not unique names', async () => {
    const args: CreateManyStarshipArgs = prepareManyStarshipsArgs();

    await starshipsResolver.createStarships(args);

    await expect(starshipsResolver.createStarships(args)).rejects.toThrow(
      new BadRequestException('Names must be unique'),
    );
  });

  it('should fail to create many starships with not unique models', async () => {
    const args: CreateManyStarshipArgs = prepareManyStarshipsArgs();

    const starships = await starshipsResolver.createStarships(args);

    const uniqueNames = starships!.map((starship) => {
      return {
        ...starship,
        id: undefined,
        name: `${starship.name}-${starship.id}`,
      };
    });

    await expect(
      starshipsResolver.createStarships({ data: uniqueNames }),
    ).rejects.toThrow(new BadRequestException('Models must be unique'));
  });

  it('should update starship', async () => {
    const starship = await starshipsResolver.createStarship({
      data: testStarShip,
    });

    const updatedStarship = await starshipsResolver.updateStarship({
      where: { id: starship!.id },
      data: {
        name: { set: 'updated-starship' },
        cargoCapacity: { set: 4200 },
        crewMembers: { set: 20 },
        starshipClass: { set: StarshipClass.SPEEDER },
      },
    });

    expect(updatedStarship).toBeDefined();
    expect(updatedStarship!.updatedAt).not.toBe(updatedStarship!.createdAt);
    expect(updatedStarship!.cargoCapacity).toBe(4200);
    expect(updatedStarship!.crewMembers).toBe(20);
    expect(updatedStarship!.starshipClass).toBe(StarshipClass.SPEEDER);
  });

  it('should throw exception when starship was not found for update', async () => {
    const starship = await starshipsResolver.createStarship({
      data: testStarShip,
    });

    const args = {
      where: { id: `${starship?.id}X` },
      data: { name: { set: 'not-updated' } },
    };

    await expect(starshipsResolver.updateStarship(args)).rejects.toThrow(
      new BadRequestException('No record was found for an update.'),
    );
  });

  it('should update starships', async () => {
    const starships = await createManyTestStarships();
    const starshipsQuery = starships!.map((starship) => {
      return { id: { equals: starship.id } };
    });

    const updatedStarships = await starshipsResolver.updateStarships({
      where: {
        OR: starshipsQuery,
      },
      data: {
        cargoCapacity: { set: 420 },
      },
    });

    expect(updatedStarships).toBeDefined();
    expect(updatedStarships.length).toBe(5);

    updatedStarships.forEach((starship) => {
      expect(starship.cargoCapacity).toBe(420);
    });
  });

  it('should throw exception when starships were not found for update', async () => {
    const starships = await createManyTestStarships();
    const starshipsQuery = starships!.map((starship) => {
      return { id: { equals: `${starship.id}X` } };
    });

    await expect(
      starshipsResolver.updateStarships({
        where: { OR: starshipsQuery },
        data: { cargoCapacity: { set: 420 } },
      }),
    ).rejects.toThrow(
      new NotFoundException('No records were found for an update.'),
    );
  });

  it('should delete a starship', async () => {
    const toDelete = await starshipsResolver.createStarship({
      data: testStarShip,
    });

    const args = { where: { id: toDelete!.id } };
    const exceptionMessage = `Starship ${JSON.stringify(args.where)} does not exist`;

    await starshipsResolver.deleteStarship(args);

    await expect(starshipsResolver.starship(args)).rejects.toThrow(
      new NotFoundException(exceptionMessage),
    );
  });

  it('should throw an exception when starship not found during delete', async () => {
    const args = { where: { id: 'uuid' } };
    const exceptionMessage = `Starship ${JSON.stringify(args.where)} does not exist`;

    await expect(starshipsResolver.deleteStarship(args)).rejects.toThrow(
      new NotFoundException(exceptionMessage),
    );
  });

  it('should delete many starships', async () => {
    const starships = await createManyTestStarships();
    const starshipsQuery = starships!.map((starship) => {
      return {
        id: { equals: starship.id },
      };
    });

    const args = { where: { OR: starshipsQuery } };

    await starshipsResolver.deleteStarships(args);

    await expect(starshipsResolver.starships(args)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should fail to delete many starships', async () => {
    const starships = await createManyTestStarships();
    const starshipsQuery = starships!.map((starship) => {
      return {
        id: { equals: `${starship.id}X` },
      };
    });

    await expect(
      starshipsResolver.deleteStarships({ where: { OR: starshipsQuery } }),
    ).rejects.toThrow(NotFoundException);
  });
});
