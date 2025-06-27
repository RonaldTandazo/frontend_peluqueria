# frontend_peluqueria

Una vez clonado el proyecto desde GitHub, debe seguir los siguientes pasos:

1. Ejecutar el comando: npm i, esto instalará las dependencias necesarias para el correcto funcionamiento del proyecto

2. Debe crear un archivo llamdo .env.development.local tomando como ejemplo el archivo: .example.env Deben incluirse las siguientes variables: 
    - VUE_APP_URL: corresponde a la url y puerto donde se encuentra levantado el proyecto del backend, debe agregarse: /api despues del puerto ya que el backend espera ese sufijo en las rutas existentes
    - VUE_APP_PORT: corresponde al puerto donde será levantado el proyecto del frontend

    Notas: 
    - Pueden tomarse los valores indicados en el archivo .example.env

3. Una vez realizados todos los pasos anteriores debe ejecutar el siguiente comando en la terminal: npm run serve, esto levantará el proyecto en su ip local utilizando el puerto indicado en la variable PORT del archivo .env

Nota:
Debe asegurarse que no haya otro proyecto levantado en el puerto indicado en la variable VUE_APP_PORT del archivo .env.development.local, caso contrario el proyecto será levantado en un puerto distinto y de ser ese el caso deberá ajustar el puerto en la linea 24 del archivo index.js del backend por los conflictos generados por CORS

Nota:
Por favor bajar los cambios realizados ejecutando: git pull origin main en la terminal de este proyecto