import "./global.css";
import "@devvoted/components/dist/index.css";
import "primereact/resources/themes/md-light-indigo/theme.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Welcome to devvoted",
  description: "Generated by create-nx-workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}