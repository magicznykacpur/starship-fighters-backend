import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StarshipsService } from './starships.service';
import { Starship } from 'src/generated/models/starship/starship.model';
import { FindUniqueStarshipArgs } from 'src/generated/models/starship/find-unique-starship.args';
import { CreateOneStarshipArgs } from 'src/generated/models/starship/create-one-starship.args';
import { UpdateOneStarshipArgs } from 'src/generated/models/starship/update-one-starship.args';
import { DeleteOneStarshipArgs } from 'src/generated/models/starship/delete-one-starship.args';
import { CreateManyStarshipArgs } from 'src/generated/models/starship/create-many-starship.args';
import { UpdateManyStarshipArgs } from 'src/generated/models/starship/update-many-starship.args';
import { DeleteManyStarshipArgs } from 'src/generated/models/starship/delete-many-starship.args';

@Resolver('starships')
export class StarshipsResolver {
  constructor(private readonly starshipService: StarshipsService) {}

  @Query(() => [Starship])
  async findStarships(): Promise<Starship[] | null> {
    return this.starshipService.findAll();
  }

  @Query(() => Starship)
  async findStarship(@Args() args: FindUniqueStarshipArgs) {
    const starship = await this.starshipService.find(args);

    if (!starship) {
      throw new NotFoundException(
        `Starship ${JSON.stringify(args.where)} does not exist`,
      );
    }

    return starship;
  }

  @Mutation(() => Starship)
  async createStarship(@Args() args: CreateOneStarshipArgs): Promise<Starship> {
    const starship = await this.starshipService.create(args);

    return starship;
  }

  @Mutation(() => [Starship])
  async createStarships(
    @Args() args: CreateManyStarshipArgs,
  ): Promise<Starship[]> {
    const starships = await this.starshipService.createMany(args);

    if (starships.length === 0) {
      throw new NotFoundException(
        `Couldnt create starships ${JSON.stringify(args.data)}`,
      );
    }

    return starships;
  }

  @Mutation(() => Starship)
  async updateStarship(@Args() args: UpdateOneStarshipArgs): Promise<Starship> {
    const starship = await this.starshipService.find(args);

    if (!starship) {
      throw new NotFoundException(
        `Starship ${JSON.stringify(args.where)} does not exist`,
      );
    }

    const updatedStarship = await this.starshipService.update(args);

    return updatedStarship;
  }

  @Mutation(() => Starship)
  async updateStarships(
    @Args() args: UpdateManyStarshipArgs,
  ): Promise<Starship[]> {
    const starships = await this.starshipService.findMany(args);

    if (!starships) {
      throw new NotFoundException(
        `Starships ${JSON.stringify(args.where)} do not exist`,
      );
    }

    const updatedStarships = await this.starshipService.updateMany(args);

    return updatedStarships;
  }

  @Mutation(() => Starship)
  async deleteStarship(@Args() args: DeleteOneStarshipArgs): Promise<void> {
    const starship = await this.starshipService.find(args);

    if (!starship) {
      throw new NotFoundException(
        `Starship ${JSON.stringify(args.where)} does not exist`,
      );
    }

    await this.starshipService.delete(args);
  }

  @Mutation(() => Starship)
  async deleteStarships(@Args() args: DeleteManyStarshipArgs): Promise<void> {
    const starships = await this.starshipService.findMany(args);

    if (!starships) {
      throw new NotFoundException(
        `Starships ${JSON.stringify(args.where)} do not exist`,
      );
    }

    await this.starshipService.deleteMany(args);
  }
}
