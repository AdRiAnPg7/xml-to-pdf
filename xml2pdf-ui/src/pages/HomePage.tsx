import { Link } from "react-router-dom";
import { Button } from "@mantine/core";

export function HomePage() {
  return (
    <div className="text-center">
      <h1>XML 2 PDF</h1>

      <p>
        Comienza en el <b>Designer</b> para pegar tu XML y aplicar tu plantilla
      </p>
      <Button
        component={Link}
        to="/designer"
        size="md"
        radius="md"
        color="cyan"
      >
        Ir al Designer
      </Button>
    </div>
  );
}
