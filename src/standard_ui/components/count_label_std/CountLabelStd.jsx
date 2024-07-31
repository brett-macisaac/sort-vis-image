import React from "react";
import PropTypes from 'prop-types';

import TextStd from '../text_std/TextStd.jsx';

/*
* A component that displays a number with an associated label.

* Props:
    > prText: the text associated with the number (prCount).
    > prCount: the number to display.
    > prStyle: the style of the outer container.
    > prStyleText: the style of the text (i.e. text on the left).
    > prStyleValue: the style of the value (i.e. text on the right).
    > prTheme: An object with the following properties:
        * backgroundColor: the colour of the background.
        * borderColor: the colour of the borders.
        * fontColor: the colour of the label's text.
        * fontColorValue: the colour of the label's value.
        * backgroundColorValue: the background colour of the label's value.
        * borderLeftColorValue: the left border colour of the label's value.
*/
function CountLabelStd({ prText, prCount, prStyles, prTheme })
{
    return (
        <div 
            style = {{ 
                ...styles.conOuter, backgroundColor: prTheme.background, borderColor: prTheme.border, 
                ...prStyles?.con
            }}
        >

            <div className = "hideScrollBar" style = {{ ...styles.conLabel, ...prStyles?.label }}>
                <TextStd prText = { prText } prIsBold />
            </div>

            <div 
                style = {{ 
                    ...styles.conCount, backgroundColor: prTheme.backgroundValue, 
                    borderLeftColor: prTheme.borderLeftColorValue, ...prStyles?.count,
                }}
            >
                <TextStd prText = { prCount } prIsBold />
            </div>

        </div>
    );
}

CountLabelStd.propTypes =
{
    prText: PropTypes.string.isRequired,
    prCount: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]).isRequired,
    prSize: PropTypes.number,
    prStyles: PropTypes.shape(
        {
            con: PropTypes.object,
            label: PropTypes.object,
            count: PropTypes.object,
        }
    ),
    prTheme: PropTypes.shape(
        {
            background: PropTypes.string.isRequired,
            border: PropTypes.string.isRequired,
            font: PropTypes.string.isRequired,
            fontColorValue: PropTypes.string.isRequired,
            backgroundColorValue: PropTypes.string.isRequired,
            borderLeftColorValue: PropTypes.string.isRequired,
        }
    )
};

CountLabelStd.defaultProps =
{
    prSize: 0,
    prTheme:
    {
        backgroundColor: "#000000",
        borderColor: "#FAFAFA",
        fontColor: "#ffffff",
        fontColorValue: "#ffffff",
        backgroundColorValue: "#000000",
        borderLeftColorValue: "#FAFAFA",
    },
}

const styles =
{
    conOuter:
    {
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "space-between",
        // width: "100%",
        border: "1px solid",
        // columnGap: "1em",
        // padding: "0.5em",
        // borderRadius: 1000,
        overflow: "hidden"
    },

    conLabel:
    {
        marginRight: "1em",
        padding: "0.5em",
        overflowX: "scroll"
    },

    conCount:
    {
        alignItems: "center",
        justifyContent: "center",
        borderLeft: "1px solid",
        flexShrink: 0,
        paddingTop: "0.5em", paddingBottom: "0.5em",
        paddingRight: "0.5em", paddingLeft: "0.5em",  
        minWidth: "3em",
    },

};

export default CountLabelStd;