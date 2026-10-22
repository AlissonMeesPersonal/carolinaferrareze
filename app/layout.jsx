import './globals.css';
export const metadata = {
  metadataBase: new URL('https://carolinaferrareze.vercel.app'),
  title: 'Carolina Ferrareze | Atendimentos e mentorias',
  description: 'Conheça os atendimentos e mentorias de Carolina Ferrareze e entre em contato.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Carolina Ferrareze | Atendimentos e mentorias',
    description: 'Conheça o acompanhamento terapêutico e as mentorias da Carolina Ferrareze.',
    url: 'https://carolinaferrareze.vercel.app',
    siteName: 'Carolina Ferrareze',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({children}) {
 return <html lang="pt-BR"><body>{children}</body></html>;
}
