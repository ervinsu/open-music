require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const path = require('path');
const Inert = require('@hapi/inert');

const songs = require('./api/songs');
const SongsValidator = require('./validator/songs');
const SongsService = require('./services/postgres/SongsService');

const errors = require('./api/errors');

const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistsValidator = require('./validator/playlists');

const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const _exports = require('./api/exports');
const producerService = require('./services/broker/ProducerService');
const ExportsValidator = require('./validator/exports');

const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

const CacheService = require('./services/cache/CacheService');

const init = async () => {
    const cacheService = new CacheService();
    const songsService = new SongsService(cacheService);
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const playlistsService = new PlaylistsService(cacheService);
    const playlistSongsService = new PlaylistSongsService(playlistsService, cacheService);
    const collaborationsService = new CollaborationsService(cacheService);
    const storageService = new StorageService(path.resolve(__dirname, 'uploads/file/pictures'));

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
            plugin: Jwt,
        },
        {
            plugin: Inert,
        }
    ]);


    server.auth.strategy('musicsapp_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });

    await server.register([
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            },
        },
        {
            plugin: errors,
        },
        {
            plugin: authentications,
            options: {
                authenticationsService: authenticationsService,
                usersService: usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },
        {
            plugin: playlists,
            options: {
                playlistsService: playlistsService,
                playlistSongsService: playlistSongsService,
                songsService: songsService,
                validator: PlaylistsValidator,
            },
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService: collaborationsService,
                playlistsService: playlistsService,
                validator: CollaborationsValidator,
            },
        },
        {
            plugin: _exports,
            options: {
                producerService,
                playlistsService,
                validator: ExportsValidator,
            },
        },
        {
            plugin: uploads,
            options: {
                storageService: storageService,
                validator: UploadsValidator,
            },
        }
    ]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();
