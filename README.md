# Tågmästarna
----------------------------------------------------
## Steps to run the project:
+ Clone the repo 
+ Add database configuration (username, password)
+ Create database called "Tagmastarna"
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
### VSCode terminal:
+  npm i
+  npx sequelize-cli db:migrate # to migrate up models 
+  npx sequelize-cli db:seed:all # to seed fake data in database 
+  npm run dev  
+  npm run build # to build application
----------------------------------------------------

## By Hisham Ali 