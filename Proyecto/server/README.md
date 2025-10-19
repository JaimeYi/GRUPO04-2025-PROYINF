# Guía para levantar framework Express y PostgreSQL
## Requisitos Previos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- [Node.js](https://nodejs.org/) (opcional, solo para desarrollo local)
## Instalación del proyecto

### 1. Clonar el repositorio
git clone https://github.com/JaimeYi/GRUPO04-2025-PROYINF.git

### 2. Montar contenedores
**Este paso es necesario para la instalación del proyecto, pero de igual manera debe realizarse este paso en caso de modificar alguno de los archivos Docker.**

(debe tener docker-desktop abierto en todo momento)

1. Abrir terminal y navegar hasta la carpeta GRUPO04-2025-PROYINF/Proyecto/server.

2. Ejecutar comando `docker compose up --build` (Esto instalará las dependencias lo cual suele demorar un poco la primera vez).

3. Felicidades! el backend del proyecto ya esta corriendo de manera correcta.

Si se trabajará desde Windows se debe tener instalado WSL2 y tenerlo activado en Docker Desktop. Esto se puede verificar en:
Configuración   
-Resources  
  -Configure which WSL 2 distros you want to access Docker from. (esto debe estar activo)  
  -Enable integration with additional distros:(esto debe estar activo)  

## Ejecución del proyecto
(debe tener docker-desktop abierto en todo momento)
(ignorar este paso en caso de que el último comando utilizado haya sido `docker compose up --build`)

### 1. Navegar hasta el directorio correspondiente
Abrir la terminal y navegar hasta el directorio GRUPO04-2025-PROYINF/Proyecto/server.

### 2. Levantar los contenedores
Dado que se construyeron los contenedores en el paso de la instalación no es necesario utilizar el flag `--build`, por lo que el comando para levantar los contenedores quedaría `docker compose up`.

Si se están levantando los contenedores por primera vez luego de realizar un `git pull` se recomienda encarecidamente ejecutar los siguientes comandos:

`docker compose down -v` -> `docker compose up --build`

Para de esta manera aplicar cualquier posible cambio que se haya realizado en la estructura de la base de datos o aplicar algún nuevo módulo que se haya incluido al proyecto.

### 3. Bajar contenedores
Al terminar de trabajar con los contenedores se tienen dos opciones:

1. Utilizar `Ctrl+C` en la terminal donde se haya ejecutado el comando `docker compose up` para terminar la ejecución de Docker y que de esta manera se bajen los contenedores.
2. Bajar los contenedores directamente desde la aplicación Docker Desktop.