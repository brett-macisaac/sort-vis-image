import React, { useState, useMemo, useCallback } from "react";
import PropTypes from 'prop-types';

import TextStandard from '../text_std/TextStd';

function ButtonStd({ children, prIcon, prText, prIsBold, prOnPress, prOnSinglePress, prDoubleClick, prIsOnDown, 
                     prItemOnPress, prIsActive, prUseOverlayInactive, prStyles, prBorderWidth, 
                     prIsBorderDisabled, prTheme, prRef })
{
    const [ stPressTimes, setPressTimes ] = useState([ 0, 0, 0 ]);

    const [ stIndexPressPrevious, setIndexPressPrevious ] = useState(0);

    /*
    * The function that handles press events.
    * It implements all of the press logic, which depends on the following props:
        > prOnPress
        > prOnSinglePress
        > prDoubleClick
        > prIsOnDown
    */
    const lHandlePress = useCallback(
        () => 
        {
            if (!prIsActive)
                return;

            if (!prDoubleClick)
            {
                if (prOnPress)
                    prOnPress(prItemOnPress);
                return;
            }

            const lTimeCurrent = new Date().getTime();

            const lIndexPress = stPressTimes.indexOf(0);

            console.log(lIndexPress);

            if (lIndexPress != 0)
            {
                const lTimeBetweenPresses = lTimeCurrent - stPressTimes[lIndexPress - 1];

                if (lTimeBetweenPresses <= 1500)
                {
                    if (prOnPress)
                        prOnPress(prItemOnPress);

                    setPressTimes([ 0, 0, 0 ]);
                }
                else
                {
                    setPressTimes(prev => { return [ prev[0], lTimeCurrent, 0 ] });

                    if (prOnSinglePress && lTimeBetweenPresses <= 6000 && stIndexPressPrevious == 0)
                    {
                        prOnSinglePress(prItemOnPress);
                    }
                }
            }
            else
            {
                setPressTimes([ lTimeCurrent, 0, 0 ]);
            }

            setIndexPressPrevious(lIndexPress);
        },
        [ prOnPress, prOnSinglePress, prDoubleClick, prIsActive, prItemOnPress ]
    );

    // Determine the particular event to listen for.
    let lPressFunction = useMemo(
        () =>
        {
            let lPressFunctions = { };

            if (prIsOnDown)
            {
                /*
                * React has made the onTouchStart event passive, meaning preventDefault cannot be used to prevent the 
                onMouseDown event from firing. Therefore, they both can't be used simulataneously as in the prototype.
                */

                // Whether the device has a touch-screen.
                const lIsTouchDevice = 'ontouchstart' in window;

                if (lIsTouchDevice)
                {
                    lPressFunctions.onTouchStart = lHandlePress;
                }
                else
                {
                    lPressFunctions.onMouseDown = lHandlePress;
                }
            }
            else
            {
                lPressFunctions.onClick = lHandlePress;
            }

            return lPressFunctions;
        },
        [ prIsOnDown, lHandlePress ]
    );

    const lStyleCon = useMemo(
        () =>
        {
            let lColorBorder;
            if (prIsBorderDisabled)
                lColorBorder = "transparent";
            else 
                lColorBorder = prIsActive ? prTheme?.border : prTheme?.borderInactive;

            return {
                ...styles.button,
                backgroundColor: prIsActive || prUseOverlayInactive ? prTheme?.background : prTheme?.backgroundInactive,
                border: `${prBorderWidth}px solid ${lColorBorder}`,
                ...prStyles?.con
            };
        },
        [ prStyles, prTheme, prIsActive, prIsBorderDisabled, prBorderWidth ]
    );

    const lStyleText = useMemo(
        () =>
        {
            return {
                ...styles.textButton, 
                color: prIsActive || prUseOverlayInactive ? prTheme?.font : prTheme?.fontInactive, 
                ...prStyles?.text
            };
        },
        [ prStyles, prTheme, prIsActive, prUseOverlayInactive ]
    );

    const lStyleOverlayInactive = useMemo(
        () =>
        {
            return {
                ...styles.overlayInactive, 
                backgroundColor: prTheme?.overlayInactive, 
                display: !prIsActive && prUseOverlayInactive ? "block" : "none"
            };
        },
        [ prTheme, prIsActive, prUseOverlayInactive ]
    );

    return (
        <div
            { ...lPressFunction }
            style = { lStyleCon }
            ref = { prRef }
        >

            <div style = { lStyleOverlayInactive }></div>

            {/* The button's icon. If present, the icon is placed above text. */}
            { prIcon }

            {/* The button's text. */}
            {
                prText && (
                    <TextStandard 
                        prText = { prText } 
                        prIsBold = { prIsBold } 
                        prStyle = { lStyleText }
                    />
                )
            }

            {/* Any child elements. */}
            { children }

        </div>
    );
}

