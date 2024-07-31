import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import PaletteIcon from '@mui/icons-material/Palette';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import themes, { defaultTheme } from '../../themes/themes.js';

import { ButtonStd } from "../../standard_ui/standard_ui";
import { PageContainerStd } from "../../standard_ui/standard_ui";
import { useTheme } from "../../standard_ui/standard_ui";
import { useWindowSize } from '../../standard_ui/standard_ui';

import { SliderStd } from '../../standard_ui/standard_ui';
import { ComboBoxStd } from '../../standard_ui/standard_ui';

import { sortAlgoNames, ranges } from './sort_resources_image';

function SortView({ prElements, prNumElements, prIndexSelectedSortAlgo, prSpeed, prOnChangeSliderSpeed, 
                    prOnPlayPause, prOnChangeSliderNumEls, prOnPressBtnSortDir, prOnPressCmbSortAlgo, 
                    prOnPressBtnShuffle, prOnPressBtnStop, prOnPressDownload, prOnPressChangeDirection, prResizeImage, prUpdater,
                    prRefBtnStop, prRefBtnSkipNext, prRefBtnSkipPrev, prRefBtnPlayPause, prRefBtnImageUpload, prIsSorting, prIsPaused, 
                    prIsAscending, prIsVolumeOn, prIsLoading, prRefCanvas }) 
{

    // Acquire global theme.
    const { themeName } = useTheme();
    let lTheme = (themeName && themeName in themes) ? themes[themeName] : themes[defaultTheme];

    const windowSize = useWindowSize();

    const navigate = useNavigate();

    // Whether to display the app in 'landscape' orientation.
    const lIsLandScape = useMemo(
        () =>
        {
            if (windowSize.isLandscape)
            {
                return windowSize.height < 800 || windowSize.width < 500
            }
            else
            {
                return false
            }
        },
        [ windowSize ]
    );

    const lStyleCon = useMemo(
        () =>
        {
            return lIsLandScape ? styles.containerLandscape : styles.containerPortrait;
        },
        [ lIsLandScape ]
    );

    const lStyleConComboBox = useMemo(
        () =>
        {
            return lIsLandScape ? styles.conComboBoxLandscape : styles.conComboBoxPortrait;
        },
        [ lIsLandScape ]
    );

    const lStyleConElements = useMemo(
        () =>
        {
            return lIsLandScape ? styles.conElementsLandscape : styles.conElementsPortrait;
        },
        [ lIsLandScape ]
    );

    const lStyleConSliders = useMemo(
        () =>
        {
            return lIsLandScape ? { ...styles.conSliders, ...styles.conSlidersLandscape } : 
                                            { ...styles.conSliders, ...styles.conSlidersPortrait };
        },
        [ lIsLandScape ]
    );

    const lStyleBtnSortDirection = useMemo(
        () =>
        {
            return lIsLandScape ? styles.btnSortDirectionLandscape : styles.btnSortDirectionPortrait;
        },
        [ lIsLandScape ]
    );

    // Props related to the buttons.
    let lButtonProps = useMemo(
        () => 
        { 
            // The total available space along the direction that the buttons are arranged (i.e. either vertical or horizontal).
            let lSpaceAvailable = lIsLandScape ? windowSize.height : windowSize.width;

            // The size of the gap between the buttons along the direction that the buttons are arranged (i.e. either vertical or horizontal).
            let lGap = lSpaceAvailable * 0.04;

            // The size of each button along the direction that the buttons are arranged (i.e. either vertical or horizontal).
            let lSize = (lSpaceAvailable - 2 * styles.conButtons.padding - 6 * lGap - 14 * styles.button.con.padding) / 7;

            // Make sure the size is between the min and max.
            lSize = lSize > 150 ? 150 : lSize;
            lSize = lSize < 40 ? 40 : lSize;

            return { size: lSize * 0.98, gap: lGap }; 
        },
        [ windowSize, lIsLandScape ]
    );

    const lMaxImageDimensions = useMemo(
        () =>
        {
            let lMaxWidth, lMaxHeight;

            if (lIsLandScape)
            {
                lMaxHeight = windowSize.height - 2 * styles.conElementsLandscape.padding;

                lMaxWidth = 400;
            }
            else
            {
                lMaxWidth = windowSize.width - 2 * styles.conElementsPortrait.padding;

                lMaxHeight = 400;
            }

            return { width: lMaxWidth, height: lMaxHeight }
        },
        [ lButtonProps, windowSize, lIsLandScape ]
    );

    useEffect(
        () =>
        {
            prResizeImage(lMaxImageDimensions.width, lMaxImageDimensions.height);
        },
        [ lMaxImageDimensions ]
    );

    const lStyleButtonIcon = useMemo(
        () =>
        {
            return {
                fill: "#ffffff", fontSize: lButtonProps.size
            };
        },
        [ themeName, lButtonProps ]
    );

    const lStyleConButtons = useMemo(
        () =>
        {
            if (lIsLandScape)
            {
                return {
                    ...styles.conButtons, ...styles.conButtonsLandScape, rowGap: lButtonProps.gap, overflowY: "scroll"
                };
            }
            else
            {
                return {
                    ...styles.conButtons, ...styles.conButtonsPortrait, columnGap: lButtonProps.gap, overflowX: "scroll"
                };
            }
        },
        [ themeName, lButtonProps, lIsLandScape ]
    );

    const lStyleSlider = useMemo(
        () =>
        {
            if (lIsLandScape)
            {
                return { 
                    con: {
                        border: "none",
                        borderLeft: `1px solid ${"#ffffff"}`,
                    }
                };
            }
            else
            {
                return { 
                    con: {
                        border: "none",
                        borderTop: `1px solid ${"#ffffff"}`
                    }
                };
            }
        },
        [ themeName, lIsLandScape ]
    );

    const lStyleComboBox = useMemo(
        () =>
        {
            if (lIsLandScape)
            {
                return { 
                    con: { 
                        border: "none", borderRight: `1px solid #ffffff`, 
                        flexGrow: 1, width: 50
                    },
                    conItems: {
                        border: "none", borderRight: `1px solid #ffffff`, borderTop: `1px solid #ffffff`, 
                    }
                };
            }
            else
            {
                return { 
                    con: { 
                        border: "none", borderBottom: `1px solid #ffffff`, 
                        flexGrow: 1, height: 50,
                        width: 1, // Width is required to be set so that flexGrow works.
                    },
                    conItems: {
                        border: "none", borderLeft: `1px solid #ffffff`, borderBottom: `1px solid #ffffff`, 
                    }
                };
            }
        },
        [ themeName, lIsLandScape ]
    );

    const lStyleIconBtnSortDir = useMemo(
        () =>
        {
            return { fill: "#ffffff", fontSize: 35 }
        },
        [ themeName ]
    );

    const lIconBtnSortDir = useMemo(
        () =>
        {
            if (false && lIsLandScape)
            {
                return prIsAscending ? <ArrowForwardIcon sx = { lStyleIconBtnSortDir } /> :
                                       <ArrowBackIcon sx = { lStyleIconBtnSortDir } />;
            }
            else
            {
                return !prIsAscending ? <ArrowDownwardIcon sx = { lStyleIconBtnSortDir } /> :
                                       <ArrowUpwardIcon sx = { lStyleIconBtnSortDir } />;
            }
        },
        [ themeName, prIsAscending, lIsLandScape ]
    );

    const lIconBtnPlayPause = useMemo(
        () =>
        {
            return (!prIsSorting || prIsPaused) ? <PlayArrowIcon sx = { lStyleButtonIcon } /> :
                                                  <PauseIcon sx = { lStyleButtonIcon } />
        },
        [ lStyleButtonIcon, prIsPaused, prIsSorting ]
    );

    const lIconBtnVolume = useMemo(
        () =>
        {
            return prIsVolumeOn ? <VolumeUpIcon sx = { lStyleButtonIcon } /> :
                                  <VolumeOffIcon sx = { lStyleButtonIcon } />
        },
        [ lStyleButtonIcon, prIsVolumeOn ]
    );

    return ( 
        <PageContainerStd
            prNavigate = { navigate }
            prShowHeader = { false }
            prStyles = { lStyleCon } prTheme = { lTheme.pageContainer }
            prIsLoading = { prIsLoading }
        >

            <div style = { lStyleConComboBox }>
                <ButtonStd 
                    prIcon = { lIconBtnSortDir }
                    prStyles = { lStyleBtnSortDirection } prIsBorderDisabled = { false }
                    prOnPress = { prOnPressBtnSortDir }
                    prIsActive = { !prIsSorting }
                />
                <ComboBoxStd
                    prItems = { sortAlgoNames } prIndexSelected = { prIndexSelectedSortAlgo }
                    prDirection = { lIsLandScape ? "r" : "d" } 
                    prLength = { lIsLandScape ? undefined : "100%" } 
                    prOnPress = { prOnPressCmbSortAlgo }
                    prHideScrollBar = { false }
                    prMaxLengthItemBox = { lIsLandScape ? Math.min(windowSize.width * 0.4, 400) : Math.min(windowSize.height * 0.4, 400) }
                    prWidth = { lIsLandScape ? 60 : undefined }
                    prHeight = { lIsLandScape ? undefined : 60 }
                    prStyles = { lStyleComboBox }
                    prIsActive = { !prIsSorting }
                />
            </div>

            {/* Render image */}
            <div style = { lStyleConElements } className = "hideScrollBar" onClick = { prOnPressChangeDirection }>
                <canvas ref = { prRefCanvas } style = { styles.canvas }>

                </canvas>
            </div>

            <div style = { lStyleConSliders }>
                <SliderStd 
                    prIsVertical = { lIsLandScape } prIsVerticalTopDown
                    prMin = { 0 } prMax = { ranges.speed.max } prValue = { prSpeed } prStep = { 100 }
                    prMinAllowed = { ranges.speed.min }
                    prOnChange = { prOnChangeSliderSpeed }
                    // prShowValue = { false }
                    prLabel = "SPEED"
                    prHeight = { lIsLandScape ? window.innerHeight : 60 }
                    prWidth = { lIsLandScape ? 60 : undefined }
                    prStyles = { lStyleSlider }
                />
            </div>

            {/* Render buttons */}
            <div style = { lStyleConButtons } className = "hideScrollBar"> 
                <ButtonStd 
                    prIcon = { lIconBtnPlayPause }
                    prStyles = { styles.button }
                    prRef = { prRefBtnPlayPause }
                    prOnPress = { prOnPlayPause }
                />
                <ButtonStd 
                    prIcon = { <SkipPreviousIcon sx = { lStyleButtonIcon } /> }
                    prStyles = { styles.button }
                    prRef = { prRefBtnSkipPrev }
                    prIsActive = { !prIsSorting || prIsPaused }
                />
                <ButtonStd 
                    prIcon = { <SkipNextIcon sx = { lStyleButtonIcon } /> }
                    prStyles = { styles.button }
                    prRef = { prRefBtnSkipNext }
                    prIsActive = { !prIsSorting || prIsPaused }
                />
                <ButtonStd 
                    prIcon = { <StopIcon sx = { lStyleButtonIcon } /> }
                    prStyles = { styles.button }
                    prRef = { prRefBtnStop }
                    prOnPress = { prOnPressBtnStop }
                />
                <ButtonStd 
                    prIcon = { <ShuffleIcon sx = { lStyleButtonIcon } /> }
                    prStyles = { styles.button }
                    prOnPress = { prOnPressBtnShuffle }
                    prIsActive = { !prIsSorting }
                />
                <label for = "inputImage" style = { styles.labelImage }>
                    {/* Hello */}
                    <FileUploadIcon sx = { lStyleButtonIcon } />
                    <input type = "file" id = "inputImage" style = { styles.inputImage } accept = "image/*" ref = { prRefBtnImageUpload } disabled = { prIsSorting } />
                </label>
                <ButtonStd 
                    prIcon = { <FileDownloadIcon sx = { lStyleButtonIcon } /> }
                    prStyles = { styles.button }
                    prOnPress = { prOnPressDownload }
                    prIsActive = { !prIsSorting || prIsPaused }
                />
            </div>

        </PageContainerStd>
    );
}

