# chatplatforms
chat platforms interfaces

## Installation and run

    To deploy and install dependencies to this project run

  npm install --save

     to setup db (Important this will create  the database and add the default user)

  knex migrate:latest --env production  && knex seed:run --env pnroduction

    To run it, 

  npm start
   -- this will start the server
   -- visit localhost:3000
   
   default credentials(But i advise on registering a new account)
   email: superuser@chatp.com - password : password321

