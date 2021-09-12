require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/songs');
const SongsValidator = require('./validator/songs');
const SongsService = require('./services/postgres/SongsService');

const errors = require('./api/errors');

const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {
    const server = Hapi.server({
        port: process.env.port,
        host: process.env.host,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register([
        {
            plugin: songs,
            options: {
                service: new SongsService(),
                validator: SongsValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: new UsersService(),
                validator: UsersValidator,
            },
        },
        {
            plugin: errors,
        }
    ]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();
