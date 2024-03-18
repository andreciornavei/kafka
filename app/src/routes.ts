import mysql from "mysql2/promise";
import { Client } from "@elastic/elasticsearch";
import { Router, Request, Response } from "express";

const router = Router();

router.post("/message", async (req: Request, res: Response) => {
  const { message } = req.body;
  const conn = await (req.db as unknown as Promise<mysql.Connection>);
  const [result] = await conn.query(
    "INSERT INTO messages (message) VALUES (?)",
    [message]
  );
  return res
    .status(201)
    .json({ message: `message inserted with id #${result.insertId}` });
});

router.get("/messages", async (req: Request, res: Response) => {
  const es = req.es as Client;
  const index = "mysql-server.kafka_db_example.messages";
  const { q } = req.query;

  const {
    hits: { hits },
  } = await es.search({
    index: index,
    body: {
      query: {
        wildcard: {
          "after.message.keyword": {
            value: `*${q}*`,
          },
        },
      },
      _source: ["after"],
    },
  });
  return res
    .status(200)
    .json(hits.map((i) => i?._source?.after || undefined).filter((i) => !!i));
});

export default router;
