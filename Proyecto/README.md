## Funcionamiento del proyecto
Por el Stack de tecnologías definido para este proyecto su ejecución se separa en dos servicios. Uno de estos servicios será el `Frontend` el cual se realiza con el **Framework React**, mientras que el otro servicio será el `Backend` el cual se realiza con el **Framework Express**. Como se puede notar, para ambos servicios se utilizan Frameworks de `JavaScript` por lo que para poder ejecutar este proyecto será necesario contar de antemano con el runtime environment **Node.js**.

Dentro de la carpeta `client` se encuentra todo lo relacionado con **React**, mientras que en la carpeta `server` se encuentra todo lo relacionado con **Express**. Para obtener mayor detalle sobre como levantar cada uno de estos servicios, ingresar en la carpeta que corresponda.

## IMPORTANTE
Dado que se está en una fase de testing, se trabajara con un User fijo (es posible crear otros, pero esto es más que todo para facilitar el testeo). Para crear este User fijo se adjunto un documento PDF el cual contiene una liquidación de sueldo falsa, esta liquidacion de sueldo es requerida al momento de registrarse, de igual manera el nombre y el rut ingresados en el formulario de registro debe coincidir con los que aparecen en la liquidacion de sueldo.

Por otro lado, tambien se debe obtener una API KEY en el sitio https://aistudio.google.com para que funcione la IA Gemini en el proceso de registro, en caso contrario no sera posible registrarse, esta API KEY debe colocarse en server/.env