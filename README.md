# 🏢 Sistema de Registro de Visitas Residencial

Un sistema completo de gestión de visitas para residenciales con códigos QR, diseñado específicamente para dispositivos móviles.

## ✨ Características Principales

### 🔐 Autenticación Completa
- ✅ Registro de residentes con email y contraseña
- ✅ Formulario de completar perfil (nombre, departamento, teléfono)
- ✅ Roles de usuario (residente, administrador, vigilante)
- ✅ Sistema de sesiones seguro con Firebase Auth

### 📝 Registro de Visitas
- ✅ Formulario completo con validación en tiempo real
- ✅ Campos: Nombre, teléfono, fecha, hora, motivo, comentarios
- ✅ Generación automática de códigos QR únicos
- ✅ Descarga de códigos QR en formato PNG
- ✅ Compartir códigos QR nativamente

### 📱 Escáner QR
- ✅ Interfaz para escanear códigos QR (entrada manual)
- ✅ Validación completa de visitas:
  - Verificación de fecha (solo visitas del día actual)
  - Verificación de estado (pendiente, autorizada, rechazada)
  - Mostrar información completa del visitante
- ✅ Vista previa detallada con información de residencia
- ✅ Botones para marcar visitas como completadas

### 👨‍💼 Panel de Administrador
- ✅ Vista de todas las visitas con filtros avanzados
- ✅ Filtros por fecha y estado
- ✅ Autorizar/rechazar visitas pendientes
- ✅ Marcar visitas como completadas
- ✅ Tabla completa con información de visitantes y residentes
- ✅ Estadísticas en tiempo real

### 🛡️ Panel de Vigilante
- ✅ Dashboard con visitas del día
- ✅ Escáner QR integrado
- ✅ Vista de visitas autorizadas listas para ingreso
- ✅ Marcar visitas como completadas

### 🏠 Panel de Residente
- ✅ Dashboard personal con estadísticas
- ✅ Registro de nuevas visitas
- ✅ Historial completo de visitas
- ✅ Descarga y compartir códigos QR

## 🎨 Diseño UI/UX

- **Paleta profesional**: Colores naranjas visualmente agradables
- **Diseño responsive**: Funciona perfectamente en móviles y desktop
- **Mobile-first**: Optimizado para dispositivos móviles
- **Interfaz intuitiva**: Navegación por pestañas clara
- **Animaciones suaves**: Transiciones y estados de carga
- **Feedback visual**: Confirmaciones, errores y estados

## 🔧 Tecnologías Utilizadas

- **Frontend**: Next.js 15.3.2 con TypeScript
- **UI Components**: shadcn/ui con Tailwind CSS
- **Base de datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **Generación QR**: qrcode (librería libre)
- **Validaciones**: Zod + React Hook Form
- **Estilos**: Tailwind CSS 4.1.6

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd sistema-visitas-residencial
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Firebase
1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Authentication (Email/Password)
3. Crear base de datos Firestore
4. Copiar las credenciales a `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 4. Ejecutar la aplicación
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:8000`

## 👥 Cuentas de Prueba

Una vez configurado Firebase, puedes usar estas credenciales de prueba:

- **Administrador**: admin@residencial.com / admin123
- **Vigilante**: security@residencial.com / security123  
- **Residente**: resident@residencial.com / resident123

## 📱 Cómo Usar el Sistema

### Para Residentes:
1. **Registro**: Crear cuenta con email/contraseña
2. **Completar Perfil**: Agregar nombre, departamento y teléfono
3. **Registrar Visita**: Llenar formulario y generar QR
4. **Compartir QR**: Enviar código al visitante

### Para Vigilantes:
1. **Escanear**: El visitante muestra el código QR
2. **Verificar**: Revisar información y estado de la visita
3. **Completar**: Marcar visita como completada al salir

### Para Administradores:
1. **Autorizar**: Revisar y autorizar visitas pendientes
2. **Gestionar**: Filtrar y administrar todas las visitas
3. **Reportes**: Ver estadísticas y actividad del día

