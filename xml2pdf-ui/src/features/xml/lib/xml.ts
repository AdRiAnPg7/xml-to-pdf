export function parseXml(text: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "application/xml");
  const parsererror = doc.getElementsByTagName("parsererror")[0];
  if (parsererror)
    throw new Error(parsererror.textContent || "XML parse error");
  return doc;
}

export function parseXslt(text: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "application/xml");
  const parsererror = doc.getElementsByTagName("parsererror")[0];
  if (parsererror)
    throw new Error("XSLT parse error: " + (parsererror.textContent || ""));
  return doc;
}

export const transformXmlWithXslt = (
  xmlDoc: Document,
  xsltDoc: Document,
  params?: Record<string, string>
): string => {
  const proc = new XSLTProcessor();
  proc.importStylesheet(xsltDoc);

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      proc.setParameter(null, k, v);
    }
  }

  const result = proc.transformToDocument(xmlDoc);
  const html =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (result as any).documentElement?.outerHTML ??
    new XMLSerializer().serializeToString(result);
  return html;
};
