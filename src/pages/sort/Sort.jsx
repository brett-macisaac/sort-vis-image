import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import _debounce from "lodash/debounce";

import SortView from './SortView';

import { ranges, sortAlgoNames, sortAlgos } from './sort_resources_image.js';

import { utils } from '../../standard_ui/standard_ui';

import Elements from "./Elements.js"

import SortAction from './SortAction.js';

import SortableImage from './SortableImage.js';

// It's necessary to import the image for it to be included in the build folder.
import imageMonaLisa from '../../assets/images/mona_lisa_tiny.jpg';

function Sort({}) 
{
    const [ stIndexSelectedSortAlgo, setIndexSelectedSortAlgo ] = useState(0);

    const [ stIsAscending, setIsAscending ] = useState(false);

    const [ stIsLoading, setIsLoading ] = useState(false);

    const rfIsVolumeOn = useRef(false);

    // This is used to update the view, rather than using state variables for the elements.
    const [ stUpdater, setUpdater ] = useState({});

    /* A reference to the canvas on which the image is drawn. */
    const rfCanvas = useRef(undefined);

    /* A reference to the button that stops the sorting process. */
    const rfBtnStop = useRef(undefined);

    /* A reference to the 'skip next' button. */
    const rfBtnSkipNext = useRef(undefined);

    /* A reference to the 'skip prev' button. */
    const rfBtnSkipPrev = useRef(undefined);

    /* A reference to the 'play/pause' button. */
    const rfBtnPlayPause = useRef(undefined);

    /* A reference to the input element that handles image uploads. */
    const rfBtnImageUpload = useRef(undefined);

    /* A ref to the speed. */
    const rfSpeed = useRef(1000);

    /* A ref for the current direction of the sort: true = forward; false = backwards. */
    const rfDirection = useRef(true);

    const rfIsPaused = useRef(false);

    const rfStopProcess = useRef(false);

    const rfIsSorting = useRef(false);

    const rfReRender = useRef(
        () =>
        {
            setUpdater({});
        }
    );

    // The maximum dimensions that the image can take on the screen.
    const rfMaxImageDimensions = useRef(undefined);

    const rfImage = useRef(undefined);

    useEffect(
        () => 
        {
            if (!rfCanvas.current)
            {
                console.log("Canvas ref not yet set.");
                return;
            }

            console.log("Canvas is ready");

            rfImage.current = new SortableImage(imageMonaLisa, rfCanvas.current, ranges.size);

            if (!rfBtnImageUpload.current)
            {
                console.log("Upload button ref not yet set.");
                return;
            }

            rfBtnImageUpload.current.onchange = function() 
            {
                const lFile = rfBtnImageUpload.current.files[0];

                const lReader = new FileReader();

                lReader.onload = function()
                {
                    let lMaxDimensions = rfMaxImageDimensions.current ? rfMaxImageDimensions.current : { width: 300, height: 300 };

                    //console.log(lReader.result);
                    rfImage.current.setImage(lReader.result, lMaxDimensions.width, lMaxDimensions.height);
                }

                lReader.readAsDataURL(lFile);
            }
        },
        []
    );

    const handleBtnPlayPause = useCallback(
        async (pSorting = true) =>
        {
            if (!(rfIsSorting.current))
            {
                console.log("Start sort");

                rfIsSorting.current = true;
                rfIsPaused.current = false;
                rfStopProcess.current = false;
                rfDirection.current = true;

                // rfElements.current.reset();
            }
            else if (!(rfIsPaused.current))
            {
                rfIsPaused.current = true;
                rfReRender.current();
                console.log(rfIsPaused.current ? "Pause" : "Resume");
                return;
            }
            else
            {
                return;
            }

            rfReRender.current();

            // Populate the sort actions (if in 'sorting mode').
            if (pSorting)
            {
                // Add a loading screen here.
                setIsLoading(true);
                rfImage.current.reset();
                await utils.sleepFor(100);
                sortAlgos[sortAlgoNames[stIndexSelectedSortAlgo]](rfImage.current, stIsAscending);
                setIsLoading(false);
            }

            let lSortActions = rfImage.current.sortActions;
            let lLengthSortActions = rfImage.current.lengthSortActions;
            console.log(lSortActions);
            console.log(lLengthSortActions);
            // return;

            let lGoBack = false;

            let lCountSinceLastUpdate = 0;

            let lForward = true;
            let lDirectionChanged = false;

            for (let i = 0; i < lLengthSortActions; )
            {
                if (lDirectionChanged)
                {
                    lDirectionChanged = false;
                }

                // Apply action.
                rfImage.current.applySortAction(lSortActions[i]);
                // rfReRender.current();

                if (++lCountSinceLastUpdate == rfSpeed.current || i == lLengthSortActions - 1)
                {
                    rfImage.current.update();

                    // Pause or skip.
                    lGoBack = await sleepOrSkip();

                    if (lGoBack && lForward)
                    {
                        lDirectionChanged = true;
                        lForward = false;
                    }
                    else if (!lGoBack && !lForward)
                    {
                        lDirectionChanged = true;
                        lForward = true;
                    }

                    lCountSinceLastUpdate = 0;
                }

                if (rfStopProcess.current)
                    break;

                if (lForward && !lDirectionChanged)
                { 
                    ++i;
                }
                else if (i != 0 && !lDirectionChanged)
                {
                    --i;
                }
                else if (i == 0)
                {
                    lCountSinceLastUpdate = 0;
                    lForward = true;
                }
            }

            rfIsSorting.current = false;

            rfReRender.current();

            console.log("End sort");
        },
        [ stIndexSelectedSortAlgo, stIsAscending ]
    );

    const sleepOrSkip = useCallback(
        async () =>
        {
            if (rfIsPaused.current)
            {
                console.log("Pause until clicks");

                // Need a way of determining which one was clicked. It shouldn't be unpaused if _btnSkip was the click
                const lIndexClick = await utils.sleepUntilClicks([ rfBtnSkipNext.current, rfBtnSkipPrev.current,
                                                                   rfBtnPlayPause.current, rfBtnStop.current ]);

                console.log(lIndexClick);

                if (lIndexClick != 0 && lIndexClick != 1)
                {
                    rfIsPaused.current = false;
                }

                rfReRender.current();

                // Return whether the 'skip prev' button was clicked.
                return lIndexClick == 1;
            }
            else
            {
                await utils.sleepFor(1);
                return false;
            }
        },
        []
    );

    const handleBtnSortDir = useCallback(
        async () =>
        {
            setIsAscending((prev) => { return !prev });
        },
        []
    );

    const handleBtnVolume = useCallback(
        async () =>
        {
            rfIsVolumeOn.current = !rfIsVolumeOn.current;

            rfReRender.current();
        },
        []
    );

    const handleChangeDirection = useCallback(
        async () =>
        {
            console.log("Change direction.")
            rfDirection.current = !rfDirection.current;
        },
        []
    );

    const handleBtnShuffle = useCallback(
        async () =>
        {
            rfImage.current.reset();

            await rfImage.current.shuffleSnapshot();

            await handleBtnPlayPause(false);
        },
        [ handleBtnPlayPause ]
    );

    const handleBtnStop = useCallback(
        () =>
        {
            rfStopProcess.current = true;
        },
        []
    );

    const handleBtnDownload = useCallback(
        async () =>
        {
            if (!rfImage.current)
                return;

            rfImage.current.download();
        },
        []
    );

    const handleChangeSliderSpeed = useCallback(
        (pSpeed) =>
        {
            // Invert the speed because the slider also shows the inverted value.
            // setSpeed(ranges.speed.max - pSpeed + 1);
            // console.log(`Speed: ${pSpeed}`)

            rfSpeed.current = pSpeed;

            rfReRender.current();
        },
        [] // stSpeed
    );

    const resizeImage = useCallback(
        async (pMaxWidth, pMaxHeight) =>
        {
            if (!rfImage.current)
                return;
            else if (rfIsSorting.current)
                return;

            rfMaxImageDimensions.current = { width: pMaxWidth, height: pMaxHeight };

            rfImage.current.resize(pMaxWidth, pMaxHeight);
        },
        []
    );


    return (
        <SortView
            prIndexSelectedSortAlgo = { stIndexSelectedSortAlgo }
            prSpeed = { rfSpeed.current }
            prOnPlayPause = { handleBtnPlayPause }
            prOnChangeSliderSpeed = { handleChangeSliderSpeed }
            prOnPressBtnSortDir = { handleBtnSortDir }
            prOnPressCmbSortAlgo = { setIndexSelectedSortAlgo }
            prOnPressBtnShuffle = { handleBtnShuffle }
            prOnPressBtnStop = { handleBtnStop }
            prOnPressBtnVolume = { handleBtnVolume }
            prOnPressDownload = { handleBtnDownload }
            prOnPressChangeDirection = { handleChangeDirection }
            prResizeImage = { resizeImage }
            prUpdater = { stUpdater }
            prRefBtnStop = { rfBtnStop }
            prRefBtnSkipNext = { rfBtnSkipNext }
            prRefBtnSkipPrev = { rfBtnSkipPrev }
            prRefBtnPlayPause = { rfBtnPlayPause }
            prRefBtnImageUpload = { rfBtnImageUpload }
            prIsSorting = { rfIsSorting.current }
            prIsPaused = { rfIsPaused.current }
            prIsAscending = { stIsAscending }
            prIsVolumeOn = { rfIsVolumeOn.current }
            prRefCanvas = { rfCanvas }
            prIsLoading = { stIsLoading }
        />
    );
}

const gDefaultNumElements = 25

// Replace with getRandomFloat in standard_ui library when it's updated next.
function getRandom(aMin, aMax)
{
    return Math.random() * (aMax - aMin + 1) + aMin;
}

export default Sort;