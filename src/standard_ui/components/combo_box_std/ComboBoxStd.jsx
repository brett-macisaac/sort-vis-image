import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ChevronRight from "@mui/icons-material/ChevronRight";
import ChevronLeft from "@mui/icons-material/ChevronLeft";

import TextStd from '../text_std/TextStd';

import "./ComboBoxStd.css";

/*
* A customisable button component.

* Props:
    > prTextPlaceholder: the placeholder text
    > prItems: an array of the items that can be selected.
    > prItemSelected: the index of the selected item (negative or greater than max for unselected).
    > prOnPress: the function that is called when the a new selected is made.
    > prMaxLengthItemBox: the maximum size of the drop-down container before scrolling occurs. Doesn't work for 
      horizontal combo-boxes (i.e. when prDirection is 'l' or 'r'); instead, this prop acts as a fixed width.
    > prStyles: 
    > prTheme: An object with the following properties:
        * backgroundColor: the colour of the button's background.
        * borderColor: the colour of the button's borders.
        * fontColor: the colour of the button's text.
*/
function ComboBoxStd({ prTextPlaceholder, prItems, prIndexSelected, prOnPress, prDirection, prLength, prMaxLengthItemBox, 
                       prIconSize, prStyles, prTheme, prHideScrollBar, prIsActive, prUseOverlayInactive })
{
    const [ stShowItems, setShowItems ] = useState(false);

    useEffect(
        () =>
        {
            if (!prIsActive && stShowItems)
            {
                setShowItems(false);
            }
        },
        [ prIsActive ]
    );

    const lOnPress = useCallback(
        () =>
        {
            if (!prIsActive)
                return;

            setShowItems(prev => { return !prev; });
        },
        [ prIsActive ]
    );

    const lOnPressItem = useCallback(
        (pIndexItem) =>
        {
            prOnPress(pIndexItem);
        }
    );

    const lNoSelection = useMemo(
        () =>
        {
            return prIndexSelected < 0 || prIndexSelected >= prItems.length;
        },
        [ prIndexSelected, prItems ]
    );

    // Whether the items are displayed vertically (i.e. the items 'drop down' vertically).
    const lIsVertical = useMemo(
        () =>
        {
            return prDirection == 'u' || prDirection == 'd';
        },
        [ prDirection ]
    );

    let lClassesConItems = "conCmbBoxItems";
    let lClassesCon = "conCmbBox";

    if (prHideScrollBar)
        lClassesConItems += " hideScrollBar";

    if (lIsVertical)
    {
        lClassesCon += " conCmbBoxVertical";

        lClassesConItems += " conCmbBoxItemsVertical";

        if (prDirection == 'd')
            lClassesConItems += " conCmbBoxItemsDown";
        else
            lClassesConItems += " conCmbBoxItemsUp";
    }
    else
    {
        lClassesCon += " conCmbBoxHorizontal";

        lClassesConItems += " conCmbBoxItemsHorizontal";

        if (prDirection == 'l')
            lClassesConItems += " conCmbBoxItemsLeft";
        else
            lClassesConItems += " conCmbBoxItemsRight";
    }

    const lStyleCon = useMemo(
        () =>
        {
            // Whether the items are displayed vertically (i.e. the items 'drop down' vertically).
            // let lIsVertical = prDirection == 'u' || prDirection == 'd';

            const lStyle = {
                flexDirection: lIsVertical ? "row" : "column", 
                border: `1px solid ${prIsActive ? prTheme?.border : prTheme?.borderInactive}`, 
                color: prTheme?.font,
                backgroundColor: prIsActive || prUseOverlayInactive ? prTheme?.background : prTheme?.backgroundInactive,
                // overflow: "hidden"
            };

            if (lIsVertical)
                lStyle.width = prLength;
            else
                lStyle.height = prLength;

            return {
                ...lStyle,
                ...prStyles?.con
            };
        },
        [ prStyles, prTheme, prDirection, prLength, lIsVertical, prIsActive, prUseOverlayInactive ]
    );

    const lStyleConItems = useMemo(
        () =>
        {
            // Whether the items are displayed vertically (i.e. the items 'drop down' vertically).
            // let lIsVertical = prDirection == 'u' || prDirection == 'd';

            const lStyle = {
                backgroundColor: prTheme?.backgroundItems, 
                flexDirection: lIsVertical ? "column" : "row", 
            };

            if (lIsVertical)
            {
                // For some reason 'width: 100%' in CSS doesn't include the parents' borders, so this is necessary for now.
                lStyle.width = prLength;

                lStyle.maxHeight = prMaxLengthItemBox;
            }
            else
            {
                lStyle.height = "100%";//prLength;

                // Should be 'maxWidth' but that isn't working.
                lStyle.width = prMaxLengthItemBox;
            }

            return {
                ...lStyle,
                ...prStyles?.conItems
            };
        },
        [ prStyles, prTheme, prDirection, prMaxLengthItemBox, prLength, lIsVertical ]
    );

    const lStyleConText = useMemo(
        () =>
        {
            let lColor = "";
            if (prIsActive || prUseOverlayInactive)
                lColor = lNoSelection ? prTheme.fontPlaceholder : prTheme.font;
            else
                lColor = lNoSelection ? prTheme.fontPlaceholderInactive : prTheme.fontInactive;

            return {
                color: lColor,
                overflowX: "scroll",
                ...prStyles?.text
            };
        },
        [ prStyles, prTheme, prDirection, prLength, lNoSelection, prIsActive, prUseOverlayInactive ]
    );

    const lStyleConItemsText = useMemo(
        () =>
        {
            return {
                color: prTheme.font,
                borderBottom: lIsVertical ? `1px solid ${prTheme.border}` : undefined,
                borderRight: !lIsVertical ? `1px solid ${prTheme.border}` : undefined,
                ...prStyles?.item
            };
        },
        [ prStyles, prTheme, lIsVertical ]
    );

    const lStyleSpacer = useMemo(
        () =>
        {
            return { 
                backgroundColor: prTheme.backgroundItems
            };
        },
        [ prTheme ]
    );

    const lStyleOverlayInactive = useMemo(
        () =>
        {
            return {
                ...styles.overlayInactive, 
                backgroundColor: prTheme?.overlayInactive, 
                borderRadius: prStyles?.con?.borderRadius,
                display: !prIsActive && prUseOverlayInactive ? "block" : "none"
            };
        },
        [ prStyles, prTheme, prIsActive, prUseOverlayInactive ]
    );

    return (
        <div
            style = { lStyleCon }
            className = { lClassesCon }
            onClick = { lOnPress }
        >

            {/* The text displayed in the main container (either placeholder or selected item). */}
            <TextStd 
                prText = { 
                    (lNoSelection) ? prTextPlaceholder : prItems[prIndexSelected] 
                } 
                prStyle = { lStyleConText }
                prIsBold
                prIsVertical = { !lIsVertical }
                prClassName = "hideScrollBar"
            />

            {/* The show more/less icon */}
            <ComboBoxArrow 
                prDirection = { prDirection }
                prShowItems = { stShowItems && prIsActive }
                prColour = { prIsActive || prUseOverlayInactive ? prTheme.iconArrow : prTheme.iconArrowInactive }
                prIconSize = { prIconSize }
            />

            {/* The list of items. */}
            {
                stShowItems && (
                    <div
                        style = { lStyleConItems }
                        className = { lClassesConItems }
                    >
                        {
                            prItems.map(
                                (item, index) =>
                                {
                                    return (
                                        <TextStd 
                                            key = { index }
                                            prText = { item } 
                                            prStyle = { lStyleConItemsText }
                                            prClassName = { lIsVertical ? "cmbBoxItemVertical" : "cmbBoxItemHorizontal" }
                                            prIsVertical = { !lIsVertical }
                                            prOnPress = { lOnPressItem }
                                            prItemOnPress = { index }
                                        >
                                            {/* This div is used to block any text that overflows. Without it the text 
                                                runs right to the edge, which doesn't look nice. */}
                                            <div 
                                                style = { lStyleSpacer } 
                                                className = { lIsVertical ? "cmbBoxItemSpacerVertical" : "cmbBoxItemSpacerHorizontal" }
                                            >
                                            </div>
                                        </TextStd>
                                    );
                                }
                            )
                        }
                    </div>
                )
            }

            <div style = { lStyleOverlayInactive }></div>

        </div>
    );
}

