exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('playlists', {
        id: {
            type: 'VARCHAR(19)',
            notNull: true,
            primaryKey: true,
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(15)',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('playlists');
};

