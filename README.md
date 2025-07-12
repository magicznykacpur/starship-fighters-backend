# Starship fighters

This is a NestJS application written using typescript with Postgres as a DB and
Prisma as an ORM. It exposes a graphql api with CRUD operations and pagination.

Since this is a demo only, I've added .env files to the repo for simplicity.

## How to run

### First time

Project was developed using `node v24.0.0` so please use this version or above
when installing dependencies and running tests.


- run `npm install` to install all the required packages
- run `docker compose up -d` to start the postgres database
- run `npx prisma migrate reset -f` to run migrations, seed the database and to generate the necessary ORM types and classes
- run `npm run start:dev`, after this you can visit `localhost:3000/api` to mess
  around with the api using an web based IDE

### Every time after that

- run `docker compose up -d` to start the postgres database
- run `npm run start:dev`

## Testing

Please read below to make sure test can be ran with one command `npm run test`

I chose Prisma as an ORM for this project. Prisma doesn't support running migrations
programatically, and I wanted to test the services and resolvers on an actual running
database.

Because of that I couldn't use `testcontainers` to spin up a DB in my Jest 
tests.

At this point I didnt want to migrate to another ORM, because where's the fun in that.
Another option would be to spawn a `child process` but that seemed to hacky to do in a test.

So I came up with in my opinion the simplest solution to the problem: spin up a separate
docker image everytime the tests are run, and then shut it down after.

The `npm run test` command does everything for you already, there's only one thing that
you need to make sure you've done before it runs correctly:

Make sure your user has root access to run `docker` commands, you can do that by simply
adding your user.

To do this you can simply:

- create a docker group (you probably already have one) `sudo groupadd docker`
- add your user to the docker group `sudo usermod -aG docker $USER` where `$USER` is your username
- restart your terminal session

After this you can run `docker` commands without having to enter your password every time,
seems like a win-win situation to me

So let's consider the pros and cons of this:

pros:

- fresh test db everytime you run your tests, just run the command and forget about it
- repeatable tests cases - since the DB is reset with `npx prisma reset -f --skip-seed` everytime
we don't need to worry about leftovers from previous runs
- it's fun to sometimes orchestrate things on your own, need to switch image? no problem,
need to set some env variables? tell me less

cons:

- the manual setup didnt take 5 minutes as it would with `testcontainers` but fun was had
- need to have root access/be added to docker group in order to use the orchestration script
- when running the test first time the image needs to be downloaded, but after that it's smooth sailing
- tests might take a second longer since we need to spin up the image

Of course the test can still be ran even without adding your user to the docker group.
You can spin up the container, run migrations, run tests and shutdown the container.