# UNIVERSIDAD MAYOR DE SAN ANDRES
# FACULTAD DE CIENCIAS PURAS Y NATURALES
# CARRERA DE INFORMATICA
## Proyectos Grupales - Producción Multimedia

Repositorio con el código fuente de los proyectos grupales.

##  Equipo de Trabajo
* **Integrante 1:** CHINO NINA OSCAR
* **Integrante 2:** MAMANI BAUTISTA WILSON
* **Integrante 3:** MACHACA CALLISAYA GLADYS JHOSELIN
* **Integrante 4:** ZAPATA  GUTIERREZ JHORDAN FREDDY

---
enlace de l pagina web para poder testear:https://weidwilson22.github.io/Proyectos-Grupales-Multimedia/
##  Proyectos Incluidos

Este repositorio contiene el desarrollo de las siguientes actividades grupales:

### A. Digitalización de Trámites Universitarios
Propuesta de modernización digital para dos trámites universitarios, gestionando la información mediante un sistema de almacenamiento BPM basado en archivos JSON, sin bases de datos tradicionales.
* **Tecnologías:** : HTML, CSS, JavaScript / C# / PythoN
* **Estado:** [Completado / En desarrollo]

### B. Desarrollo 3D y Realidad Virtual
Desarrollo de entornos virtuales interactivos exportados para visualización en navegador.
1. **Animación en Unity:** Escena con múltiples personajes realizando una coreografía sincronizada con música, exportada en WebGL.
2. **Avatar Digital:** Modelo tridimensional de un integrante del grupo generado mediante herramientas de fotogrametría.
* **Tecnologías:** Unity 3D, WebGL, Colmap,Meshlab.

---

##  Instalación y Ejecución

A continuación, se detallan los pasos para ejecutar cada módulo del proyecto en un entorno local:

### Para el Sistema de Trámites (JSON)
1. Clonar el repositorio: `git clone [URL_DEL_REPOSITORIO]`
2. Abrir la carpeta `[Nombre_de_la_carpeta_del_proyecto_A]` en su editor o IDE de preferencia.
4. Los datos se guardarán y leerán dinámicamente desde el archivo `data.json` ubicado en la carpeta raíz.

### Para la Escena 3D (WebGL)
1. Navegar a la carpeta `Unity_Animacion`.
2. Al estar exportado en WebGL, es necesario levantar un servidor local para evitar bloqueos de CORS en el navegador. 
3. Instrucción de ejecución:  "Si usa Python, ejecute `python -m http.server` en la terminal".
4. Acceder a `http://localhost:[puerto]` (poner el puerto designado),en cualquier navegador moderno.

### Para el Modelo Fotogramétrico
1. El archivo del modelo final  `.obj` se encuentra en la ruta `Fotogrametria`.
2. Puede ser visualizado directamente en la plataforma web funcional desarrollada para la entrega.
