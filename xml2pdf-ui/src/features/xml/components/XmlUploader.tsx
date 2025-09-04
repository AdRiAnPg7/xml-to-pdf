import { useState } from "react";
import {
  Stack,
  Textarea,
  FileInput,
  Group,
  Button,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useXmlStore } from "../hooks/useXmlStore";
import { readFileAsText } from "../lib/encoding";

export const XmlUploader = () => {
  const { xmlText, setXml, logoUrl, setLogoUrl } = useXmlStore();
  const [file, setFile] = useState<File | null>(null);

  const loadFromFile = async () => {
    if (!file) return;
    const raw = await readFileAsText(file, "utf-8");
    const isLatin = /encoding\s*=\s*"ISO-8859-1"/i.test(raw);
    const text = isLatin ? await readFileAsText(file, "latin1") : raw;
    setXml(text);
  };

  return (
    <Stack gap="sm">
      <Group grow align="end">
        <FileInput
          label="Archivo XML"
          placeholder="Selecciona un XML"
          value={file}
          onChange={setFile}
          accept=".xml"
        />
        <Button onClick={loadFromFile}>Cargar</Button>
      </Group>

      <Textarea
        label="XML (pegar/editar)"
        autosize
        maxRows={10}
        minRows={6}
        value={xmlText}
        onChange={(e) => setXml(e.currentTarget.value)}
        styles={{
          input: {
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          },
        }}
      />

      <Tooltip label="Se inyecta a la plantilla como parámetro XSLT 'logoUrl'">
        <TextInput
          label="Logo URL"
          placeholder="/logo.png"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.currentTarget.value)}
        />
      </Tooltip>
    </Stack>
  );
};
