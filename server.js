const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT REJECTION!๐ฎ Shutting down....');
  console.log(err.name, err.message);

  // server.close(() => {
  process.exit(1);
  // });
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB is connected');
  });
// .catch((err) => console.log('ERROR ๐งถ'));

//.4,start server
const port = process.env.PORT || 3003;
const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('HANDLE REJECTION!๐ฎ Shutting down....');
  server.close(() => {
    process.exit(1);
  });
});