## 🔒 Seguridad y Validaciones

- ✅ Autenticación segura con Firebase
- ✅ Validación de roles y permisos
- ✅ Validación de formularios con Zod
- ✅ Sanitización de datos
- ✅ Protección de rutas por rol
- ✅ Códigos QR únicos con validación de fecha

## 📊 Estructura de Base de Datos

### Colección `users`
```typescript
{
  id: string;
  email: string;
  role: 'resident' | 'admin' | 'security';
  name: string;
  apartment: string;
  phone: string;
  createdAt: Date;
}
```

### Colección `visits`
```typescript
{
  id: string;
  visitorName: string;
  phone: string;
  date: string;
  time: string;
  reason: 'Personal' | 'Servicio' | 'Entrega' | 'Otro';
  comments?: string;
  qrCode: string;
  status: 'pendiente' | 'autorizada' | 'rechazada' | 'completada';
  residentId: string;
  residentName: string;
  residentApartment: string;
  createdAt: Date;
  authorizedBy?: string;
  authorizedAt?: Date;
  completedAt?: Date;
}
```

## 🎯 Funcionalidades Destacadas

### Códigos QR Inteligentes
- Generación automática con información completa
- Validación de fecha (solo día actual)
- Información de residencia incluida
- Descarga en formato PNG
- Compartir nativo en móviles

### Vista Previa para Vigilante
Al escanear un código QR, el vigilante ve:
- ✅ Nombre del visitante
- ✅ Nombre de la residencia: "Residencial Vista Hermosa"
- ✅ Departamento de destino
- ✅ Fecha y hora de la visita
- ✅ Motivo de la visita
- ✅ Fecha de vencimiento (válido solo el día programado)
- ✅ Estado actual de la visita
- ✅ Información del residente

### Estados de Visita
1. **Pendiente** → Recién creada, esperando autorización
2. **Autorizada** → Aprobada por administrador, lista para ingreso
3. **Completada** → Visita finalizada por vigilante
4. **Rechazada** → Denegada por administrador

## 📱 Optimización Móvil

- **Diseño mobile-first**: Prioridad en experiencia móvil
- **Formularios táctiles**: Optimizados para pantallas pequeñas
- **Navegación intuitiva**: Pestañas claras y accesibles
- **Códigos QR grandes**: Fáciles de escanear y compartir
- **Botones táctiles**: Tamaño adecuado para dedos

## 🛠️ Desarrollo

### Estructura del Proyecto
```
src/
├── app/                    # Páginas de Next.js
│   ├── admin/             # Panel de administrador
│   ├── auth/              # Autenticación
│   ├── resident/          # Panel de residente
│   └── security/          # Panel de vigilante
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de shadcn/ui
│   └── ...               # Componentes personalizados
├── contexts/             # Contextos de React
├── lib/                  # Utilidades y configuración
└── types/               # Tipos de TypeScript
```

### Scripts Disponibles
```bash
npm run dev      # Desarrollo
npm run build    # Construcción
npm run start    # Producción
npm run lint     # Linting
```

## 🎉 Estado del Proyecto

**✅ APLICACIÓN COMPLETAMENTE FUNCIONAL**

El sistema está 100% implementado y listo para usar. Solo requiere configuración de Firebase para funcionalidad completa de base de datos.

### Características Implementadas:
- ✅ Todas las páginas y componentes
- ✅ Sistema de autenticación completo
- ✅ Generación y validación de códigos QR
- ✅ Paneles para todos los roles
- ✅ Diseño responsive y mobile-first
- ✅ Validaciones y seguridad
- ✅ Estados de visita y flujo completo
- ✅ Interfaz de usuario pulida

### Para Producción:
1. Configurar Firebase con credenciales reales
2. Configurar dominio personalizado
3. Implementar reglas de seguridad de Firestore
4. Opcional: Agregar notificaciones push

---

**Desarrollado con ❤️ para mejorar la seguridad y gestión de visitas residenciales**
