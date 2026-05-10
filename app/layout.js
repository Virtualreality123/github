import "./globals.css";

export const metadata = {
  title: "ECHO – Find Your Doppelganger",
  description: "Upload a photo and discover your historical twin.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
