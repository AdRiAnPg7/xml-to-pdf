# 📄 XML → PDF Generator

Este proyecto permite **convertir XMLs** junto con plantillas **XSLT + CSS** en documentos **PDF listos para impresión**.
Incluye soporte para:

* Plantillas multiples.
* Eleccion de **logo**.
* Generación de **código de barras PDF417** a partir del `<TED>`.
* Vista previa en navegador y exportación a **PDF**.

---

## 🚀 Setup

```bash
# 1. Clonar el repo
git clone https://github.com/AdRiAnPg7/xml-to-pdf.git
cd xml-to-pdf
cd xml2pdf-ui

# 2. Instalar dependencias
npm install

# 3. Levantar en modo dev
npm run dev

# 4. Abrir en navegador
http://localhost:5173
```

> ⚠️ Requiere **Node 18+**

---

## Vista general

1. **Sube XML + Logo → el sistema procesa.**
2. **Selecciona plantilla → se genera preview.**
3. **Haz clic en Exportar → obtienes el PDF A4.**

---

## 📂 Flujo del sistema

| Módulo                         | Descripción                                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **XmlUploader**                | Permite cargar un archivo XML, pegarlo manualmente o definir un `logoUrl`.                                               |
| **TemplatePicker**             | Selector de plantilla (`Basica`, `Clasica`, `Compacta`, `Minimal`, `Border`, `Azul`). Cambia el XSLT + CSS activos.               |
| **PreviewPane**                | Aplica el XSLT al XML, inyecta logo, código de barras PDF417 y muestra el HTML estilizado. |
| **downloadPdfFromHtmlElement** | Captura el HTML con `html2pdf.js` y lo guarda en formato A4                                                  |
| **Templates**                  | Conjunto de transformaciones XSLT y estilos CSS que definen la apariencia del PDF.     |

---

## Código de barras PDF417

* Se obtiene del nodo `<TED>` dentro del XML.
* Se genera un **canvas** usando la librería [`pdf417-generator`](https://www.npmjs.com/package/pdf417-generator).
* El canvas se convierte en `data:image/png;base64,...` y se agrega en la plantilla.


