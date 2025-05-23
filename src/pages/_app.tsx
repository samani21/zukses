// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import '../globals.css'; // <- pastikan path ini sesuai

export default function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
