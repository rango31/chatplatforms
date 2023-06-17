# chatplatforms
chat platforms interfaces

## Installation and run

    To deploy and install dependencies to this project run

  npm install --save

     to setup db (Important this will create  the database and add the default user)

  knex migrate:latest --env production  && knex seed:run --env production

    To run it, 

  npm start
   -- this will start the server

