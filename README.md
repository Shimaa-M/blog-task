# BLOG-API

### General info
Simple blog for authenticated users to create post then edit or delete it

### Technologies
typescript/ nodejs/ postgres/ swagger/ deplou to heroku/ migration/ docker

### Setup
download the folder to your local machine
```
git clone https://github.com/Shimoo123/blog-task.git
npm install
npm run start:dev
```
### Hosted on HEROKU
https://hidden-garden-48948.herokuapp.com

### Endpoint to use
#### you can use all routes of API using Swagger doc
##### for local use
http://localhost:3000/swagger

##### for production use
https://hidden-garden-48948.herokuapp.com/swaggger

##### To run DOCKER image
docker-compose up

##### Environment Variables
```
PORT=3000
NODE_ENV=dev
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_DB=blog_db
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432
DATABASE_URL=
postgres://rnztjadbzkcmtq:46286d0843ac107b17df58eddcebbb1524e9aafa46bf956680720429c6780769@ec2-52-21-136-176.compute-1.amazonaws.com:5432/defs034h76as4p
BCRYPT_PASSWORD=i-love-my-children
SALT_ROUNDS=10
JWT_TOKEN=i-love-programming
JWT_COOKIE_EXPIRES_IN=90
```

