import React, { useMemo } from "react";
import PropTypes from 'prop-types';

import ClipLoader from "react-spinners/ClipLoader";

/**
* A View that covers 100% of its parent's width and height, displaying a loading icon in its centre, with optional 
  transparency.

* Props:
    @param { bool } prIsActive - Whether it is displayed.
    @param { bool } prIsTranslucent - Whether the background is translucent.
    @param { number } prSizeIcon - The size of the load icon.
    @param { object } prTheme - The component's theme.
*/
function LoadAreaStd({ prIsActive, prIsTranslucent, prSizeIcon, prTheme })
{
    const lStyleCon = useMemo(
        () =>
        {
            return {
                ...styles.con, 
                backgroundColor: prIsTranslucent ? prTheme.backgroundTranslucent : prTheme.background,
                display: prIsActive ? undefined : "none"
            };
        },
        [ prIsActive, prIsTranslucent, prTheme ]
    );

    return (
        <div style = { lStyleCon }>
            <ClipLoader
                color = { prTheme.loadIcon }
                loading = { prIsActive }
                size = { prSizeIcon }
            />
        </div>
    );
}

LoadAreaStd.propTypes =
{
    prIsActive: PropTypes.bool,
    prIsTranslucent: PropTypes.bool,
    prSizeIcon: PropTypes.number,
    prTheme: PropTypes.shape(
        {
            background: PropTypes.string.isRequired,
            backgroundTranslucent: PropTypes.string.isRequired,
            loadIcon: PropTypes.string.isRequired,
        }
    )
};

LoadAreaStd.defaultProps =
{
    prIsActive: false,
    prIsTranslucent: false,
    prSizeIcon: 50,
    prTheme:
    {
        background: "#272727",
        backgroundTranslucent: "#00000099",
        loadIcon: "#FAFAFA",
    },
}

const styles =
{
    con:
    {
        position: "absolute", 
        width: '100%', height: '100%', 
        justifyContent: 'center', alignItems: 'center', 
        zIndex: 100
    },
};

export default LoadAreaStd;