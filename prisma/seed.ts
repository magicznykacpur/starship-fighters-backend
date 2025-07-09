import { PrismaClient } from '@prisma/client';
import { Person, Starship } from '@prisma/client';

const people: Omit<Person, 'id'>[] = [
  {
    name: 'Jolie',
    mass: 718,
  },
  {
    name: 'McKenzie',
    mass: 802,
  },
  {
    name: 'Tanek',
    mass: 817,
  },
  {
    name: 'Amelia',
    mass: 495,
  },
  {
    name: 'Tanner',
    mass: 393,
  },
  {
    name: 'Kathleen',
    mass: 944,
  },
  {
    name: 'Macon',
    mass: 205,
  },
  {
    name: 'Knox',
    mass: 126,
  },
  {
    name: 'Zenia',
    mass: 501,
  },
  {
    name: 'Madaline',
    mass: 260,
  },
  {
    name: 'Hamish',
    mass: 40,
  },
  {
    name: 'Justina',
    mass: 508,
  },
  {
    name: 'Justin',
    mass: 941,
  },
  {
    name: 'Abraham',
    mass: 907,
  },
  {
    name: 'Darius',
    mass: 858,
  },
];

const starships: Omit<Starship, 'id'>[] = [
  {
    name: 'LGC90QBJ0OJ',
    crewMembers: 56,
  },
  {
    name: 'SJM43EBF5VN',
    crewMembers: 50,
  },
  {
    name: 'DTY28DRL6PX',
    crewMembers: 77,
  },
  {
    name: 'DPD79CQT3PL',
    crewMembers: 10,
  },
  {
    name: 'LJT77EKL4TM',
    crewMembers: 93,
  },
  {
    name: 'EDQ81IHR8UG',
    crewMembers: 91,
  },
  {
    name: 'PTE86GKC3ZD',
    crewMembers: 38,
  },
  {
    name: 'ZKF89JOG7TS',
    crewMembers: 19,
  },
  {
    name: 'LDK55TUO6NJ',
    crewMembers: 65,
  },
  {
    name: 'USG46DBX8BQ',
    crewMembers: 96,
  },
  {
    name: 'ONW57DTG7OV',
    crewMembers: 10,
  },
  {
    name: 'YUB67MFI1ZT',
    crewMembers: 24,
  },
  {
    name: 'RGY74SPE3BC',
    crewMembers: 7,
  },
  {
    name: 'MZK00BCS4ST',
    crewMembers: 83,
  },
  {
    name: 'OHV92FCW5PJ',
    crewMembers: 25,
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
