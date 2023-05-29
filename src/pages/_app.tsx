import "@/styles/globals.css";
import "@/styles/style.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import LayoutPage from "@/components/layout/Layout";
import { Provider } from "@/store/Provider";

export default function App({ Component, pageProps, ...appProps }: AppProps) {
  if (
    [`/`].includes(appProps.router.pathname) ||
    [`/forgetPassword`].includes(appProps.router.pathname)
  )
    return (
      <Provider>
        <Component {...pageProps} />
      </Provider>
    );
  return (
    <Provider>
      <LayoutPage>
        <Component {...pageProps} />
      </LayoutPage>
    </Provider>
  );
}
