import { create } from "zustand";

type XmlStore = {
  xmlText: string;
  xsltText: string;
  cssText: string;
  html: string;
  logoUrl: string;

  setXml: (v: string) => void;
  setXslt: (v: string) => void;
  setCss: (v: string) => void;
  setHtml: (v: string) => void;
  setLogoUrl: (v: string) => void;
};

export const useXmlStore = create<XmlStore>((set) => ({
  xmlText: "",
  xsltText: "",
  cssText: "",
  html: "",
  logoUrl: "",

  setXml: (v) => set({ xmlText: v }),
  setXslt: (v) => set({ xsltText: v }),
  setCss: (v) => set({ cssText: v }),
  setHtml: (v) => set({ html: v }),
  setLogoUrl: (v) => set({ logoUrl: v }),
}));
