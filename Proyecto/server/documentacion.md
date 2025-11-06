Bastian:
Se descargó joi (validador de entradas)
- /index.js:
    - Se agregó CORS para manejar peticiones front-back
    - api health para verificar servicio
    - api echo es ruta de prueba para validar req.body y CORS permite hablar desde el front

- /services/scoring.services.js:
    - Se incluyeron las siguientes APIS:
        - **Para calcular score:** `await computeScore(input, cfgOverride?)` 
          Retorna { score, breakdown, usedConfig }
        - **Actualizar config en memoria (persiste mientras el proceso vive)**: `setRuntimeConfig(partialCfg)` y retorna el override
        - **obtener override actual**: `getRuntimeConfig()`