const styles = 
{
    containerLandscape:
    {
        con:
        {
            alignItems: "center",
            flexDirection: "row",
            padding: 0,
            columnGap: 15,
            overflow: "hidden"
        }
    },
    containerPortrait:
    {
        con:
        {
            flexDirection: "column",
            padding: 0,
            rowGap: 15
        }
    },

    comboBox:
    {
        con:
        {
            flexGrow: 1, flexShrink: 0,
            width: 50
        }
    },

    conButtons: 
    {
        // justifyContent: "center",
        padding: 10
    },
    conButtonsLandScape: 
    {
        height: "100%",
        flexDirection: "column",
    },
    conButtonsPortrait: 
    {
        width: "100%",
        flexDirection: "row",
    },

    button:
    {
        con:
        {
            padding: 3,
            flexShrink: 0
        }
    },
    conSliders:
    {
        alignSelf: "flex-start",
        flexShrink: 0,
        flexGrow: 0,
    },
    conSlidersLandscape:
    {
        alignSelf: "flex-start",
        height: "100%",
        minHeight: "100%",
        flexDirection: "row",
        flexShrink: 0,
        flexGrow: 0,
        columnGap: 0
    },
    conSlidersPortrait:
    {
        alignSelf: "flex-start",
        width: "100%",
        flexDirection: "column",
        flexShrink: 0,
        flexGrow: 0,
        rowGap: 0
    },
    slider:
    {
        con:
        {
            border: "none",
        },
    },
    conElementsLandscape:
    {
        flexGrow: 1, 
        height: "100%",
        flexDirection: "column", 
        alignItems: "center", 
        // justifyContent: "center", 
        overflowY: "scroll",
        padding: 10,
    },
    conElementsPortrait:
    {
        flexGrow: 1, 
        width: "100%", 
        flexDirection: "column", 
        alignItems: "center", 
        // justifyContent: "center", 
        padding: 10, 
        overflowY: "scroll",
    },
    combobox:
    {
        con:
        {
            border: "none",
        }
    },
    conComboBoxLandscape:
    {
        flexDirection: "column",
        height: "100%",
        flexShrink: 0,
    },
    conComboBoxPortrait:
    {
        flexDirection: "row",
        width: "100%",
        flexShrink: 0,
    },
    btnSortDirectionLandscape:
    {
        con:
        {
            width: "100%",
            borderLeft: "none",
            borderTop: "none",
            borderRadius: 0,
            padding: 5,
        }
    },
    btnSortDirectionPortrait:
    {
        con:
        {
            height: "100%",
            borderLeft: "none",
            borderTop: "none",
            borderRadius: 0,
            padding: 5,
            flexShrink: 0
        }
    },

    inputImage:
    {
        display: "none"
    },

    labelImage:
    {
        display: "flex",
        padding: 3,
        flexShrink: 0,
        backgroundColor: "black",
        borderRadius: "1em",
        justifyContent: "center"
    },

    canvas:
    {
        margin: "auto"
    }
};

export default SortView;