import type { Metadata } from "next";
import "./globals.css";
import Provider from "./components/Provider";
import NavBar from "./components/NavBar";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Trace",
  description: "Logistics",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Provider>
          <NavBar />
          {/* <div className="max-container">{children}</div> */}
          {children}
        </Provider>
      </body>
    </html>
  );
}
