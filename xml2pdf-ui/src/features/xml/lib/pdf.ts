// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import html2pdf from "html2pdf.js";

export const downloadPdfFromHtmlElement = async (
  el: HTMLElement,
  filename: string
) => {
  const opt = {
    margin: 0,
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: [] },
  } as const;

  await html2pdf().set(opt).from(el).save();
};
