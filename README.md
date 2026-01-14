# 📝 Todo Nequi — Prueba Técnica

## 📱 Descripción
**Todo Nequi** es una aplicación móvil desarrollada con **Ionic + Angular (Standalone)** que permite gestionar tareas y categorías, con persistencia local y control de funcionalidades mediante **Firebase Remote Config**.

La app está estructurada en tres pestañas:
- **Tareas**: CRUD de tareas con estado completado y filtro por categoría.
- **Categorías**: CRUD de categorías reutilizables.
- **Remote Config**: Demostración de feature flags en tiempo real.

---

## 🧱 Arquitectura y decisiones técnicas

### 🔹 Frameworks y herramientas
- Ionic Framework (UI y componentes móviles)
- Angular Standalone Components
- Ionic Storage (persistencia local)
- Firebase Remote Config (feature flags)
- RxJS (BehaviorSubject) para manejo reactivo del estado

### 🔹 Estructura del proyecto

```
src/app
├── core
│   ├── models
│   └── services
├── components
│   ├── task-modal
│   └── category-modal
├── tab1 (Tareas)
├── tab2 (Categorías)
├── tab3 (Remote Config)
└── tabs
```
---

## ✅ Funcionalidades principales

### 🗂️ Tareas
- Crear, editar y eliminar tareas
- Marcar tareas como completadas
- Asociar tareas a categorías
- Filtro por categoría
- Estado **“Sin categoría”** cuando no aplica

### 🏷️ Categorías
- Crear, editar y eliminar categorías
- **Integridad de datos**:  
  Al eliminar una categoría, las tareas asociadas quedan automáticamente como **“Sin categoría”**, evitando referencias huérfanas.

### 🚩 Feature Flags (Firebase Remote Config)
- Flag: `enableCategories`
- Controla dinámicamente:
  - Visibilidad del Tab de Categorías
  - Filtro por categoría en Tareas
  - Selector de categoría en el modal de tareas
- Cambios aplicados **sin reinstalar la app**

---

## ⚡ Optimización de rendimiento

Se aplicaron técnicas reales de optimización:

### 🔹 `trackBy`
Evita recrear elementos innecesariamente en listas (`*ngFor`):

```ts
trackByTaskId(_: number, t: Task) {
  return t.id;
}
```
🔹 ChangeDetectionStrategy.OnPush

Reduce ciclos de detección de cambios y mejora el rendimiento en dispositivos móviles.

🔹 ChangeDetectorRef.markForCheck()

Usado estratégicamente para mantener consistencia visual al trabajar con OnPush y suscripciones manuales.

---

💾 Persistencia
*	Los datos se almacenan localmente usando Ionic Storage
*	El estado se mantiene entre reinicios de la app

---

🔧 Requisitos
*	Node.js 22.x
*	Ionic CLI
*	Android Studio (para build Android)
*	Xcode (opcional, para iOS)
*	Cuenta de Firebase

---

▶️ Cómo ejecutar el proyecto

npm install
ionic serve


---

🔥 Configurar Firebase Remote Config
1.	Crear proyecto en Firebase
2.	Agregar una app Web
3.	Copiar la configuración en:
	*	src/environments/environment.ts
	*	src/environments/environment.prod.ts
4.	Crear el parámetro:
	*	Nombre: enableCategories
	*	Tipo: Boolean
	*	Valor por defecto: true
5.	Publicar cambios y usar la pestaña Remote Config dentro de la app para refrescar.

---

📦 Build Android (APK)
```
ionic build
cordova platform add android
cordova prepare android
cordova build android
```

En Android Studio:<br>

Build > Build Bundle(s) / APK(s) > Build APK(s)


---

🍎 Build iOS

Requiere macOS + Xcode + cuenta de Apple Developer.
```
ionic build
cordova platform add ios
cordova prepare ios
cordova build ios
```

---

🔍 Posibles mejoras futuras
* Sincronización con backend remoto
* Autenticación de usuarios
* Tests unitarios y e2e
* Uso de async pipe para eliminar ChangeDetectorRef
* Soporte offline-first avanzado

---

🧠 Respuestas técnicas solicitadas

❓ ¿Cuáles fueron los principales desafíos que enfrentaste al implementar las nuevas funcionalidades?<br>
* Manejo de feature flags en tiempo real: integrar Firebase Remote Config asegurando que la UI reaccionara correctamente al activar/desactivar funcionalidades críticas (categorías, filtros y selectores), incluyendo valores por defecto y fallback ante fallos de red.<br>
* Compatibilidad entre plataformas (Web, Android e iOS): se presentaron diferencias de comportamiento en WKWebView (iOS) frente a Android/Web, especialmente en navegación y modales, lo que requirió ajustes finos en imports standalone y estructura de overlays.
* Uso de Angular Standalone + Ionic: fue clave controlar cuidadosamente los imports por componente para evitar conflictos como componentes duplicados (IonHeader, IonToolbar) y errores de compilación en ionic serve.
* Consistencia de estado y UX: asegurar que filtros, búsquedas, categorías y contadores se mantuvieran sincronizados tras operaciones CRUD, sin inconsistencias visuales ni pérdida de estado.

---

❓ ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?
* ChangeDetectionStrategy.OnPush: para reducir ciclos innecesarios de detección de cambios, especialmente en listas con múltiples elementos (tareas y categorías).
* *trackBy en ngFor: evita recrear componentes al filtrar o actualizar tareas, mejorando la fluidez con grandes volúmenes de datos.
* Debounce en búsquedas: reduce el número de recalculaciones al escribir, mejorando rendimiento y experiencia de usuario.
* Manejo inmutable de colecciones: al refrescar datos se generan nuevos arrays, permitiendo que OnPush detecte cambios de forma eficiente.
* Inicialización controlada de servicios: evita reprocesar datos y garantiza que la carga inicial sea predecible y rápida.

---

❓ ¿Cómo aseguraste la calidad y mantenibilidad del código?
* Separación clara de responsabilidades:
* Servicios (TasksService, CategoriesService, FeatureFlagsService) para lógica de negocio y estado
* Componentes para UI
* Modales reutilizables para formularios
* Modelos tipados: uso de interfaces claras (Task, Category) que facilitan refactors y reducen errores.
* Feature flags desacoplados: la app funciona correctamente incluso si Firebase no responde, gracias a defaults locales.
* Componentes reutilizables y standalone: facilita escalabilidad y reduce acoplamiento.
* Estructura limpia y documentada: README claro, pasos reproducibles y funciones de seed demo para pruebas rápidas.

---


## 👤 Autor
**Ancízar López**<br>
Prueba técnica – Desarrollador Frontend / Mobile<br>
_Ionic – Angular_

---

🏁 Comentario final

Esta aplicación prioriza claridad, rendimiento y buenas prácticas, mostrando un enfoque realista de desarrollo mobile con Angular e Ionic, orientado a escalabilidad y mantenibilidad.

