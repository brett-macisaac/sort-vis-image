import React from "react";
import PropTypes from 'prop-types';
import ChevronRight from '@mui/icons-material/ChevronRight';
import LinkStd from "../link_std/LinkStd";

import TextStd from '../text_std/TextStd';

/*
* A button component intended to be displayed within the content of a page and, when pressed, navigate to another page.

* Props:
    > prIcon: a function that returns a vector icon (such as from @mui/icons-material). Give this function a parameter 
              list of (size, colour) to use either the themed colour from prTheme or prIconColor (if prIconColor has 
              been set) and the value of prIconSize.
    > prText: the text that is displayed on the button.
    > prIsBold: whether the text is bold.
    > prIconBackgroundColor: the backgroundColor of the icon. If not set, the color from prTheme is used.
    > prIconColor: the colour of the icons (i.e. both the left and right icon).
    > prIconSize: the size of the icons (i.e. both the left and right icon).
    > prOnPress: the function that is called when the button is pressed.
    > prStyle: the style of the component's container.
    > prStyleText: the style of the text within the container. The TextStandard component is used here, so refer to that
                 component's code for information regarding how styling is applied.
    > prTheme: An object with the following properties:
        * backgroundColor: the colour of the button's background.
        * borderColor: the colour of the button's borders.
        * fontColor: the colour of the button's text.
        * icon: the colour of the two icons.
        * iconBackgroundColor: the background colour of the left icon.
*/
function ButtonNextPageStd({ prIcon, prText, prIsBold, prIconBackgroundColor, prIconSize, prIconColor,
                             prDestination, prStyle, prStyleText, prTheme })
{
    return (
        <LinkStd
            prDestination = { prDestination }
            prStyle = {{ 
                backgroundColor: prTheme.background,
                borderColor: prTheme.border,
                ...styles.container, 
                ...prStyle,
            }}
        >
            <div style = { styles.conTextAndIcon }>

                <div 
                    style = {{
                        backgroundColor: prIconBackgroundColor ? prIconBackgroundColor : prTheme.iconBackgroundColor 
                    }}
                >
                    { prIcon(prIconSize, prIconColor ? prIconColor : prTheme.icon) }
                </div>

                {/* The button's text. */}
                {
                    prText && (
                        <TextStd 
                            prText = { prText } 
                            prIsBold = { prIsBold } 
                            prStyle = {{ 
                                color: prTheme.font, textAlign: "center", marginLeft: "1em", ...prStyleText, 
                            }}
                        />
                    )
                }
            </div>

            <ChevronRight 
                sx = {{ color: prIconColor ? prIconColor : prTheme.icon, fontSize: prIconSize }}
            />
        </LinkStd>
    );
}

ButtonNextPageStd.propTypes =
{
    prIcon: PropTypes.node,
    prText: PropTypes.string.isRequired,
    prIsBold: PropTypes.bool,
    prIconBackgroundColor: PropTypes.string,
    prIconSize: PropTypes.number,
    prIconColor: PropTypes.string,
    prOnPress: PropTypes.func,
    prStyle: PropTypes.object,
    prStyleText: PropTypes.object,
    prTheme: PropTypes.shape(
        {
            background: PropTypes.string,
            border: PropTypes.string,
            font: PropTypes.string,
            icon: PropTypes.string,
            iconBackgroundColor: PropTypes.string
        }
    )
};

ButtonNextPageStd.defaultProps =
{
    prSizeText: 0,
    prIsBold: false,
    prIconSize: 35,
    prStyle: {},
    prStyleText: {},
    prTheme: 
    {
        backgroundColor: "#000000",
        borderColor: "#FAFAFA",
        fontColor: "#FFFFFF",
        icon: "#FAFAFA",
        iconBackgroundColor: "transparent"
    },
}

const styles = 
{
    container:
    {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 10,
        width: "100%",
        maxWidth: 700,
        padding: "1em"
    },
    conTextAndIcon: 
    {
        alignItems: "center",
        flexDirection: "row"
    }
};

export default ButtonNextPageStd;