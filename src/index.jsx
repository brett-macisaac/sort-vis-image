import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

import './standard_ui/standard_ui.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

/*
* Service Worker to allow offline use.
*/
if ("serviceWorker" in navigator) 
{
    registerSW(
        { 
            /*
            * Configure automatic page reload.
            * Without this, the app will use the old code/assets, rather than reloading the app with the newly received 
              data from the server.
            * See documentation for more details: https://vite-pwa-org.netlify.app/guide/auto-update.html.
            */
            immediate: true 
        }
    );
}