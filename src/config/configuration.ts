import { configDb } from './database';
import { configNodeMailer } from './nodemailer';

export default () => ({
  port: parseInt(process.env.PORT),
  database: configDb(),
  nodemailer: configNodeMailer(),
});
