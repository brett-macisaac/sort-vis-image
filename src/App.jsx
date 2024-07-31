import { useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Sort from './pages/sort/Sort.jsx';
import { ThemeProvider } from "./standard_ui/standard_ui.js";
import { WindowSizeProvider } from "./standard_ui/standard_ui.js";

function App() 
{

    return (
        <ThemeProvider>
        <WindowSizeProvider>

            <Router>
                <Routes>
                    <Route
                        path = { "/" }
                        element = { <Sort /> }
                    />
                </Routes>
            </Router>

        </WindowSizeProvider>
        </ThemeProvider>
    );
}

export default App
