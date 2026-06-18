import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { MainNavigation } from "@/components/navigation/main-navigation";

export const metadata: Metadata = {
  title: {
    default: "BAD115-2016",
    template: "%s · BAD115-2016"
  },
  description: "Web educativa y documental sobre Base de Datos para BAD115-2016.",
  openGraph: {
    title: "BAD115-2016",
    description: "Documentacion, unidades, temas, ejemplos SQL y referencias de Base de Datos.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <Theme appearance="light" accentColor="orange" grayColor="slate" panelBackground="translucent" radius="large">
          <div className="site-shell">
            <MainNavigation />
            {children}
            <Footer />
          </div>
        </Theme>
      </body>
    </html>
  );
}
