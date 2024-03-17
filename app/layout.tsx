import "./globals.css";
import { dm_sans, dm_mono } from "./ui/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${dm_sans} ${dm_mono} overflow-hidden`}>{children}</body>
    </html>
  );
}
