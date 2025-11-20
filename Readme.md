hola pedaso de cholos boludos 

lista de pasos antes de ejecutar el proyecto 
paso 1
entrar a sql workbench crea un base de datos (Create Database instituto) <-comando 

paso 2
ir al .env del backend y cambiar tu s datos del sql workbench
si no tienes un .env crealo en la raiz del backend
y pon lo siguiente y borra el # y ya 

#PORT=3001
#DB_HOST=localhost
#DB_USER=root
#DB_PASSWORD=root
#DB_NAME=instituto
#JWT_SECRET=instituto_jwt_secret_key_2024_secure

paso 3
abrir una terminal para el backend y hacer un npm i 
abrir otra terminal para el frontend y hacer un npm i

paso 4 
hacer en esas mismas terminales hacer backend npm start
frontend npm run dev 

paso 5 
ir a localhost:3000
y jugar con el proyecto 

paso 6 
el initializer te migra las tablas y te hacer un inser admin
superadmin :

admin@admin.com ---- correo
Admin123! ---------- contracena 

para hacer login 

Ahora q hace :
admin puede crear usuarios tipo studen y docente y puede ver las materias y puede pagar y ver la parte contable 

docente puede crear materias y ver la gente q pago por esas materias 

usuario puede matricularce a materias y puede pagarlas al 100 o 50 %

que no hacer :
no tocar el backend si no le entienden a initializer y a migrations arquitectura exagonal 

tambien 
no tocar en el front / service
ni context en el auth 

luego el front haganlo ustedes no sean flojos putas 


