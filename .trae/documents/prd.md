## 1. Descripción del Producto
Auto-TV es una aplicación web que ofrece una experiencia de "televisión tradicional" utilizando contenido de YouTube. Permite a los usuarios "zapear" entre canales temáticos preconfigurados con una interfaz de guía de programación, donde los videos se reproducen "en vivo" (a mitad de emisión), sin necesidad de crear una cuenta.

## 2. Características Principales

### 2.1 Roles de Usuario
No se requiere inicio de sesión ni registro. Todos los usuarios acceden directamente a la experiencia de visualización anónima y gratuita.

### 2.2 Módulos de Funcionalidad
1. **Reproductor de TV**: Reproductor de video a pantalla completa (embed de YouTube) limpio, sin distracciones, simulando una emisión en directo.
2. **Guía de Programación (EPG)**: Interfaz superpuesta o accesible estilo televisión por cable que muestra los canales y la programación actual y futura (hasta 24 horas).
3. **Zapping y Canales**: Cambio rápido de canales temáticos preconfigurados (Noticias, Política, Deportes, Lifestyle, Tecnología, Gaming, Música, AI & ML, Code & Dev, etc.).
4. **Simulador de Emisión y Audiencia**: Sincronización del tiempo del video para que inicie "a mitad de emisión" y un contador de espectadores en vivo simulado o real.

### 2.3 Detalles de Página
| Nombre de Página | Nombre del Módulo | Descripción de la Función |
|------------------|-------------------|---------------------------|
| Pantalla Principal | Reproductor YouTube | Reproduce el video actual del canal seleccionado. Oculta controles de YouTube en la medida de lo posible, sin barra lateral ni comentarios. |
| Pantalla Principal | OSD (On-Screen Display) | Muestra brevemente el número/nombre del canal, programa actual y contador de espectadores al cambiar de canal. |
| Pantalla Principal | Guía de Programación | Menú estilo grilla/parrilla de TV que muestra la programación de las próximas 24 horas para todos los canales. Permite seleccionar un canal para sintonizarlo. |

## 3. Proceso Principal
El usuario entra a la web e inmediatamente comienza a reproducirse el primer canal (ej. Noticias) a mitad de emisión. El usuario puede presionar botones de "canal arriba/abajo" o abrir la Guía de Programación. Al abrir la guía, navega por la parrilla de canales y horarios. Al seleccionar un canal, el reproductor cambia al nuevo video de YouTube, calculando el "timestamp" exacto para que parezca una emisión en vivo continua.

```mermaid
graph TD
    A["Inicio (Carga Web)"] --> B["Sintoniza Canal por Defecto"]
    B --> C["Reproducción 'En Vivo'"]
    C --> D{"Acción del Usuario"}
    D -->|Zapping (Arriba/Abajo)| E["Cambia de Canal"]
    D -->|Abre Guía| F["Muestra Parrilla de TV"]
    F --> G["Selecciona Nuevo Canal"]
    G --> E
    E --> C
```

## 4. Diseño de Interfaz de Usuario
### 4.1 Estilo de Diseño
- **Colores**: Tema oscuro (Dark Mode) puro para maximizar el contraste y la inmersión visual (negros profundos, grises oscuros) con acentos de color vibrante (ej. neón cian o magenta para selección en la guía).
- **Tipografía**: Fuentes monoespaciadas para la información técnica (hora, espectadores) y fuentes Sans-Serif limpias y legibles (ej. tipo Roboto o Inter adaptada a estética de TV moderna) para la guía.
- **Estilo de Botones y Menús**: Minimalista, semitransparente con efecto "glassmorphism" (cristal esmerilado) para que el video de fondo siga siendo visible.
- **Animaciones**: Transiciones rápidas y fluidas, imitando la velocidad de un decodificador de TV moderno. Efecto sutil de estática o fundido a negro muy rápido al cambiar de canal.

### 4.2 Resumen de Diseño de Página
| Nombre de Página | Nombre del Módulo | Elementos de UI |
|------------------|-------------------|-----------------|
| Pantalla Principal | Reproductor | Ocupa el 100% de la pantalla (vw y vh). |
| Pantalla Principal | Info OSD | Texto grande en la esquina superior izquierda (Canal), superior derecha (Espectadores), inferior (Programa). Desaparece tras 3 segundos. |
| Pantalla Principal | Guía de TV | Overlay oscuro (80% opacidad). Grilla de canales (eje Y) y línea de tiempo (eje X). Foco claro en el programa seleccionado. |

### 4.3 Responsividad
- Enfoque "Desktop-first" pensado para pantallas grandes, pero totalmente adaptable a dispositivos móviles. En móviles, el zapping se puede hacer con gestos (swipe up/down) y la guía se adapta a una vista de lista vertical si la grilla horizontal no cabe.
