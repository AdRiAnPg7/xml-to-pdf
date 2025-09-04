import { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Textarea,
  Group,
  Button,
  FileInput,
  Select,
} from "@mantine/core";
import { useXmlStore } from "../hooks/useXmlStore";
import { readFileAsText } from "../lib/encoding";
import { TEMPLATES } from "../templates/constants";

export const TemplatePicker = () => {
  const { xsltText, cssText, setXslt, setCss } = useXmlStore();
  const [xsltFile, setXsltFile] = useState<File | null>(null);
  const [cssFile, setCssFile] = useState<File | null>(null);
  const [tplId, setTplId] = useState<string>("classic");

  const TPL_OPTIONS = useMemo(
    () => TEMPLATES.map((t) => ({ value: t.id, label: t.name })),
    []
  );

  useEffect(() => {
    const tpl = TEMPLATES.find((t) => t.id === tplId) ?? TEMPLATES[0];
    setXslt(tpl.xslt);
    setCss(tpl.css);
  }, [tplId, setXslt, setCss]);

  const loadXslt = async () => {
    if (!xsltFile) return;
    const t = await readFileAsText(xsltFile, "utf-8");
    setXslt(t);
  };
  const loadCss = async () => {
    if (!cssFile) return;
    const t = await readFileAsText(cssFile, "utf-8");
    setCss(t);
  };

  return (
    <Stack gap="sm">
      <Select
        label="Plantilla"
        placeholder="Selecciona"
        value={tplId}
        onChange={(v) => v && setTplId(v)}
        data={TPL_OPTIONS}
        allowDeselect={false}
        comboboxProps={{ withinPortal: true, zIndex: 400 }}
        nothingFoundMessage="Sin opciones"
      />

      <Group grow align="end">
        <FileInput
          label="Archivo XSLT"
          placeholder="Selecciona .xslt"
          value={xsltFile}
          onChange={setXsltFile}
          accept=".xslt,.xsl,.xml"
        />
        <Button onClick={loadXslt}>Cargar XSLT</Button>
      </Group>

      <Textarea
        label="XSLT"
        autosize
        minRows={6}
        maxRows={10}
        value={xsltText}
        onChange={(e) => setXslt(e.currentTarget.value)}
        styles={{
          input: {
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          },
        }}
      />

      <Group grow align="end">
        <FileInput
          label="Archivo CSS"
          placeholder="Selecciona .css"
          value={cssFile}
          onChange={setCssFile}
          accept=".css"
        />
        <Button onClick={loadCss}>Cargar CSS</Button>
      </Group>

      <Textarea
        label="CSS"
        autosize
        minRows={6}
        maxRows={10}
        value={cssText}
        onChange={(e) => setCss(e.currentTarget.value)}
        styles={{
          input: {
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          },
        }}
      />
    </Stack>
  );
};
