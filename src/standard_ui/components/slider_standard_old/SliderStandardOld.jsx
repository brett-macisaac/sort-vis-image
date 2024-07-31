import React, { useState, useEffect, useRef, useContext } from "react";

import TextStandard from "../text_standard/TextStandard";
import ThemeContext from "../contexts/ThemeContext.js";
import globalProps, { utilsGlobalStyles, globalThemes } from '../styles';
import Slider from '@mui/material/Slider';

import "./SliderStandardOld.css";

// reference: https://www.youtube.com/watch?v=SGKLKiEt_UE.

function SliderStandardOld({ prMin, prMax, prValue, prStep, prLabel })
{
    // Acquire global theme.
    const themeName = useContext(ThemeContext).value;
    let lTheme = globalThemes[themeName];

    const [ stSliderRange, setSliderRange ] = useState(prValue);

    const [ stInputValue, setInputValue ] = useState(prValue);

    const rfSlider = useRef(undefined);

    const handleSliderInput = () =>
    {
        // console.log(rfSlider);

        const lRange = prMax - prMin; // -1?

        const lValueCurrent = rfSlider.current.value;

        const lDistance = lValueCurrent - prMin;

        const lPercentage = (lDistance / lRange) * 100;

        setSliderRange(lPercentage);

        setInputValue(lValueCurrent);
    };

    useEffect(
        () =>
        {
            handleSliderInput();
        },
        [ rfSlider ]
    );

    return (
        <div className = "conSliderOld" style = {{ border: `1px solid ${lTheme.borders}` }}>

            <input 
                type = "range" className = "sliderH" ref = { rfSlider }
                min = { prMin } max = { prMax } step = { prStep }
                value = { stInputValue }
                onInput = { handleSliderInput }
            />

            {/* <div className = "sliderThumb" style = {{ left: `calc(${stSliderRange}% - 0.5em)` }}></div> */}
            
            <div className = "progressHold" style = {{ width: `${stSliderRange}%`, backgroundColor: lTheme.header, borderRight: `1px solid ${lTheme.borders}` }}></div>

            <TextStandard 
                prText = { prLabel } prIsBold
                prStyle = {{ ...styles.lblLabel }} // borderRight: `1px solid ${lTheme.borders}`, backgroundColor: `${lTheme.content}77`
            />

            <TextStandard 
                prText = { stInputValue } prIsBold
                prStyle = {{ ...styles.lblValue }} // borderLeft: `1px solid ${lTheme.borders}`, backgroundColor: `${lTheme.content}77`
            />

        </div>
    );
}

const styles = 
{
    lblLabel:
    {
        position: "absolute",
        left: 0,
        top: 0,
        height: "100%",
        paddingLeft: "0.5em",
        paddingRight: "0.5em",
        justifyContent: "center",
        // borderRight: "1px solid #fff",
    },
    lblValue: 
    {
        position: "absolute",
        right: 0,
        top: 0,
        height: "100%",
        paddingLeft: "0.5em",
        paddingRight: "0.5em",
        justifyContent: "center",
        // borderLeft: "1px solid #fff",
    }
};

export default SliderStandardOld;