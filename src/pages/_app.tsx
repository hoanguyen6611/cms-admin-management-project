import "@/styles/globals.css";
import "@/styles/style.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import LayoutPage from "@/components/layout/layout/Layout";

export default function App({ Component, pageProps, ...appProps }: AppProps) {
  if ([`/login`].includes(appProps.router.pathname))
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  return (
    <Provider store={store}>
      <LayoutPage>
        <Component {...pageProps} />
      </LayoutPage>
    </Provider>
  );
}
