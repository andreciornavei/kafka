import { Connection } from "mysql2/promise"; // Import PoolConnection type from mysql2
import { Client } from "@elastic/elasticsearch";

export {};
declare global {
  namespace Express {
    export interface Request {
      db?: Promise<Connection>;
      es?: Client;
    }
  }
}
