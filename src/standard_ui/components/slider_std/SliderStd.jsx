import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import PropTypes from 'prop-types';

import TextStd from "../text_std/TextStd";

import "./SliderStd.css";

function SliderStd({ prMin, prMax, prValue, prStep, prOnChange, prLabel, prWidth, prHeight, prIsVertical, 
                     prIsVerticalTopDown, prShowValue, prShowLabel, prShowStickyValue,  prMinAllowed, prMaxAllowed, 
                     prStyles, prTheme, prIsActive, prUseOverlayInactive, prOverlayInactiveJustProgress })
{
    /* 
    * The length of the progress-bar, expressed as a number between 0 and 100, which represents its proportion of the 
      overall track.
    */
    const [ stSliderRange, setSliderRange ] = useState(prValue);

    /* Whether the first render has occurred. */
    const [ stFirstRenderDone, setFirstRenderDone ] = useState(false);

    /* 
    * Whether the invisible sticky value label has been 'pushed' outside of the progress bar due to the progress bar 
      being smaller than it.
    */
    const [ stLblValueStickyInvisNegOffset, setLblValueStickyNegOffset ] = useState(false);

    /* A reference of the input range element. */
    const rfSlider = useRef(undefined);

    /* 
    * A reference of the invisible 'sticky value' element.
    * The positioning of the sticky-value element is dynamic: i.e. it's either absolutely positioned to the track (when 
      the progress bar gets smaller than it) or positioned at the end of the progress bar.
    * To control this dynamic positioning, it's necessary to have an invisible copy of the label that's absolutely 
      positioned to the end of the progress bar. The distance of the left-edge of this invisible copy to the left-edge 
      of the progress bar is monitored: when it's negative, the sticky value is positioned absolutely to the track, and 
      when it's positive it's positioned at the end of the progress bar.
    */
    const rfLblValueStickyInvis = useRef(undefined);

    /*
    * Handler for the input (range) DOM element.
    * This contains the logic that controls the length of the progress bar.
    */
    const lHandleSliderInput = useCallback(
        (pOverrideDisabledFlag = false) =>
        {
            if (!pOverrideDisabledFlag && !prIsActive) 
            {
                return;
            }

            const lRange = prMax - prMin; // -1?

            let lInvertValue = prIsVertical && stFirstRenderDone && prIsVerticalTopDown;

            let lValueCurrent = rfSlider.current.value;

            // The inverted value.
            const lValueInverted = prMax - lValueCurrent + prMin;

            /*
            * When vertical (top-down), use the inverted value due to the vertical input range element scrolling 
            bottom-to-top, not top-to-bottom.
            */
            if (lInvertValue)
                lValueCurrent = lValueInverted;

            // Restrict lValueCurrent to the 'allowed' min and max (if they exist).
            if (prMinAllowed)
                lValueCurrent = Math.max(lValueCurrent, prMinAllowed);
            if (prMaxAllowed)
                lValueCurrent = Math.min(lValueCurrent, prMaxAllowed);

            const lDistance = lValueCurrent - prMin;

            const lPercentage = (lDistance / lRange) * 100;

            setSliderRange(lPercentage);
            prOnChange(lValueCurrent);
        },
        [ 
            prOnChange, prIsActive, prMax, prMin, prIsVertical, prIsVerticalTopDown, prMinAllowed, prMaxAllowed, 
            stFirstRenderDone 
        ]
    );

    /*
    * Initialise the custom aspects of the component.
    * lHandleSliderInput initialises setSliderRange to the correct value, which then triggers a useEffect that 
      initiliases stLblValueStickyInvisNegOffset
    */
    useEffect(
        () =>
        {
            console.log("Hello!")
            lHandleSliderInput(true);
            //console.log("Initialise");
        },
        [ rfSlider ]
    );

    /*
    * Record that the first render has been completed.
    * This is important for when prIsVertical and prIsVerticalTopDown are both set. Due to the DOM's input (range) 
      element not supporting a vertical alignment with the slider moving from the top to the bottom, the value must be
      inverted to give the desired effect. However, the effect shouldn't occur on the first render, otherwise the 
      lHandleSliderInput function will invert the initial value.
    */
    useEffect(
        () =>
        {
            setFirstRenderDone(true);
        },
        []
    );

    /*
    * Logic for controlling the value of stLblValueStickyInvisNegOffset, which determines how the sticky value is 
      positioned.
    */
    useEffect(
        () =>
        {
            if (!rfLblValueStickyInvis.current)
                return;

            // Determine if the invisible value label has been pushed outside of the progress bar (i.e. if the offset is negative).
            if (isNegativeOffset(rfLblValueStickyInvis, prIsVertical, prIsVerticalTopDown)) // <= -1
            {
                setLblValueStickyNegOffset(
                    (prev) =>
                    {
                        if (!prev) // If we have yet to detect a negative offset. 
                            return true;
                        else // If we have already detected a negative offset. 
                            return prev;
                    }
                );
            }
            else
            {
                setLblValueStickyNegOffset(
                    (prev) =>
                    {
                        if (prev) // If we have yet to detect a positive offset. 
                            return false;
                        else // If we have already detected a positive offset. 
                            return prev;
                    }
                );
            }
        },
        [ stSliderRange ]
    );

    const lDimensions = useMemo(
        () =>
        {
             // The component's dimensions.
             let lWidth, lHeight;

             // Set lWidth and lHeight, as dependent on prWidth, prHeight, and prIsVertical.
             if (prIsVertical)
             {
                 lWidth = prWidth === undefined ? 40 : prWidth;
                 lHeight = prHeight === undefined ? "100%" : prHeight;
             }
             else
             {
                 lWidth = prWidth === undefined ? "100%" : prWidth;
                 lHeight = prHeight === undefined ? 40 : prHeight;
             }

             return { width: lWidth, height: lHeight }
        },
        [ prIsVertical, prWidth, prHeight ]
    );

    const lStyleCon = useMemo(
        () =>
        {
            return {
                ...styles.con,
                border: `1px solid ${prIsActive ? prTheme.borderCon : prTheme.borderConInactive}`, 
                ...prStyles?.con, 
                width: lDimensions?.width, 
                height: lDimensions?.height
            }
        },
        [ prStyles, prTheme, lDimensions ]
    );

    const lStyleProgressBar = useMemo(
        () =>
        {
            let lBorderColor = prIsActive ? prTheme.borderProgress : prTheme.borderProgressInactive;

            return { 
                backgroundColor: prIsActive || prUseOverlayInactive ? prTheme.backgroundProgress : prTheme.backgroundProgressInactive, 
                borderBottom: (prIsVertical && prIsVerticalTopDown) ? `1px solid ${lBorderColor}` : undefined,
                borderTop: (prIsVertical && !prIsVerticalTopDown) ? `1px solid ${lBorderColor}` : undefined,
                borderRight: (!prIsVertical) ? `1px solid ${lBorderColor}` : undefined,
                ...prStyles?.progress,
                width: prIsVertical ? lDimensions.width : `${stSliderRange}%`,
                height: prIsVertical ? `${stSliderRange}%` : lDimensions.height,
            }
        },
        [ prStyles, prTheme, prIsVertical, prIsVerticalTopDown, lDimensions, stSliderRange, prIsActive, prUseOverlayInactive ]
    );

    const lStyleTrack = useMemo(
        () =>
        {
            return { backgroundColor: prTheme.backgroundTrack, ...prStyles?.track }
        },
        [ prStyles, prTheme ]
    );

    const lStyleText = useMemo(
        () =>
        {
            return { color: prIsActive ? prTheme.font : prTheme.fontInactive, ...prStyles?.text }
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

    // The classes for the label and value labels.
    let lClassNameLblLabel = prIsVertical ? "label lblV" : "label lblH lblLabelH";
    let lClassNameLblValue = prIsVertical ? "label lblV" : "label lblH lblValueH";

    // Add additional classes dependending on the value of prIsVerticalTopDown.
    if (prIsVertical)
    {
        lClassNameLblLabel += prIsVerticalTopDown ? " lblLabelVtTopDown" : " lblLabelVtBottomUp"
        lClassNameLblValue += prIsVerticalTopDown ? " lblValueVtTopDown" : " lblValueVtBottomUp";
    }

    return (
        <div 
            className = "conSliderStd" 
            style = { lStyleCon }
        >

            {/* The DOM element on which the slider is based. */}
            <input 
                type = "range" ref = { rfSlider } className = { prIsVertical ? "sliderStd sliderStdV" : "sliderStd" }
                min = { prMin } max = { prMax } step = { prStep }
                value = { prValue }
                onInput = { lHandleSliderInput }
                orient = { prIsVertical ? "vertical" : "horizontal" } // FireFox-specific
                disabled = { !prIsActive }
            />

            {/* The progress bar. */}
            <div 
                className = { 
                    prIsVertical ? 
                        prIsVerticalTopDown ? 
                            "sliderStdProgress sliderStdProgressVtTopDown" : "sliderStdProgress sliderStdProgressVtBottomUp" : 
                        "sliderStdProgress sliderStdProgressH" 
                }
                style = { lStyleProgressBar }
            >
                {/* The sticky value label. */}
                {
                    (prShowStickyValue) && (
                        <TextStd 
                            prText = { prValue } prIsBold
                            prIsVertical = { prIsVertical }
                            prClassName = { 
                                getClassNameLblValueSticky(!stLblValueStickyInvisNegOffset, prIsVertical, prIsVerticalTopDown)
                            }
                            prStyle = { lStyleText }
                        />
                    )
                }

                {/* The invisible sticky value label (used to position the sticky value label). */}
                {
                    (prShowStickyValue) && (
                        <TextStd 
                            prRef = { rfLblValueStickyInvis }
                            prText = { prValue } prIsBold
                            prIsVertical = { prIsVertical }
                            prClassName = { getClassNameLblValueStickyInvis(prIsVertical, prIsVerticalTopDown) }
                            prStyle = { lStyleText }
                        />
                    )
                }

                {
                    (prOverlayInactiveJustProgress) && (
                        <div style = { lStyleOverlayInactive }></div>
                    )
                }

            </div>

            {/* The slider's track/background. */}
            <div className = "sliderStdBackground" style = { lStyleTrack }></div>

            {/* The label that displays the slider's value. */}
            {
                (prShowValue && !prShowStickyValue) && (
                    <TextStd 
                        prText = { prValue } prIsBold
                        prIsVertical = { prIsVertical }
                        prClassName = { lClassNameLblValue }
                        prStyle = { lStyleText }
                    />
                )
            }

            {/* The label that displays the slider's label. */}
            {
                (prShowLabel && !prShowStickyValue) && (
                    <TextStd 
                        prText = { prLabel } prIsBold
                        prIsVertical = { prIsVertical }
                        prClassName = { lClassNameLblLabel }
                        prStyle = { lStyleText }
                    />
                )
            }

            {
                (!prOverlayInactiveJustProgress) && (
                    <div style = { lStyleOverlayInactive }></div>
                )
            }

        </div>
    );
}

SliderStd.propTypes = 
{
    prMin: PropTypes.number.isRequired, 
    prMax: PropTypes.number.isRequired, 
    prValue: PropTypes.number.isRequired,
    prStep: PropTypes.number.isRequired, 
    prOnChange: PropTypes.func.isRequired,
    prLabel: PropTypes.string, 
    prWidth: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    prHeight: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    prIsVertical: PropTypes.bool,
    prIsVerticalTopDown: PropTypes.bool,
    prShowValue: PropTypes.bool,
    prShowLabel: PropTypes.bool,
    prShowStickyValue: PropTypes.bool,
    prMinAllowed: PropTypes.number,
    prMaxAllowed: PropTypes.number,
    prStyles: PropTypes.shape(
        {
            con: PropTypes.object,
            track: PropTypes.object,
            progress: PropTypes.object,
            text: PropTypes.object,
        }
    ),
    prTheme: PropTypes.shape(
        {
            borderCon: PropTypes.string.isRequired,
            backgroundProgress: PropTypes.string.isRequired,
            borderProgress: PropTypes.string.isRequired,
            font: PropTypes.string.isRequired,
            backgroundTrack: PropTypes.string.isRequired,

            borderConInactive: PropTypes.string.isRequired,
            backgroundProgressInactive: PropTypes.string.isRequired,
            borderProgressInactive: PropTypes.string.isRequired,
            fontInactive: PropTypes.string.isRequired,
            backgroundTrackInactive: PropTypes.string.isRequired,

            overlayInactive: PropTypes.string.isRequired,
        }
    ),
    prIsActive: PropTypes.bool,
    prUseOverlayInactive: PropTypes.bool,
    prOverlayInactiveJustProgress: PropTypes.bool,
};

SliderStd.defaultProps = 
{
    prLabel: "", 
    prIsVertical: false,
    prIsVerticalTopDown: true,
    prShowValue: true,
    prShowLabel: true,
    prShowStickyValue: false,
    prStyles: {  },
    prTheme:
    {
        borderCon: "#FAFAFA",
        backgroundProgress: "#000000",
        borderProgress: "#FAFAFA",
        font: "#ffffff",
        backgroundTrack: "transparent",

        borderConInactive: "#8B8B8B",
        backgroundProgressInactive: "#383737",
        borderProgressInactive: "#8B8B8B",
        fontInactive: "#8B8B8B",
        backgroundTrackInactive: "transparent",

        overlayInactive: "#15151567"
    },
    prIsActive: true,
    prUseOverlayInactive: false,
    prOverlayInactiveJustProgress: false
}

const styles = 
{
    con:
    {
        position: "relative",
        overflow: "hidden"
    },
    overlayInactive:
    {
        position: "absolute", left: 0, top: 0,
        width: "100%",
        height: "100%",
    }
};

/**
* Determines the classes of the sticky value label.

* Parameters:
    * @param {boolean} pIsActive - Whether the sticky value label should stick to the end of the progress bar.
    * @param {boolean} pIsVertical - Whether the slider is vertical.
    * @param {boolean} pIsVerticalTopDown - Whether the slider is a 'top-down' vertical slider.

* @returns {string} A string which contains the space-separated classes of the sticky value label.
*/
function getClassNameLblValueSticky(pIsActive, pIsVertical, pIsVerticalTopDown)
{
    let lClassName = "lblValueSticky";

    lClassName +=  pIsVertical ? " lblValueStickyVt" : " lblValueStickyHz";

    if (!pIsActive)
    {
        lClassName += " lblValueStickyInActive"

        if (pIsVertical)
            lClassName += pIsVerticalTopDown ? " lblValueStickyInActiveVtTd" : " lblValueStickyInActiveVtBu";
        else
            lClassName += " lblValueStickyInActiveHz";
    }

    return lClassName;
}

/**
* Determines the classes of the invisible sticky value label.

* Parameters:
    * @param {*} pIsVertical - Whether the slider is vertical.
    * @param {*} pIsVerticalTopDown - Whether the slider is a 'top-down' vertical slider.

* @returns {string} A string which contains the space-separated classes of the invisible sticky value label.
*/
function getClassNameLblValueStickyInvis(pIsVertical, pIsVerticalTopDown)
{
    let lClassName = "lblValueSticky lblValueStickyInvis";

    if (pIsVertical)
        lClassName += pIsVerticalTopDown ? " lblValueStickyVt lblValueStickyInvisVtTd" : " lblValueStickyVt lblValueStickyInvisVtBu";
    else
        lClassName += " lblValueStickyHz lblValueStickyInvisHz";

    return lClassName;
}

/**
* This function determines whether the invisible sticky value label has been pushed outside of its parent: i.e. whether
  its relevant offset is negative.

* Parameters:
    * @param {*} pRfLblValueStickyInvis - A reference to the invisible sticky value label.
    * @param {*} prIsVertical - Whether the slider is vertical.
    * @param {*} prIsVerticalTopDown - Whether the slider is a 'top-down' vertical slider.

* @returns {boolean} Whether the invisible sticky value label has been pushed outside of its parent (i.e. the progress
  bar), which is significed by a negative offset in a specific direction.
*/
function isNegativeOffset(pRfLblValueStickyInvis, prIsVertical, prIsVerticalTopDown)
{
    let lOffset;

    if (prIsVertical)
    {
        if (prIsVerticalTopDown)
        {
            lOffset = pRfLblValueStickyInvis.current.offsetTop;
        }
        else
        {
            // As there's no offsetBottom property, it must be calculated manually.
            lOffset = pRfLblValueStickyInvis.current.offsetParent.offsetHeight - 
                      (pRfLblValueStickyInvis.current.offsetTop + pRfLblValueStickyInvis.current.offsetHeight);
        }
    }
    else
    {
        lOffset = pRfLblValueStickyInvis.current.offsetLeft;
    }

    // Log the offset for testing.
    //console.log(lOffset);

    return lOffset <= 0;
}

/**
* A customisable slider component.

* Props:
    * @param {number} prMin - The minimum value of the slider.
    * @param {number} prMax - The maximum value of the slider.
    * @param {number} prValue - The value of the slider.
    * @param {number} prStep - The value by which the slider steps.
    * @param {func} prOnChange - A function that accepts one argument (i.e. the updated value).
    * @param {boolean} prDisabled - Whether the slider is disabled. When disabled, the value cannot be changed.
    * @param {number} prLabel - The slider's label.
    * @param {number} prWidth - The slider's width.
    * @param {number} prHeight - The slider's height.
    * @param {boolean} prIsVertical - Whether the slider is vertical.
    * @param {boolean} prIsVerticalTopDown - Whether a vertical slider (i.e. prIsVertical is true) slides from the top 
      down (i.e has its highest value at the bottom). If prIsVertical is false, this prop has no effect.
    * @param {boolean} prShowValue - Whether the value is displayed on the slider.
    * @param {boolean} prShowLabel - Whether the label is displayed on the slider.
    * @param {boolean} prShowStickyValue - Whether the 'sticky value' is displayed on the slider. The sticky value, as 
      the name suggests, 'sticks' to the end of the progress bar. When this prop is true, the values of prShowValue and
      prShowLabel are ignored (i.e. there values don't matter, only the sticky value is shown).
    * @param {number} prMinAllowed - The minimum 'allowed' value. The slider cannot go beyond this value, even if prMin
      is less that it.
    * @param {number} prMaxAllowed - The maximum 'allowed' value. The slider cannot go beyond this value, even if prMax
      is greater than it.
    * @param {object} prStyles - An object in which to include styling objects for the outermost container (.con), the 
      track (.track), the progress bar (.progress), and the text (.text)

* References:
    * https://www.youtube.com/watch?v=SGKLKiEt_UE. The logic of the slider's custom UI was based on the component 
      created in this video.
*/
export default React.memo(SliderStd);