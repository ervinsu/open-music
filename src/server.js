require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/songs');
const errors = require('./api/errors');
const SongsValidator = require('./validator/songs');
const SongsService = require('./services/postgres/SongsService');

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

    await server.register({
        plugin: songs,
        options: {
            service: new SongsService(),
            validator: SongsValidator,
        },
    });

    await server.register({
        plugin: errors,
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();
