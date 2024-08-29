import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ClerkProvider} from '@clerk/nextjs'
import "./globals.css";
import SessionProviderWrapper from "./SessionProviderWrapper";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";


const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: [
    "300","400","500","600","700","800","900"
  ]
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en">
    //   <body className={montserrat.className}>
    //     
    //       {children}  
    //    
    //   </body>
    // </html>
    <ClerkProvider>
    <html lang="en">
      <body className={montserrat.className}>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
      <ReactQueryProvider>
        <body className={montserrat.className}>{children}</body>
      </ReactQueryProvider>
    </html>
  </ClerkProvider>
  );
}
