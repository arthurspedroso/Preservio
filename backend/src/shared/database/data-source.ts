import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { typeOrmOptions } from './typeorm.config';

dotenv.config();

export default new DataSource(typeOrmOptions());
