import React, { useCallback, useMemo } from "react";
import PropTypes from 'prop-types';

/*
* The app's text component.

* Props:
    > prText: The text to be rendered.
    > prIsBold: whether the text is bold.
    > prIsItalic: whether the text is italicised.
    > prStyle: any additional styling to apply to the Text element. Note that fontWeight and fontSize
      attributes will be overridden by the global prStyles.
    > prRemoveLineBreaks: a boolean that, when true, indicates that linebreaks should be removed before rendering the 
      text.
    > prIsVertical: when true, text is displayed vertically.
    > prTheme: An object with the following properties:
        * color: the colour of the text.
*/
function TextStd({ children, prRef, prText, prIsBold, prIsItalic, prStyle, prRemoveLineBreaks, prIsVertical,
                   prClassName, prTheme, prOnPress, prItemOnPress })
{
    if (prRemoveLineBreaks)
    {
        prText = prText.replace(/\r?\n|\r/g, '');
    }

    const lOnPress = useCallback(
        () =>
        {
            if (prOnPress)
                prOnPress(prItemOnPress);
        },
        [ prOnPress, prItemOnPress ]
    );

    const lStyle = useMemo(
        () =>
        {
            return { 
                color: prTheme?.color,
                fontWeight: prIsBold ? 700 : 'normal', 
                fontStyle: prIsItalic ? "italic" : "normal",
                ...prStyle, 
                writingMode: prIsVertical ? "vertical-lr" : "horizontal-tb",
                textOrientation: prIsVertical ? "upright" : "",
                letterSpacing: prIsVertical ? 4 : "normal",
            }
        },
        [ prStyle, prTheme, prIsBold, prIsItalic, prIsVertical ]
    );

    return (
        <div 
            style = { lStyle } 
            className = { "unselectable " + prClassName }
            onClick = { lOnPress }
            ref = { prRef }
        >
            { prText }
            { children }
        </div>
    );
}

TextStd.propTypes =
{
    prText: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]).isRequired,
    prIsBold: PropTypes.bool,
    prIsItalic: PropTypes.bool,
    prStyle: PropTypes.object,
    prRemoveLineBreaks: PropTypes.bool,
    prIsVertical: PropTypes.bool,
    prClassName: PropTypes.string,
    prTheme: PropTypes.shape(
        {
            color: PropTypes.string
        }
    ),
    prOnPress: PropTypes.func,
    prItemOnPress: PropTypes.any,
    prRef: PropTypes.oneOfType([
        PropTypes.func, 
        PropTypes.shape({ current: PropTypes.any })
    ])
};

TextStd.defaultProps =
{
    prIsBold: false,
    prIsItalic: false,
    prStyle: {},
    prRemoveLineBreaks: false,
    prIsVertical: false,
    prClassName: "",
    prTheme:
    {
        color: "#FFFFFF"
    },
}

export default TextStd;