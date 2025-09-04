import { useEffect, useMemo, useRef } from "react";
import { Card, ScrollArea } from "@mantine/core";
import { useXmlStore } from "../hooks/useXmlStore";
import { parseXml, parseXslt, transformXmlWithXslt } from "../lib/xml";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pdf417 from "pdf417-generator";

const outerXml = (el: Element) => new XMLSerializer().serializeToString(el);

export const PreviewPane = () => {
  const { xmlText, xsltText, cssText, html, setHtml, logoUrl } = useXmlStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const styledHtml = useMemo(() => {
    if (!html) return "";
    const baseFix = `
      .page { background:#fff; }
      body { color:#111827; }
    `;
    const styleTag = `<style>${baseFix}\n${cssText ?? ""}</style>`;
    return styleTag + html;
  }, [html, cssText]);

  useEffect(() => {
    if (!xmlText || !xsltText) return;
    (async () => {
      try {
        const xml = parseXml(xmlText);
        const xslt = parseXslt(xsltText);

        const NS = "http://www.sii.cl/SiiDte";
        const tedEl = xml.getElementsByTagNameNS(NS, "TED")[0];
        let barcodeDataUrl = "";
        if (tedEl) {
          const tedString = outerXml(tedEl);
          console.log("Te", tedString)
          const canvas = document.createElement("canvas");
          pdf417.draw(tedString, canvas, 2, 2);
          barcodeDataUrl = canvas.toDataURL("image/png");
        }

        const effectiveLogo = logoUrl?.trim() || "/logo.png";

        const out = transformXmlWithXslt(xml, xslt, {
          logoUrl: effectiveLogo,
          barcodeDataUrl,
        });
        setHtml(out);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setHtml(`<pre style="color:crimson">${e.message}</pre>`);
      }
    })();
  }, [xmlText, xsltText, logoUrl, setHtml]);

  return (
    <Card withBorder radius="md" p={0}>
      <ScrollArea.Autosize px="md" py="md">
        <div ref={containerRef}>
          <div
            className="preview"
            dangerouslySetInnerHTML={{ __html: styledHtml }}
          />
        </div>
      </ScrollArea.Autosize>
    </Card>
  );
};
