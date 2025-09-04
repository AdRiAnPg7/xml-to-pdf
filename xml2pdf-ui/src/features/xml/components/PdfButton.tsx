import { downloadPdfFromHtmlElement } from "../lib/pdf";

export function PdfButton() {
  return (
    <div className="flex items-center gap-2">
      <button
        className="px-3 py-2 rounded bg-brand-500 text-white hover:bg-brand-700"
        onClick={() => {
          const el = document.querySelector(
            ".preview .page"
          ) as HTMLElement | null;
          if (el) downloadPdfFromHtmlElement(el, "document.pdf");
        }}
      >
        Exportar a PDF
      </button>
    </div>
  );
}
