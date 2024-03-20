import "./globals.css";
import { dm_sans, dm_mono } from "./ui/fonts";
import Background from "./ui/home/Background";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${dm_sans} ${dm_mono} overflow-hidden`}>
        <Background>
          {children}
        </Background>
      </body>
    </html>
  );
}
