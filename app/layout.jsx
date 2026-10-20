import './globals.css';
export const metadata = {
  title: 'Carolina Ferrareze | Atendimentos e mentorias',
  description: 'Conheça os atendimentos e mentorias de Carolina Ferrareze e entre em contato.',
  robots: { index: true, follow: true },
};
export default function RootLayout({children}) {
 return <html lang="pt-BR"><body>{children}</body></html>;
}
