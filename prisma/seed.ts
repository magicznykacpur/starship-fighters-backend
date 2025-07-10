import { PrismaClient, StarshipClass } from '@prisma/client';
import { Person, Starship } from '@prisma/client';

const people: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Jolie',
    mass: 82,
    birthYear: 1994,
    eyeColor: 'blue',
    hairColor: 'black',
    height: 188,
    homeworld: 'venus',
    skinColor: 'black',
  },
  {
    name: 'McKenzie',
    mass: 77,
    birthYear: 1995,
    eyeColor: 'red',
    hairColor: 'blue',
    height: 192,
    homeworld: 'venus',
    skinColor: 'white',
  },
  {
    name: 'Tanek',
    mass: 102,
    birthYear: 1865,
    eyeColor: 'gray',
    hairColor: 'red',
    height: 202,
    homeworld: 'mars',
    skinColor: 'gray',
  },
  {
    name: 'Amelia',
    mass: 65,
    birthYear: 1998,
    eyeColor: 'green',
    hairColor: 'green',
    height: 176,
    homeworld: 'jupiter',
    skinColor: 'red',
  },
  {
    name: 'Tanner',
    mass: 94,
    birthYear: 2012,
    eyeColor: 'teal',
    hairColor: 'brown',
    height: 199,
    homeworld: 'mercury',
    skinColor: 'white',
  },
  {
    name: 'Kathleen',
    mass: 88,
    birthYear: 2000,
    eyeColor: 'blue',
    hairColor: 'blonde',
    height: 180,
    homeworld: 'earth',
    skinColor: 'brown',
  },
  {
    name: 'Macon',
    mass: 115,
    birthYear: 1995,
    eyeColor: 'brown',
    hairColor: 'blonde',
    height: 210,
    homeworld: 'earth',
    skinColor: 'brown',
  },
];

const starships: Omit<Starship, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'LGC90QBJ0OJ',
    model: 'LGC90QBJ0OJ-1',
    length: 2500,
    cargoCapacity: 20000,
    maxSpeed: 30000,
    hyperdriveRating: 2.5,
    starshipClass: StarshipClass.FIGHTER,
    crewMembers: 56,
  },
  {
    name: 'SJM43EBF5VN',
    model: 'SJM43EBF5VN-1',
    length: 3500,
    cargoCapacity: 30000,
    maxSpeed: 40000,
    hyperdriveRating: 2.0,
    starshipClass: StarshipClass.TRANSPORTER,
    crewMembers: 200,
  },
  {
    name: 'DTY28DRL6PX',
    model: 'DTY28DRL6PX-1',
    length: 1500,
    cargoCapacity: 2700,
    maxSpeed: 45000,
    hyperdriveRating: 3.0,
    starshipClass: StarshipClass.SPEEDER,
    crewMembers: 5,
  },
  {
    name: 'DPD79CQT3PL',
    model: 'DPD79CQT3PL-2',
    length: 2600,
    cargoCapacity: 18000,
    maxSpeed: 2800,
    hyperdriveRating: 2.6,
    starshipClass: StarshipClass.FIGHTER,
    crewMembers: 75,
  },
  {
    name: 'LJT77EKL4TM',
    model: 'LJT77EKL4TM-2',
    length: 7200,
    cargoCapacity: 22000,
    maxSpeed: 450,
    hyperdriveRating: 0.5,
    starshipClass: StarshipClass.TRANSPORTER,
    crewMembers: 250,
  },
  {
    name: 'EDQ81IHR8UG',
    model: 'EDQ81IHR8UG-2',
    length: 1050,
    cargoCapacity: 500,
    maxSpeed: 6500,
    hyperdriveRating: 4.5,
    starshipClass: StarshipClass.SPEEDER,
    crewMembers: 7,
  },
  {
    name: 'PTE86GKC3ZD',
    model: 'PTE86GKC3ZD-3',
    length: 1650,
    cargoCapacity: 2600,
    maxSpeed: 2650,
    hyperdriveRating: 1.8,
    starshipClass: StarshipClass.FIGHTER,
    crewMembers: 42,
  },
  {
    name: 'ZKF89JOG7TS',
    model: 'ZKF89JOG7TS-3',
    length: 5000,
    cargoCapacity: 7000,
    maxSpeed: 1250,
    hyperdriveRating: 1.3,
    starshipClass: StarshipClass.TRANSPORTER,
    crewMembers: 120,
  },
  {
    name: 'LDK55TUO6NJ',
    model: 'LDK55TUO6NJ-3',
    length: 495,
    cargoCapacity: 1000,
    maxSpeed: 5500,
    hyperdriveRating: 5.7,
    starshipClass: StarshipClass.SPEEDER,
    crewMembers: 12,
  },
];

const prisma = new PrismaClient();

const seed = async () => {
  await prisma.person.createMany({ data: people });
  await prisma.starship.createMany({ data: starships });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
