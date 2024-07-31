import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import PropTypes from 'prop-types';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import ButtonStd from '../button_std/ButtonStd';

import "./TextInputStd.css";

/*
* The app's text input component.
* This component can be used to enter both single and multi-line input.

* Props:
    > prText: The text to be rendered.
    > prSize: the size of the text. IMPORTANT: this is not fontSize, but rather the 'rank' of the fontSize (see 
      styles.js for more info).
    > prisBold: whether the text is bold.
    > prPlaceholder: the placeholder text (i.e. what is displayed when given an empty string).
    > prMaxLength: the maximum length of the text that can be inputted.
    > prOnChangeText: the function that's called when the user adds/removes text.
    > prSecureTextEntry: determines whether to hide the user's input. When true, the user's text is, by default hidden, 
      but an 'eye' button is rendered that allows the user to toggle this. Note that if multiline is true, this will not
      work.
    > prMultiline: whether the user can enter multiple lines.
    > prMaxHeight: the maximum height of the container before the component scrolls. This may be useful for creating a
      text-based messaging system, whereby the textbox starts at a normal single-line height, but expands to a set 
      maximum as the user enters more lines/characters.
    > prStyle: any additional styling to apply to the TextInput element. Note that fontWeight, fontSize, 
      borderRadius, and borderColor attributes will be overridden.

* Problems:
    > The width doesn't automatically fit.
*/
function TextInputStd({ prText, prIsBold, prIsActive, prUseOverlayInactive, prPlaceholder, prMaxLength, prOnChangeText, 
                        prSecureTextEntry, prMultiline, prMaxHeight, prStyle, prTheme })
{
    // Whether text is visible (only relevant if the secureTextEntry flag has been set to true).
    const [ stIsTextVisible, setIsTextVisible ] = useState(false);

    // A reference to the text-area element (i.e. multi-line text).
    const rfTextArea = useRef(null);

    /*
    * This allows the text-area element to automatically expand in height as the user enters text.
    */
    useEffect(
        () => 
        {
            if (!(rfTextArea.current))
                return;

            // Reset the text-area's height momentarily to get the correct scrollHeight for the textarea.
            rfTextArea.current.style.height = "0px";
            const lScrollHeight = rfTextArea.current.scrollHeight;

            // We then set the height directly, outside of the render loop
            // Trying to set this with state or a ref will product an incorrect value.
            rfTextArea.current.style.height = lScrollHeight + "px";
        }, 
        [rfTextArea, prText]
    );

    const lOnChangeText = useCallback(
        (e) =>
        {
            prOnChangeText(e.target.value)
        },
        [ prOnChangeText ]
    );

    // Whether the hide/unhide icon appears to the right of the text.
    const lIsEyeShown = (prSecureTextEntry && !prMultiline);

    // The text top display.
    const lTextDisplay = (prSecureTextEntry && !stIsTextVisible) ? '*'.repeat(prText.length) : prText;

    const lStyleCon = useMemo(
        () =>
        {
            return {
                ...styles.container,
                backgroundColor: prIsActive || prUseOverlayInactive ? prTheme?.background : prTheme?.backgroundInactive,
                borderColor: prIsActive ? prTheme?.border : prTheme?.borderInactive,
                borderRadius: "1em" / 2,
                paddingTop: prMultiline ? "1em" : 0,
                paddingBottom: prMultiline ? "1em" : 0,
                maxHeight: prMaxHeight,
                color: prIsActive || prUseOverlayInactive ? prTheme?.font : prTheme?.fontInactive,
                fontWeight: prIsBold ? 700 : 'normal', 
                fontSize: "1em",
                ...prStyle,
            };
        },
        [ prTheme, prIsActive, prUseOverlayInactive, prStyle, prIsBold, prMaxHeight, prMultiline ]
    );

    const lStyleInputMulti = useMemo(
        () =>
        {
            return {
                marginLeft: "1em",
                marginRight: lIsEyeShown ? 0 : "1em",
                flex: 1,
                fontSize: "1em",
                color: "inherit",
                ...styles.textElement,
                //textAlignVertical: numLines > 1 ? "top" : "auto"
            }
        },
        [ lIsEyeShown ]
    );

    const lStyleInputSingle = useMemo(
        () =>
        {
            return {
                marginLeft: "1em",
                marginRight: lIsEyeShown ? 0 : "1em",
                height: "3em",
                flex: 1,
                fontSize: "1em",
                color: "inherit",
                ...styles.textElement,
                //textAlignVertical: numLines > 1 ? "top" : "auto"
            }
        },
        [ lIsEyeShown ]
    );

    const lStyleBtnVisibility = useMemo(
        () =>
        {
            return {
                con:
                {
                    ...styles.btnVisibility, 
                    paddingLeft: "1em", 
                    paddingRight: "1em",
                    backgroundColor: prTheme.background
                }
            }
        },
        [ prTheme ]
    );

    const lStyleIconEye = useMemo(
        () =>
        {
            return {
                color: prIsActive || prUseOverlayInactive ? prTheme?.eyeIcon : prTheme?.eyeIconInactive, 
                fontSize: "1.25em"
            }
        },
        [ prTheme, prIsActive, prUseOverlayInactive ]
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
            className = "textInputStandard hideScrollBar"
            style = { lStyleCon }
        >
            {
                (prMultiline) && (
                    <textarea
                        className = "hideScrollBar"
                        maxLength = { prMaxLength }
                        placeholder = { prPlaceholder }
                        value = { lTextDisplay }
                        onChange = { lOnChangeText }
                        rows = { 1 }
                        style = { lStyleInputMulti }
                        ref = { rfTextArea }
                        disabled = { !prIsActive }
                    >
                    </textarea>
                )
            }

            {
                (!prMultiline) && (
                    <input 
                        //type = "text" 
                        //value = { lTextDisplay } 
                        type = { (prSecureTextEntry && !stIsTextVisible) ? "password" : "text" }
                        value = { prText } 
                        maxLength = { prMaxLength }
                        placeholder = { prPlaceholder }
                        onChange = { lOnChangeText }
                        style = { lStyleInputSingle }
                        disabled = { !prIsActive }
                    />
                )
            }

            {
                lIsEyeShown && (
                    <ButtonStd 
                        prIcon = { 
                            stIsTextVisible ? <VisibilityOff sx = { lStyleIconEye } />
                                            : <Visibility sx = { lStyleIconEye } />
                        } 
                        prOnPress = { () => setIsTextVisible(!stIsTextVisible) }
                        prStyles = { lStyleBtnVisibility }
                    />
                )
            }

            <div style = { lStyleOverlayInactive }></div>

        </div>
    );
}