ComboBoxStd.propTypes =
{
    prTextPlaceholder: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]),
    prDirection: PropTypes.oneOf([ 'u', 'd', 'l', 'r' ]),
    prItems: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.string), PropTypes.arrayOf(PropTypes.number) ]).isRequired,
    prIndexSelected: PropTypes.number.isRequired,
    prOnPress: PropTypes.func.isRequired,
    prLength: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]),
    prMaxLengthItemBox: PropTypes.number,
    prIconSize: PropTypes.number,
    prStyles: PropTypes.shape( 
        {
            con: PropTypes.object,
            conItems: PropTypes.object,
            item: PropTypes.object,
        }
    ),
    prHideScrollBar: PropTypes.bool,
    prTheme: PropTypes.shape(
        {
            background: PropTypes.string.isRequired,
            backgroundItems: PropTypes.string.isRequired,
            border: PropTypes.string.isRequired,
            font: PropTypes.string.isRequired,
            fontPlaceholder: PropTypes.string.isRequired,
            iconArrow: PropTypes.string.isRequired,

            backgroundInactive: PropTypes.string.isRequired,
            borderInactive: PropTypes.string.isRequired,
            fontInactive: PropTypes.string.isRequired,
            fontPlaceholderInactive: PropTypes.string.isRequired,
            iconArrowInactive: PropTypes.string.isRequired,

            overlayInactive: PropTypes.string.isRequired,
        }
    ),
    prIsActive: PropTypes.bool,
    prUseOverlayInactive: PropTypes.bool,
};