ButtonStd.propTypes =
{
    children: PropTypes.node,
    prIcon: PropTypes.node,
    prText: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]),
    prIsBold: PropTypes.bool,
    prOnPress: PropTypes.func,
    prOnSinglePress: PropTypes.func,
    prDoubleClick: PropTypes.bool,
    prIsOnDown: PropTypes.bool,
    prItemOnPress: PropTypes.any,
    prIsActive: PropTypes.bool,
    prUseOverlayInactive: PropTypes.bool,
    prStyles: PropTypes.shape(
        {
            con: PropTypes.object,
            text: PropTypes.object,
        }
    ),
    prBorderWidth: PropTypes.number,
    prIsBorderDisabled: PropTypes.bool,
    prTheme: PropTypes.shape(
        {
            background: PropTypes.string.isRequired,
            border: PropTypes.string.isRequired,
            font: PropTypes.string.isRequired
        }
    ),
    prRef: PropTypes.oneOfType([
        PropTypes.func, 
        PropTypes.shape({ current: PropTypes.any })
    ])
};

ButtonStd.defaultProps =
{
    prIsBold: false,
    prDoubleClick: false,
    prIsOnDown: false,
    prIsActive: true,
    prUseOverlayInactive: false,
    prTheme: 
    {
        background: "#000000",
        border: "#FAFAFA",
        font: "#FFFFFF",
        backgroundInactive: "#353535",
        borderInactive: "#FAFAFA",
        fontInactive: "#B4B4B4",
        overlayInactive: "#35353567"
    },
    prBorderWidth: 1,
    prIsBorderDisabled: true
};

const styles =
{
    button:
    {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "1em",
        padding: 10,
        position: "relative",
        overflow: "hidden"
    },
    textButton:
    {
        textAlign: "center" 
    },
    overlayInactive:
    {
        position: "absolute", left: 0, top: 0,
        width: "100%",
        height: "100%",
    }
};

/**
* A customisable button component.

* Props:
    @param {object} prIcon - A component such as a vector image from a library like \@mui/icons-material.
    @param {string} prText - The text that is displayed on the button.
    > prIsBold: whether the text is bold.
    > prOnPress: the function that is called when the button is pressed.
    > prOnSinglePress: when the doubleClick prop is set to true, this function is called if the user doesn't execute a 
      'double-click': i.e. when they press once but don't press again within the allocated time.
    > prDoubleClick: whether a 'double click' is required to activate the button's onPress.
    > prIsOnDown: whether the onPress function should be called immediately when the user presses it, or if it should only
      be called once the user has released their finger/mouse.
    > prStyle: the style of the component's container.
    > prStyleText: the style of the text within the container. The TextStandard component is used here, so refer to that
      component's code for information regarding how styling is applied.
    > prTheme: An object with the following properties:
        * backgroundColor: the colour of the button's background.
        * borderColor: the colour of the button's borders.
        * fontColor: the colour of the button's text.
*/
export default React.memo(ButtonStd);