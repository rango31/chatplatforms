# chatplatforms
chat platforms interfaces

## Installation and run

    To deploy and install dependencies to this project run

  npm install --save

     to setup db (Important this will automatically create the required database tables)
     - create a mysql database with name  :'chatplatforms'
     - edit the knexfile.js with your local mysql server credentials
     - Best practice is to put the development creds in the dev category, and production creds in the production category.
     - The sstem is currently running in development mode.

  knex migrate:latest --env development  && knex seed:run --env development
     Not necessary as the system will run migrations automatically


    To run it, 

  npm start
   -- this will start the server
   -- visit localhost:3000/documentation/ to view documentation of API endpoints


   //todo
   - implement cron job to delete uncompleted authentications.
   - implement check to see if client is ready before interacting with it.
   

