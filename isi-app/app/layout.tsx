import '@coinbase/onchainkit/styles.css';
import type { Metadata } from 'next';
import './globals.css';
import OnchainProviders from './providers';

export const metadata: Metadata = {
  title: 'Isi: Discover your next experience',
  description: 'Isi AI will get to know you and then recommend and buy the best experiences for you.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background dark">
        <OnchainProviders>{children}</OnchainProviders>
      </body>
    </html>
  );
}
