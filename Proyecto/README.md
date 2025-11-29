## Funcionamiento del proyecto
Por el Stack de tecnologías definido para este proyecto su ejecución se separa en dos servicios. Uno de estos servicios será el `Frontend` el cual se realiza con el **Framework React**, mientras que el otro servicio será el `Backend` el cual se realiza con el **Framework Express**. Como se puede notar, para ambos servicios se utilizan Frameworks de `JavaScript` por lo que para poder ejecutar este proyecto será necesario contar de antemano con el runtime environment **Node.js**.

Dentro de la carpeta `client` se encuentra todo lo relacionado con **React**, mientras que en la carpeta `server` se encuentra todo lo relacionado con **Express**. Para obtener mayor detalle sobre como levantar cada uno de estos servicios, ingresar en la carpeta que corresponda.

# IMPORTANTE (LEER ANTES DE PROBAR LA APLICACIÓN)
Dado que se está en una fase de testing, se trabajara con un User fijo (es posible crear otros, pero esto es más que todo para facilitar el testeo). Para crear este User fijo se adjuntó un documento PDF en `/Proyecto/` nombrado `clientePruebas.pdf` el cual contiene una liquidación de sueldo de un cliente de prueba falso, este PDF es requerido al momento de registrarse.
El registro debe ser **los mismos datos** del cliente de prueba para validar correctamente los datos.
Para rut y nombre se debe ingresar en el siguiente formato:
    - RUT: 18999000-5
    - Nombre completo: RODRIGO ALEJANDRO SOTO MUNOZ
El resto de datos son irrelevantes para la validación y puede rellenar como desee.

Además, se deberá obtener una API KEY en el sitio https://aistudio.google.com para que funcione la IA Gemini en el proceso de registro, en caso contrario no sera posible registrarse, esta API KEY debe colocarse en `server/.env`
Los pasos a seguir para obtener la API KEY son los siguientes:
- Acceder al sitio
- Acceder a `Get API Key` abajo a la izquierda
- Crear un nuevo proyecto (puede ser cualquier nombre y motivo)
- Copiar la API KEY generada y colocarla en `server/.env` en el comentario  `# GEMINI_API_KEY = "<API_KEY>"` (borrando el '#')
- Una vez hecho esto, se puede ejecutar el proyecto de parte del server, es decir, ejecutar por terminal `docker compose up` o sus variantes.