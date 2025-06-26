# 🚀 El Blog del CEO

Un blog moderno con **Notion como CMS** que incluye dos secciones: **Blog Personal** y **Electric Automatic Chile**. Construido con Next.js 15, TypeScript y Tailwind CSS.

## ✨ Características

- 🎨 **Diseño moderno y responsivo** con Tailwind CSS
- 📝 **Notion como CMS** - Gestiona tu contenido fácilmente
- 🏢 **Dos secciones diferenciadas**: Personal y Electric Automatic Chile
- ⚡ **Optimizado para SEO** con metadatos personalizados
- 📱 **Totalmente responsivo** para móvil, tablet y desktop
- 🚀 **Rápido** gracias a Next.js 15 y Turbopack
- 📊 **Tiempo de lectura automático** para cada post
- 🏷️ **Sistema de tags y categorías**
- ⭐ **Posts destacados** en la página principal

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **CMS**: Notion API
- **Iconos**: Lucide React
- **Formateo de fechas**: date-fns
- **Markdown**: react-markdown

## 📋 Prerequisitos

- Node.js 18 o superior
- npm o yarn
- Cuenta de Notion
- Integración de Notion configurada

## 🚀 Instalación

1. **Clona o descarga el proyecto**

```bash
git clone <tu-repositorio>
cd el-blog-del-ceo
```

2. **Instala las dependencias**

```bash
npm install --legacy-peer-deps
```

3. **Configura las variables de entorno**

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Notion:

```env
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Inicia el servidor de desarrollo**

```bash
npm run dev
```

El blog estará disponible en `http://localhost:3000`

## 📊 Configuración de Notion

### 1. Crear una Integración

1. Ve a [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Haz clic en "Create new integration"
3. Dale un nombre (ej: "El Blog del CEO")
4. Selecciona el workspace donde crearás la base de datos
5. Copia el **Internal Integration Token**

### 2. Crear la Base de Datos

Crea una nueva base de datos en Notion con estas propiedades:

| Nombre        | Tipo         | Descripción                          |
| ------------- | ------------ | ------------------------------------ |
| **Título**    | Title        | El título del post (campo principal) |
| **Resumen**   | Text         | Descripción corta del post           |
| **Categoría** | Select       | "Personal" o "Electric Automatic"    |
| **Tags**      | Multi-select | Etiquetas del post                   |
| **Publicado** | Checkbox     | Si el post está publicado            |
| **Destacado** | Checkbox     | Si aparece en la sección destacados  |
| **Fecha**     | Date         | Fecha de publicación                 |
| **Autor**     | Text         | Nombre del autor                     |

### 3. Configurar Permisos

1. En tu base de datos, haz clic en los 3 puntos (...)
2. Ve a "Add connections"
3. Busca y selecciona tu integración
4. Copia el ID de la base de datos desde la URL

## 📝 Estructura de las Categorías

### Blog Personal

- **Color**: Azul
- **Enfoque**: Reflexiones personales, liderazgo, crecimiento profesional
- **Temas sugeridos**:
  - Lecciones de liderazgo
  - Construcción de equipos
  - Mindset emprendedor
  - Balance vida-trabajo

### Electric Automatic Chile

- **Color**: Verde
- **Enfoque**: Insights de la industria, innovación tecnológica
- **Temas sugeridos**:
  - Tendencias en automatización industrial
  - Casos de éxito en Chile
  - Innovaciones tecnológicas
  - Sostenibilidad energética

## 🎨 Personalización

### Colores y Branding

Los colores principales están definidos en:

- **Personal**: Azul (`blue-600`, `blue-700`)
- **Electric Automatic**: Verde (`green-600`, `green-700`)

Puedes personalizar estos colores editando los componentes en:

- `components/BlogCard.tsx`
- `components/Navigation.tsx`
- `app/page.tsx`

### Metadatos y SEO

Cada página tiene metadatos optimizados. Personaliza:

- `app/layout.tsx` - Metadatos globales
- `app/page.tsx` - Página principal
- `app/blog/personal/page.tsx` - Blog personal
- `app/blog/electric-automatic/page.tsx` - Blog empresarial

## 📂 Estructura del Proyecto

```
el-blog-del-ceo/
├── app/
│   ├── blog/
│   │   ├── personal/page.tsx          # Blog personal
│   │   └── electric-automatic/page.tsx # Blog empresarial
│   ├── globals.css                     # Estilos globales
│   ├── layout.tsx                      # Layout principal
│   └── page.tsx                        # Página de inicio
├── components/
│   ├── BlogCard.tsx                    # Tarjeta de post
│   ├── Footer.tsx                      # Footer del sitio
│   └── Navigation.tsx                  # Navegación principal
├── lib/
│   ├── notion.ts                       # Cliente de Notion
│   └── types.ts                        # Tipos TypeScript
└── .env.example                        # Variables de entorno
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno en el dashboard
3. Despliega automáticamente

### Variables de Entorno en Producción

```env
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

## 📈 Funcionalidades Futuras

### Posibles Mejoras

- 🔍 **Búsqueda de posts** con filtros
- 📧 **Newsletter** integrado
- 💬 **Sistema de comentarios**
- 📊 **Analytics** de posts más leídos
- 🌙 **Modo oscuro**
- 🔗 **Compartir en redes sociales**
- 📱 **PWA** (Progressive Web App)
- 🔔 **Notificaciones push**

### Integraciones Adicionales

- **EmailJS** para formularios de contacto
- **Google Analytics** para métricas
- **Disqus** para comentarios
- **Mailchimp** para newsletter
- **Hotjar** para análisis de usuario

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ve el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la [documentación de Notion API](https://developers.notion.com/)
2. Verifica que tu integración tenga permisos en la base de datos
3. Asegúrate de que las variables de entorno estén correctas
4. Revisa la consola del navegador para errores

## 👨‍💼 Acerca del Autor

**CEO de Electric Automatic Chile**

- 🏢 Founder de [Electric Automatic Chile](https://www.electricautomaticchile.com)
- 💡 Especialista en automatización eléctrica e innovación industrial
- 📝 Apasionado por compartir conocimientos sobre liderazgo y emprendimiento

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!

🚀 **¡Ahora tienes un blog profesional con Notion como CMS!**
