/**
 * Importaciones de archivos.
 */
importScripts('js/sw-utils.js');

/**
 * Tipos de caches de la aplicación.
 */
const ESTATICO = 'estatico_v2';
const INMUTABLE = 'inmutable_v2';
const DINAMICO = 'dinamico_v2';

/**
 * Recursos estáticos.
 */
const SHELL = [
  //   '/',
  'index.html',
  'css/style.css',
  'js/app.js',
  'img/favicon.ico',
  'js/sw-utils.js'
];

/**
 * Recursos inmutables.
 */
const LIBRERIAS = [
  'css/animate.css',
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css'
];

/**
 * Recursos dinámicos.
 */
const RECURSOS = [
  'img/avatars/boy-1.png',
  'img/avatars/girl-1.png',
  'img/avatars/boy-2.png',
  'img/avatars/girl-2.png',
  'img/avatars/boy-3.png'
];

/**
 * Almacenamiento de los recursos.
 */
self.addEventListener('install', evento => {
  const estaticos = caches.open(ESTATICO).then(cache => cache.addAll(SHELL));
  const inmutables = caches
    .open(INMUTABLE)
    .then(cache => cache.addAll(LIBRERIAS));
  const dinamicos = caches.open(DINAMICO).then(cache => cache.addAll(RECURSOS));
  evento.waitUntil([estaticos, inmutables, dinamicos]);
});

/**
 * Eliminación de los caches anteriores.
 */
self.addEventListener('activate', evento => {
  const renovar = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== ESTATICO && key.includes('estatico')) {
        return caches.delete(key);
      }
      if (key !== DINAMICO && key.includes('dinamico')) {
        return caches.delete(key);
      }
    });
  });
  evento.waitUntil(renovar);
});

/**
 * Estrategia del cache (Cache with Network Fallback).
 */
self.addEventListener('fetch', evento => {
  const respuesta = caches.match(evento.request).then(cache => {
    if (cache) {
      return cache;
    } else {
      return fetch(evento.request).then(nuevo => {
        return actualizarCacheDinamico(DINAMICO, evento.request, nuevo);
      });
    }
  });
  evento.respondWith(respuesta);
});
