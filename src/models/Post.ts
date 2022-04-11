import client  from "../database";
import { postCreate } from "../DTO/postCreate.dto";

export type Post = {
    id: number,
    title: string,
    content: string,
    user_id: number
};

export class postStore{
    async index() : Promise<Post[] | null> 
    {
        try{
        const conn = await client.connect();
        const sql = `select * from "Post"`;
        const result = await conn.query(sql);
        conn.release();
        return result.rows ;
    } catch (err) {
      throw new Error(`Could not get Posts. Error: ${err}`);
    }
  }

  async show( id: number): Promise<Post> {
    try {
    const sql = `SELECT * FROM "Post" WHERE id=($1) `;
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    const Post = result.rows[0];
    conn.release();
    return Post;
    } catch (err) {
        throw new Error(`Could not find Post ${id}. Error: ${err}`);
    }
  }

  async create(p: postCreate): Promise<Post> {
      try {
    const sql = `INSERT INTO "Post" (title,content,user_id) VALUES ($1, $2, $3) RETURNING *`;
   
    const conn = await client.connect();
    const result = await conn.query(sql, [p.title,p.content,p.user_id]);
    const post = result.rows[0];
    conn.release();
    return post;
      } catch (err) {
          throw new Error(`Could not add new Post. Error: ${err}`);
      }
  }

  async edit(p: Post): Promise<Post> {
    try {
      const sql = `UPDATE "Post" SET title=$1 , content=$2, user_id=$3 WHERE id=$4 RETURNING *`;
      const conn = await client.connect();
      const result = await conn.query(sql, [p.title,p.content,p.user_id,p.id]);
      const post = result.rows[0];
      conn.release();
      return post;
    } catch (err) {
      throw new Error(`Could not update the Post. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<Post> {
      try {
    const sql = `DELETE FROM "Post" WHERE id=($1)`;
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    const post = result.rows[0];
    conn.release();
    return post;
      } catch (err) {
          throw new Error(`Could not delete Post ${id}. Error: ${err}`)
      }
  }

  
}

