import express, { NextFunction } from "express";
import routes from "./routes";
import { json } from "body-parser";
import mysql from "mysql2/promise";
import { Client } from "@elastic/elasticsearch";
const elasticsearch = new Client({ node: "http://localhost:9200" });

const connection = mysql.createConnection({
  host: "localhost",
  port: 33060,
  user: "root",
  password: "root",
  database: "kafka_db_example",
});

const app = express();
app.use(json());
app.use((req: Request, _res: Response, next: NextFunction) => [
  (req.db = connection),
  (req.es = elasticsearch),
  next(),
]);
app.use(routes);

app.listen(1337, () => {
  console.log("express listen on port 1337");
});
