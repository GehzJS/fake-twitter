/**
 * Función para agregar nuevos elementos al cache dínamico.
 */
const actualizarCacheDinamico = (dinamico, peticion, respuesta) => {
  if (respuesta.ok) {
    return caches.open(dinamico).then(cache => {
      cache.put(peticion, respuesta.clone());
      return respuesta;
    });
  } else {
    return respuesta;
  }
};
