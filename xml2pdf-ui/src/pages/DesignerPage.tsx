import { Card, Grid, Title, Group, Button, Stack } from "@mantine/core";
import { useXmlStore } from "../features/xml/hooks/useXmlStore";
import { XmlUploader } from "../features/xml/components/XmlUploader";
import { TemplatePicker } from "../features/xml/components/TemplatePicker";
import { PreviewPane } from "../features/xml/components/PreviewPane";
import { downloadPdfFromHtmlElement } from "../features/xml/lib/pdf";

export const DesignerPage = () => {
  const { setCss } = useXmlStore();

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Stack gap="md">
          <Title order={3}>Diseñador</Title>

          <Card withBorder radius="md" p="md">
            <XmlUploader />
          </Card>

          <Card withBorder radius="md" p="md">
            <TemplatePicker />
          </Card>

          <Group justify="space-between">
            <Button
              color="cyan"
              onClick={() => {
                const el = document.querySelector(
                  ".preview .page"
                ) as HTMLElement | null;
                if (el) downloadPdfFromHtmlElement(el, "document.pdf");
              }}
            >
              Exportar a PDF
            </Button>
            <Group>
              <Button variant="light" onClick={() => setCss("")}>
                Limpiar CSS
              </Button>
            </Group>
          </Group>
        </Stack>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <Stack gap="md">
          <Title order={3}>Preview</Title>
          <Card withBorder radius="md" p="md">
            <PreviewPane />
          </Card>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};
