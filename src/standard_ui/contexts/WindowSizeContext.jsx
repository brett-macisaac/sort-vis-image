import React, { createContext, useContext, useState, useEffect } from 'react';
import utils from '../utils';


const WindowSizeContext = createContext();


function WindowSizeProvider({ children }) 
{
    /* The dimensions/size of the window. */
    const [ stWindowSize, setWindowSize ] = useState({ width: window.innerWidth, height: window.innerHeight });

    /**
    * Updates stWindowSize.
    */
    const updateWindowSize = () =>
    {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight, isLandscape: window.innerWidth > window.innerHeight });
    };

    /*
    * Setup the event listener to update stWindowSize whenever the window size changes.
    */
    useEffect(
        () =>
        {
            // Initialise window size.
            updateWindowSize();

            // Set-up an event-listener for window resize.
            window.addEventListener('resize', utils.debounce(updateWindowSize, 200));

            return () =>
            {
                // Remove event listener.
                window.removeEventListener('resize', utils.debounce(updateWindowSize, 200));
            }
        },
        []
    );

    return (
        <WindowSizeContext.Provider 
            value = { stWindowSize }
        >
            { children }
        </WindowSizeContext.Provider>
    );
}

function useWindowSize() 
{
    return useContext(WindowSizeContext);
}


export { WindowSizeProvider as default, useWindowSize };