ComboBoxStd.defaultProps =
{
    prTextPlaceholder: "Select an option ...",
    prDirection: 'd',
    prIndexSelected: -1,
    prIconSize: 35,
    prLength: 200,
    prMaxLengthItemBox: 200,
    prHideScrollBar: true,
    prTheme: 
    {
        background: "#000000",
        backgroundItems: "#000000",
        border: "#FAFAFA",
        font: "#ffffff",
        fontPlaceholder: "#ffffff",
        iconArrow: "#ffffff",

        backgroundInactive: "#353535",
        borderInactive: "#B4B4B4",
        fontInactive: "#B4B4B4",
        fontPlaceholderInactive: "#B4B4B4",
        iconArrowInactive: "#B4B4B4",

        overlayInactive: "#35353567"
    },
    prIsActive: true,
    prUseOverlayInactive: false,
};

const styles =
{
    overlayInactive:
    {
        position: "absolute", left: 0, top: 0,
        width: "100%",
        height: "100%",
    }
};

function ComboBoxArrow({ prDirection, prShowItems, prIconSize, prColour })
{
    if (prDirection == 'd')
    {
        return prShowItems ? <ExpandLessIcon sx = {{ color: prColour, fontSize: prIconSize }} /> : 
                             <ExpandMoreIcon sx = {{ color: prColour, fontSize: prIconSize }} />;
    }
    else if (prDirection == 'u')
    {
        return prShowItems ? <ExpandMoreIcon sx = {{ color: prColour, fontSize: prIconSize }} /> : 
                             <ExpandLessIcon sx = {{ color: prColour, fontSize: prIconSize }} />;
    }
    else if (prDirection == 'l')
    {
        return prShowItems ? <ChevronRight sx = {{ color: prColour, fontSize: prIconSize }} /> : 
                             <ChevronLeft sx = {{ color: prColour, fontSize: prIconSize }} />;
    }
    else
    {
        return prShowItems ? <ChevronLeft sx = {{ color: prColour, fontSize: prIconSize }} /> : 
                             <ChevronRight sx = {{ color: prColour, fontSize: prIconSize }} />;
    }
}

export default ComboBoxStd;