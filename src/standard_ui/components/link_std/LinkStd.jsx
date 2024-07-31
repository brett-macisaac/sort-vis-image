import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import TextStandard from '../text_std/TextStd';

/*
* A customisable button component which links to another page.

* Props:
    > children: the child components.
    > prIcon: a component such as a vector image from a library like @mui/icons-material.
    > prText: the text that is displayed on the button.
    > prIsBold: whether the text is bold.
    > prDestination: the name of the page the user will be sent to when they click it.
    > prStyle: the style of the component's container.
    > prStyleText: the style of the text within the container. The TextStandard component is used here, so refer to that
      component's code for information regarding how styling is applied.
    > prTheme: An object with the following properties:
        * backgroundColor: the colour of the button's background.
        * borderColor: the colour of the button's borders.
        * fontColor: the colour of the button's text.
*/
function LinkStd({ children, prIcon, prText, prIsBold, prDestination, prStyle, prStyleText, prTheme })
{
    return (
        <Link
            to = { `${prDestination}` }
            style = {{ 
                backgroundColor: prTheme?.background,
                borderColor: prTheme?.border,
                ...styles.button, 
                ...prStyle 
            }}
        >
            {/* The button's icon. If present, the icon is placed above text. */}
            { prIcon }

            {/* The button's text. */}
            {
                prText && (
                    <TextStandard 
                        prText = { prText } 
                        prIsBold = { prIsBold } 
                        prStyle = {{ 
                            ...styles.textButton, color: prTheme?.font, ...prStyleText
                        }}
                    />
                )
            }

            {/* Any child elements. */}
            { children }

        </Link>
    );
}

LinkStd.propTypes =
{
    children: PropTypes.node,
    prIcon: PropTypes.node,
    prText: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]),
    prIsBold: PropTypes.bool,
    prDestination: PropTypes.string,
    prStyle: PropTypes.object,
    prStyleText: PropTypes.object,
    prTheme: PropTypes.shape(
        {
            background: PropTypes.string.isRequired,
            border: PropTypes.string.isRequired,
            font: PropTypes.string.isRequired
        }
    )
};

LinkStd.defaultProps =
{
    prIsBold: false,
    prTheme: 
    {
        backgroundColor: "#000000",
        borderColor: "#FAFAFA",
        fontColor: "#FFFFFF"
    }
};

const styles =
{
    button:
    {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "1em",
        padding: 10
    },
    textButton:
    {
        textAlign: "center" 
    }
};

export default LinkStd;