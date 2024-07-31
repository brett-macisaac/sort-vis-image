import React, { useMemo, useEffect } from "react";
import PropTypes from 'prop-types';

import { Element } from "../pages/sort/Elements";

function ElementView({ prKey, prElement, prLengthOuter, prLengthOuterStatic,  prLengthInnerStatic, prIsColumn, 
                       prIsLastElement, prTheme, prUpdater })
{
    const lStyleOuter = useMemo(
        () =>
        {;
            if (prIsColumn)
            {
                return { 
                    height: `${prLengthOuter}%`, width: prLengthOuterStatic, 
                    borderLeft: `1px solid ${prTheme?.border}`, justifyContent: "end"
                };
            }
            else
            {
                return { 
                    width: `${prLengthOuter}%`, height: prLengthOuterStatic, 
                    borderTop: `1px solid ${prTheme?.border}`, justifyContent: "start", flexDirection: "row"
                };
            }
        },
        [ prLengthOuter, prLengthOuterStatic, prTheme ]
    );

    const lStyleInner = useMemo(
        () =>
        {
            let lStyleBorders = { };

            if (prIsColumn)
            {
                lStyleBorders = {
                    border: `1px solid ${prTheme?.border}`,
                    borderRight: `1px solid ${prTheme?.border}`,
                    borderLeft: "none"
                };
            }
            else
            {
                lStyleBorders ={
                    border: `1px solid ${prTheme?.border}`,
                    borderBottom: `1px solid ${prTheme?.border}`,
                    borderTop: "none"
                };
            }

            if (!prIsLastElement)
            {
                if (prIsColumn)
                    lStyleBorders.borderRight = "none";
                else
                    lStyleBorders.borderBottom = "none"; 
            }

            let lLengthInner = `${100.0 * (prElement.value / prLengthOuter)}%`;

            let lBackground = prTheme.background;
            if (prElement.state == Element.State.Compared)
                lBackground = prTheme.backgroundComp;
            else if (prElement.state == Element.State.Swapped)
                lBackground = prTheme.backgroundSwap;
            else if (prElement.state == Element.State.Set)
                lBackground = prTheme.backgroundSet;

            if (prIsColumn)
            {
                return {
                    height: lLengthInner, width: prLengthInnerStatic, 
                    backgroundColor: lBackground,
                    ...lStyleBorders,
                };
            }
            else
            {
                return {
                    height: prLengthInnerStatic, width: lLengthInner,
                    backgroundColor: lBackground,
                    ...lStyleBorders,
                };
            }

        },
        [ prIsColumn, prElement, prLengthOuter, prLengthInnerStatic, prIsLastElement, prTheme ]
    );

    return (
        <div  
            style = { lStyleOuter }
        >
            <div
                style = { lStyleInner }
            >
            </div>
        </div>
    );
}

ElementView.propTypes =
{
    prElement: PropTypes.instanceOf(Element),
    prLengthOuter: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]),
    prLengthOuterStatic: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]),
    prLengthInnerStatic: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]),
    prIsColumn: PropTypes.bool,
    prIsLastElement: PropTypes.bool,
    prTheme: PropTypes.shape(
        {
            background: PropTypes.string.isRequired,
            border: PropTypes.string.isRequired,
        }
    )
};

ElementView.defaultProps =
{
    prTheme: 
    {
        background: "#000000",
        backgroundComp: "#FF5900",
        backgroundSwap: "#FF0000",
        backgroundSet: "#FF0000",
        border: "#000000"
    }
};

/**
* An element that represents 

* Props:
    @param {object} prIcon - A component such as a vector image from a library like \@mui/icons-material.
    @param {string} prText - The text that is displayed on the button.
*/
export default React.memo(ElementView);
// export default ElementView;