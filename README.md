# Tågmästarna
----------------------------------------------------
## Steps to run the project:
+ Clone the repo. 
+ Add database configuration (username, password) in the file `src/lib/config/database.json`
+ Create database called "Tagmastarna".
  + Run the following SQL query to create the database: 
    + ` create database Tagmastarna;`
+ Open terminal and run the following commands:
    + `npm install`
    + `npx sequelize-cli db:migrate`
    + `npx sequelize-cli db:seed:all`
    + `npm run dev`
### MySQL terminal:

+ drop database Tagmastarna; # delete Old database and all its table  
+ create database Tagmastarna; # create new database called Tagmastarna
+ select * from Users; # select all user from selected database 
+ show databases; # show all database ;
+ use  Tagmastarna ; # select database  to run queries throw it
----------------------------------------------------
 
## By Hisham Ali 