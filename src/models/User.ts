import { client } from "../database";
import { userCreate } from "../DTO/userCreate.dto";
import bcrypt from 'bcrypt';
import { Post } from "./Post";

const saltRounds =parseInt( process.env.SALT_ROUNDS as string);
const pepper = process.env.BCRYPT_PASSWORD

export type User = {
    id: number,
    name: string,
    email: string,
    password: string
};

export class userStore{
 
    async index() : Promise<User[] | null> 
    {
        try{
        const conn = await client.connect();
        const sql = `select * from "User" `;
        const result = await conn.query(sql);
        conn.release();
        return result.rows ;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show( id: number): Promise<User> {
    try { 
    const sql = `SELECT * FROM "User" WHERE id=($1)`;
    const conn = await client.connect();
    const result = await conn.query(sql, [id]);
    const user = result.rows[0];
      conn.release();
    return user;
    } catch (err) {
        throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async showPostsRelatedUser(id:number): Promise<Post[]> {
    try {
      
      const sql = `SELECT "Post".id as post_id,"User".name,"Post".title,"Post".content 
                   FROM "User" 
                  Inner JOIN "Post" 
                  ON "User".id = "Post".user_id
                  WHERE "User".id=($1)`; 
    const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      const posts = result.rows;
    conn.release();
    return posts;
    } catch (err) {
        throw new Error(`Could not find posts rellated to user ${id}. Error: ${err}`);
    }
  }

  async showOnePostRelatedUser(user_id:number,post_id:number): Promise<Post> {
    try {
      
      const sql = `SELECT "Post".id as post_id,"User".name,"Post".title,"Post".content 
                   FROM "User" 
                  Inner JOIN "Post" 
                  ON "User".id = "Post".user_id
                  WHERE "User".id=($1) AND "Post".id=($2)`; 
    const conn = await client.connect();
      const result = await conn.query(sql, [user_id,post_id]);
      const post = result.rows[0];
    conn.release();
    return post;
    } catch (err) {
        throw new Error(`Could not find post with this id ${post_id}. Error: ${err}`);
    }
  }

  async create(u: userCreate): Promise<User> {
      try {
    const sql = `INSERT INTO "User" (name,email,password) VALUES ($1, $2, $3) RETURNING *`;
    const hash = bcrypt.hashSync(u.password + pepper,saltRounds);
    const conn = await client.connect();
    const result = await conn.query(sql, [u.name,u.email,hash]);
    const user = result.rows[0];
    conn.release();
    return user;
      } catch (err) {
          throw new Error(`Could not add new user. Error: ${err}`);
      }
  }


  async deletePost(user_id: number,post_id:number): Promise<Post> {
      try {
    const sql = `DELETE FROM "Post" P Using "User" as U WHERE U.id=($1) AND P.id=($2);`;
    const conn = await client.connect();
    const result = await conn.query(sql, [user_id,post_id]);
    const post = result.rows[0];
    conn.release();
    return post;
      } catch (err) {
          throw new Error(`Could not delete post ${post_id}. Error: ${err}`)
      }
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    try{
    const conn = await client.connect();
    const sql = `SELECT * FROM "User" WHERE email=($1)`;
    const result = await conn.query(sql, [email]);
    if(result.rowCount == 1) {
      const user = result.rows[0];
        if ( bcrypt.compareSync(password+pepper, user.password)) {
        return user;
      }
    }
    return null;
  }catch (err){
    throw new Error(`Could not authenticate user . Error: ${err}`)
  }
}
}

