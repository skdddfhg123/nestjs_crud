import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'dongmlee',
    password: process.env.DB_PASSWORD || '1q2w3e4r',
    database: process.env.DB_DATABASE || 'nest_crud',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: false,
    migrations: ["dist/db/migrations/*.js"],
}
