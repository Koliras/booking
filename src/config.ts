import { Car } from "./cars/models/car.model";
import { Order } from "./orders/models/order.model";

export const config = () => ({
  port: Number(process.env.PORT),
  database: {
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    models: [Car, Order],
  }
})