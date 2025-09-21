# 🖥️ PcServerApi Frontend

[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://react.dev/)  
[![Vite](https://img.shields.io/badge/Vite-Build-646cff?logo=vite&logoColor=yellow)](https://vitejs.dev/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)  
[![Node.js](https://img.shields.io/badge/Node-18+-green?logo=node.js&logoColor=white)](https://nodejs.org/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Frontend en **React + Vite + TypeScript** para la gestión remota de servicios en el PC.  
Permite visualizar el estado de los servicios (online, iniciando, apagado), abrir una consola de logs, enviar comandos, apagar el servidor y cerrar sesión de forma segura.

---

## ✨ Funcionalidades

- 🔐 **Autenticación con JWT** (login seguro).
- 📊 **Panel de control de servicios**:
  - Ver estado de cada servicio (`offline`, `starting`, `running`).
  - Ver número de jugadores conectados (para servidores de juegos como Minecraft).
  - Abrir una **consola interactiva** para cada servicio.
- 📝 **Consola de logs en vivo** con auto-scroll.
- 💻 **Envío de comandos** a los servicios directamente desde la web.
- 🛑 **Apagar servicios** individualmente.
- ⏻ **Apagar el PC** con confirmación.
- 🚪 **Cerrar sesión** con un clic.
- 🔔 **Notificaciones (toasts)** para errores y confirmaciones.

---

## 🚀 Tecnologías

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [CSS Modules](https://github.com/css-modules/css-modules) para estilos aislados.
- Context API para autenticación.

---

## 📂 Estructura principal

```plaintext
src/
├── components/   # Componentes reutilizables (Toast, ServiceModal, etc.)
├── context/      # Contexto de autenticación
├── pages/        # Páginas principales (Login, Dashboard)
├── App.tsx       # Configuración de rutas
├── main.tsx      # Entry point
└── styles/       # Estilos globales
```

---

## ⚙️ Requisitos

- Node.js 18 o superior
- pnpm / npm / yarn (el proyecto está optimizado para **pnpm**)

---

## 🛠️ Instalación y ejecución

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tuusuario/pcserverapi-frontend.git
   cd pcserverapi-frontend
   ```

2. Clona el repositorio:

   ```bash
   pnpm install
   ```

3. Configura el archivo .env:

   ```env
   VITE_BACKEND_URL=http://localhost:5000
   VITE_BACKEND_WOL_URL=http://localhost:8080
   VITE_PC_MAC=mac_pc_wake_on_lan
   VITE_PC_BROADCAST=192.168.1.255
   VITE_API_KEY=key_wake_on_lan
   ```

4. Arranca el servidor de desarrollo:

   ```bash
   pnpm dev
   ```

5. Arranca el servidor de desarrollo:

   ```arduino
   http://localhost:5173
   ```

## 🏗️ Build para producción

```bash
pnpm build
```

Los archivos listos para desplegar estarán en la carpeta dist/.
Para probar el build localmente:

```bash
pnpm preview
```
