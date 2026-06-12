import "../globals.css";
import { Quicksand } from "next/font/google";
import AuthProvider from "@/app/providers/AuthProvider";
import Nav from "@/components/Nav";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
          <Nav />
        </AuthProvider>
      </body>
    </html>
  );
}
