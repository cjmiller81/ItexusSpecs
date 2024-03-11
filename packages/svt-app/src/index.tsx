import './polyfills';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import './index.css';
import App from './App';
import IvlAutomatedApp from './IvlAutomatedApp';
import reportWebVitals from './reportWebVitals';

async function enableMocking() {
  if (process.env.REACT_APP_MOCK_BACKEND_API !== 'true') {
    return;
  }

  const { worker } = await import('./mocks/browserApiServices');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.

  // TODO: This doesn't work. Just comment out the `.env`'s `PUBLIC_URL` variable.
  // @see: https://mswjs.io/docs/recipes/custom-worker-script-location#custom-worker-location
  /*
  return worker.start({
    serviceWorker: {
      // This is useful if your application follows
      // a strict directory structure.
      url: `${process.env.PUBLIC_URL}/mockServiceWorker.js`,
    },
  });
  */

  return worker.start();
}

enableMocking().then(() => {
  try {
    const appRootElement = document.getElementById('root') as HTMLElement;

    if (appRootElement) {
      const root = ReactDOM.createRoot(appRootElement);
      root.render(
        <React.StrictMode>
          <StyledEngineProvider injectFirst>
            <App />
          </StyledEngineProvider>
        </React.StrictMode>
      );
    }
  }
  catch (rootErr) {
    console.log(rootErr);
  }

  try {
    const appIvlAutomatedRootElement = document.getElementById('ivl-automated-root') as HTMLElement;

    if (appIvlAutomatedRootElement) {
      const ivlAutomatedRoot = ReactDOM.createRoot(appIvlAutomatedRootElement);
      ivlAutomatedRoot.render(
        <React.StrictMode>
          <StyledEngineProvider injectFirst>
            <IvlAutomatedApp />
          </StyledEngineProvider>
        </React.StrictMode>
      );
    }
  }
  catch (ivlAutomatedRootErr) {
    console.log(ivlAutomatedRootErr);
  }

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
});
