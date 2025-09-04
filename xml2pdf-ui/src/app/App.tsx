import { Outlet, Link, useLocation } from "react-router-dom";
import {
  AppShell,
  Group,
  Anchor,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { Moon, Sun } from "lucide-react";
import { type ReactElement } from "react";

export const App = () => {
  const { pathname } = useLocation();

  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <AppShell
      header={{ height: 60 }}
      withBorder
      padding="md"
      styles={{ main: { maxWidth: 1800, margin: "0 auto", width: "100%" } }}
    >
      <AppShell.Header>
        <Group justify="space-between" h="100%" px="xl">
          <Group gap="md">
            <Anchor
              component={Link}
              to="/"
              fw={700}
              c="cyan.7"
              underline="never"
            >
              XML 2 PDF
            </Anchor>
            <NavLink to="/designer" active={pathname === "/designer"}>
              Designer
            </NavLink>
            <NavLink to="/preview" active={pathname === "/preview"}>
              Preview
            </NavLink>
          </Group>
          <Group>
            <ActionIcon
              variant="subtle"
              onClick={() => setColorScheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

const NavLink = ({
  to,
  active,
  children,
}: {
  to: string;
  active?: boolean;
  children: ReactElement | string;
}) => (
  <Anchor
    component={Link}
    to={to}
    underline="never"
    c={active ? "cyan.7" : "gray.7"}
    fw={active ? 700 : 500}
  >
    {children}
  </Anchor>
);
