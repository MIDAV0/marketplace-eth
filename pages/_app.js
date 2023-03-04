import '@styles/globals.css'

export default function App({ Component, pageProps }) {
  const Layout = Component.Layout

  return (
    <Layout>
        <Component {...pageProps} />
    </Layout>
  )
}
