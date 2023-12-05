import mongoose from 'mongoose';
import 'dotenv/config';

export function dbConnect() {
  const user = process.env.USER_BD;
  const password = process.env.PASSWORD_DB;
  const cluster = ' cluster0.a4xpomk.mongodb.net';
  const dataBase = 'Final-Proyect';
  const uri = `mongodb+srv://${user}:${password}@${cluster}/${dataBase}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
}
