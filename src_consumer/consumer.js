require('dotenv').config();
const amqp = require('amqplib');

const PlaylistService = require('./services/postgres/PlaylistService');
const PlaylistSongService = require('./services/postgres/PlaylistSongService');
const MailSender = require('./services/mail/MailSender');
const Listener = require('./services/listener/Listener');
const CacheService = require('../src/services/cache/CacheService');

const init = async () => {
  const cacheService = new CacheService();
  const playlistsService = new PlaylistService(cacheService);
  const playlistSongsService = new PlaylistSongService(cacheService);
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, playlistSongsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue(process.env.PLAYLIST_CHANNEL_NAME, {
    durable: true,
  });

  channel.consume(process.env.PLAYLIST_CHANNEL_NAME,
    listener.listen, { noAck: true });

  console.log(`Consumer berjalan pada ${process.env.RABBITMQ_SERVER}`);
};

init();
