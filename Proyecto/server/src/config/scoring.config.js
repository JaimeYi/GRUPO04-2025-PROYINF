// Config DEMO

module.exports = {

  totalMin: 1,
  totalMax: 100,

  // pueden no sumar 100, el servicio reescala al totalMax
  weights: {
    capacidadPago: 40,
    antiguedad: 15,
    endeudamiento: 20,
    historial: 20,
    edad: 5
  },

  // Parámetros por componente

  // Capacidad de pago: ratio = cuotaEstimada / ingresoMensual
  // ratioGood =  umbral bueno (mejor o igual que esto es puntaje máximo del componente)
  // ratioBad =  umbral malo (peor o igual que esto es 0 para el componente)
  // Entre ambos se mapea linealmente.
  capacidadPago: {
    ratioGood: 0.20,
    ratioBad: 0.50
  },

  // Antiguedad laboral: meses para alcanzar puntaje máximo de este componente
  antiguedad: {
    monthsFull: 24
  },

  // Endeudamiento: ratio = deudasVigentes / ingresoMensual
  // Ideal <= ratioGood, 0 puntos si >= ratioBad
  endeudamiento: {
    ratioGood: 0.20,
    ratioBad: 1.00
  },

  // Historial: parte de base y aplica penalizaciones
  // El resultado interno se "encaja" entre [min..max] y luego se escala al peso del componente
  historial: {
    base: 20,
    penalty: {
      morosidad: 12,
      protestos: 8
    },

    min: 0,
    max: 20
  },

  edad: {
    youngMin: 21, //si edad es menor a youngMin, usa ptsYoungBelow (0 default)
    idealMin: 25, // cota inferior ideal, joven entre youngMin e idealMin (usa youngBand)
    idealMax: 65, // cota superior "ideal", ideal definido entre ambos idealMin e idealMax
    ptsYoungBelow: 0,
    ptsYoungBand: 2, // rango "aceptable" mas bien no excelente, sector "joven"
    ptsIdeal: 5,
    ptsSenior: 3 // cualquiera sobre cota superior
  }
};