TextInputStd.propTypes =
{
    prText: PropTypes.string.isRequired,
    prIsBold: PropTypes.bool,
    prIsActive: PropTypes.bool,
    prUseOverlayInactive: PropTypes.bool,
    prPlaceholder: PropTypes.string,
    prMaxLength: PropTypes.number,
    prOnChangeText: PropTypes.func,
    prSecureTextEntry: PropTypes.bool,
    prMultiline: PropTypes.bool,
    prMaxHeight: PropTypes.number,
    prStyle: PropTypes.object,
    prTheme: PropTypes.shape(
        {
            background: PropTypes.string.isRequired,
            font: PropTypes.string.isRequired,
            border: PropTypes.string.isRequired,
            eyeIcon: PropTypes.string.isRequired,

            backgroundInactive: PropTypes.string.isRequired,
            fontInactive: PropTypes.string.isRequired,
            borderInactive: PropTypes.string.isRequired,
            eyeIconInactive: PropTypes.string.isRequired,

            overlayInactive: PropTypes.string.isRequired
        }
    )
};

TextInputStd.defaultProps =
{
    prIsBold: false,
    prIsActive: true,
    prUseOverlayInactive: false,
    prPlaceholder: "",
    prMaxLength: undefined,
    prOnChangeText: undefined,
    prSecureTextEntry: false,
    prMultiline: false,
    prMaxHeight: undefined,
    prStyle: {},
    prTheme:
    {
        background: "transparent",
        font: "#FFFFFF",
        border: "#FAFAFA",
        eyeIcon: "#FAFAFA",

        backgroundInactive: "#383737", 
        fontInactive: "#B4B4B4",
        borderInactive: "#B4B4B4",
        eyeIconInactive: "#B4B4B4",

        overlayInactive: "#35353567"
    }
}

const styles =
{
    container:
    {
        border: "1px solid",
        flexDirection: "row",
        justifyContent: "space-between",
        overflowY: "scroll",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden"
    },
    textElement:
    {
        backgroundColor: "transparent",
        border: "none"
    },
    btnVisibility:
    {
        backgroundColor: "transparent",
    },
    overlayInactive:
    {
        position: "absolute", left: 0, top: 0,
        width: "100%",
        height: "100%",
    }
};

export default TextInputStd;