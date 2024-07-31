import React, { useMemo, useCallback } from "react";
import PropTypes from 'prop-types';
import Done from '@mui/icons-material/Done';

import TextStd from '../text_std/TextStd.jsx';

/*
* A basic checkbox element.

* Props:
    > prText: the chechbox's text.
    > prIsChecked: whether the checkbox is checked.
    > prOnPress: the function to call when the checkbox is pressed/toggled.
    > prMonospaceFont: whether to use a monospace font.
    > prStyle: the style of the checkbox's container.
    > prStyleBox: the style of the box.
    > prStyleText: the style of the text.
    > prTheme: An object with the following properties:
        * backgroundColor: the colour of the background.
        * borderColor: the border colour.
        * checkBoxActive: the colour of the box when it's selected.
        * checkBoxInactive: the colour of the box when it hasn't been selected.
        * fontColor: the colour of the font.
*/
function CheckBoxStd({ prText, prIsChecked, prIsActive, prUseOverlayInactive, prOnPress, prStyles, prTheme })
{
    const lOnPress = useCallback(
        () =>
        {
            if (!prIsActive)
                return;

            prOnPress();
        },
        [ prIsActive, prOnPress ]
    );

    const lStyleCon = useMemo(
        () =>
        {
            return {
                ...styles.conOuter, 
                backgroundColor: (prIsActive || prUseOverlayInactive) ? prTheme.background : prTheme.backgroundInactive, 
                border: `1px solid ${prIsActive ? prTheme.border : prTheme.borderInactive}`, 
                ...prStyles?.con, 
            };
        },
        [ prStyles, prTheme, prIsActive, prUseOverlayInactive ]
    );

    const lStyleBox = useMemo(
        () =>
        {
            let lBackground = "";
            if (prIsActive || prUseOverlayInactive) 
                lBackground = prIsChecked ? prTheme.backgroundBoxSel : prTheme.backgroundBoxUnsel;
            else
                lBackground = prIsChecked ? prTheme.backgroundBoxSelInactive : prTheme.backgroundBoxUnselInactive ;

            return { 
                ...styles.check, 
                backgroundColor: lBackground, 
                border: `1px solid ${(prIsActive || prUseOverlayInactive) ? prTheme.border : prTheme.borderInactive}`,
                ...prStyles?.box 
            };
        },
        [ prStyles, prTheme, prIsActive, prIsChecked, prUseOverlayInactive ]
    );

    const lStyleText = useMemo(
        () =>
        {
            return { 
                color: prIsActive ? prTheme.font : prTheme.fontInactive,  
                ...prStyles?.text 
            };
        },
        [ prStyles, prTheme, prIsActive ]
    );

    const lStyleCheck = useMemo(
        () =>
        {
            return { 
                color: prIsActive ? prTheme.fontCheck : prTheme.fontCheckInactive, 
                fontSize: "1.5em", 
                ...prStyles?.check 
            };
        },
        [ prStyles, prTheme, prIsActive ]
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
            style = { lStyleCon } 
            onClick = { lOnPress }
        >

            <div style = { lStyleOverlayInactive }></div>

            <div className = "hideScrollBar" style = { styles.conText }>
                <TextStd 
                    prText = { prText } prIsBold = { true }
                    prStyle = { lStyleText } 
                />
            </div>

            <div 
                style = { lStyleBox }
            >
                {
                    prIsChecked && (
                        <Done 
                            sx = { lStyleCheck }
                        />
                    )
                }
            </div>

        </div>
    );
}

CheckBoxStd.propTypes =
{
    prText: PropTypes.string.isRequired,
    prIsChecked: PropTypes.bool.isRequired,
    prIsActive: PropTypes.bool,
    prUseOverlayInactive: PropTypes.bool,
    prOnPress: PropTypes.func.isRequired,
    prStyles: PropTypes.shape(
        {
            con: PropTypes.object,
            text: PropTypes.object,
            box: PropTypes.object,
            check: PropTypes.object
        }
    ),
    prTheme: PropTypes.shape(
        {
            background: PropTypes.string.isRequired,
            border: PropTypes.string.isRequired,
            font: PropTypes.string.isRequired,
            fontCheck: PropTypes.string.isRequired,
            backgroundBoxSel: PropTypes.string.isRequired,
            backgroundBoxUnsel: PropTypes.string.isRequired,

            backgroundInactive: PropTypes.string.isRequired,
            borderInactive: PropTypes.string.isRequired,
            fontInactive: PropTypes.string.isRequired,
            fontCheckInactive: PropTypes.string.isRequired,
            backgroundBoxSelInactive: PropTypes.string.isRequired,
            backgroundBoxUnselInactive: PropTypes.string.isRequired,

            overlayInactive: PropTypes.string.isRequired,
        }
    )
};

CheckBoxStd.defaultProps =
{
    prIsActive: true,
    prUseOverlayInactive: false,
    prTheme:
    {
        background: "#000000",
        border: "#FAFAFA",
        font: "#ffffff",
        fontCheck: "#000000",
        backgroundBoxSel: "#FFFFFF",
        backgroundBoxUnsel: "#000000",

        backgroundInactive: "#353535",
        borderInactive: "#B4B4B4",
        fontInactive: "#B4B4B4",
        fontCheckInactive: "#B4B4B4",
        backgroundBoxSelInactive: "#353535",
        backgroundBoxUnselInactive: "#353535",

        overlayInactive: "#35353567"
    },
    overlayInactive:
    {
        position: "absolute",
        width: "100%",
        height: "100%",
    }
}

const styles =
{
    conOuter:
    {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.5em",
        // paddingTop: 0.4 * globalProps.fontSizeBase,
        // paddingBottom: 0.4 * globalProps.fontSizeBase,
        // paddingLeft: 0.75 * globalProps.fontSizeBase,
        // paddingRight: 0.75 * globalProps.fontSizeBase,
        borderRadius: "0.5em",
        position: "relative",
        overflow: "hidden"
    },

    conText:
    {
        marginRight: "1em",
        overflowX: "scroll"
    },

    check:
    {
        flexShrink: 0,
        width: "1.5em",
        height: "1.5em", //2.3 * globalProps.fontSizeBase,

        borderRadius: "0.5em",
        alignItems: "center",
        justifyContent: "center"
    },

    overlayInactive:
    {
        position: "absolute", left: 0, top: 0,
        width: "100%",
        height: "100%",
    }
};

export default CheckBoxStd;