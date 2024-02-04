# Vidown  ![Vidown Logo](./electron/icon/2.jpeg)


Una aplicación para descargar vídeos de YouTube o música.

## Descripción

Vidown es una aplicación que te permite descargar vídeos de YouTube o música para su uso offline. La aplicación está construida con Electron y utiliza Tailwind CSS para el diseño.

## Instrucciones de Desarrollo

### IMPORTANTE 
Para ejecutar esta aplicación, necesitas tener Python instalado en tu dispositivo. 


### Ejecutar en Modo de Desarrollo

Para ejecutar la aplicación en modo de desarrollo, utiliza el siguiente comando:

```bash
npm run dev
```

Este comando inicia la aplicación Electron.

### Compilar Estilos con Tailwind CSS

Si necesitas realizar cambios en los estilos y Tailwind CSS, puedes usar el siguiente comando:

```bash
npm run styles
```

### Construir la Aplicación

Para construir la aplicación, puedes usar el siguiente comando:

```bash
npm run build
```

Este comando utiliza Electron Builder para construir la aplicación para diferentes plataformas

### Estructura del Proyecto

1. El código principal de Electron se encuentra en ./electron/main.js.
2. Los estilos se encuentran en ./main.css y se compilan a ./electron/styles.css.
3. El script de descarga de YouTube está en downloader_youtube.py.

### Dependencias de Desarrollo

1. Electron Builder: ^24.9.1
2. Tailwind CSS: ^3.4.1
3. Electron: ^28.2.1
