import 'tailwindcss/tailwind.css'

import { AppWrapper } from './_context'

function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  ) 
}

export default MyApp
