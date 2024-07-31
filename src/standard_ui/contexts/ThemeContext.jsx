import React, { createContext, useContext, useState } from 'react';
import utils from '../utils';


const ThemeContext = createContext();

/*
* A localStorage key whose value is a string that corresponding to the app's current theme.
*/
const gLclStrgKeyThemeName = "themeName";


function ThemeProvider({ children }) 
{
    /* The name of the current theme. */
    const [ stThemeName, setThemeName ] = useState("dark"); // utils.getFromLocalStorage(gLclStrgKeyThemeName, ""

    /**
    * Updates stThemeName.

    * Parameters:
        @param pThemeName - The name of the theme that will be set.
    */
    const updateTheme = (pThemeName) =>
    {
        if (!pThemeName)
        {
            console.log("No theme name provided!");
            return;
        }

        setThemeName(pThemeName);

        // Locally store the new theme's name.
        utils.setInLocalStorage(gLclStrgKeyThemeName, pThemeName);
    };

    return (
        <ThemeContext.Provider 
            value = {{ 
                themeName: stThemeName, updateTheme 
            }}
        >
            { children }
        </ThemeContext.Provider>
    );
}

function useTheme() 
{
    return useContext(ThemeContext);
}


export { ThemeProvider as default, useTheme };