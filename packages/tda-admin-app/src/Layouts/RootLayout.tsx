import ThemeCustomization from "@/themes";
import { OryAuthGateway } from "components";
import Snackbar from "components/@extended/Snackbar";
import Locales from "components/Locales";
import RTLLayout from "components/RTLLayout";
import ScrollTop from "components/ScrollTop";
import Notistack from "components/third-party/Notistack";
import { AppProps } from "next/app";
import { PersistGate } from "redux-persist/integration/react";
import { appPersistor } from "../libs/redux/Store";
import { StoreProvider } from "../providers/StoreProvider";
import Layout from "./Layout";
import { ConfigProvider } from "contexts/ConfigContext";
import { ToastifyLayout } from "../../../components/src/layouts/ToastifyLayout";

export interface IRootProps extends AppProps {
  children: any;
}

export default function RootLayout({ children }: IRootProps) {
  return (
    <OryAuthGateway
      changePasswordRoute={
        typeof window !== "undefined" ? `${window.location.origin}/profile/security?requireChangePassword=true` : ""
      }>
      <StoreProvider>
        <PersistGate
          loading={null}
          persistor={appPersistor}>
          <ConfigProvider>
            <ThemeCustomization>
              <RTLLayout>
                <Locales>
                  <ScrollTop>
                    <ToastifyLayout>
                      <Notistack>
                        <Snackbar />
                        <Layout>{children}</Layout>
                      </Notistack>
                    </ToastifyLayout>
                  </ScrollTop>
                </Locales>
              </RTLLayout>
            </ThemeCustomization>
          </ConfigProvider>
        </PersistGate>
      </StoreProvider>
    </OryAuthGateway>
  );
}
