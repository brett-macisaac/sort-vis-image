import utils from "../../standard_ui/utils";

import SortAction from './SortAction.js';


class SortableImage
{
    fCanvas;

    fCanvasContext;

    fImageData;

    fSnapshotImageData;

    fIndexesPixels;

    fSnapshotIndexesPixels;

    fSortActions;

    fImageSrc;

    // The maximum number of pixels that the image can be rendered at.
    fMaxSize;

    fRgbaColourArray

    fCount = 0;
    //#fCountWrites = 0;
    fMaxCount = 10000;

    #fCountActions;
    #fTime1;
    #fTime2;

    fCountActionsPublic;
    fTime1Public;
    fTime2Public;

    constructor(pSrcImg, pCanvas, pMaxSize = 250000)
    {
        this.fMaxSize = pMaxSize;

        this.fCanvas = pCanvas;

        this.fCanvasContext = this.fCanvas.getContext('2d', { willReadFrequently: true });

        this.fSortActions = [];
        this.fSnapshotIndexesPixels = [];

        this.fRgbaColourArray = Array.from({ length: 4 });

        this.setImage(pSrcImg);

        this.#fCountActions = 0;
        this.#fTime1 = 0;
        this.#fTime2 = 0;

        this.fCountActionsPublic = 0;
        this.fTime1Public = 0;
        this.fTime2Public = 0;

        return;
    }

    get length()
    {
        return this.fIndexesPixels.length;
    }

    get canvas()
    {
        return this.fCanvas;
    }

    get sortActions()
    {
        return this.fSortActions;
    }

    get lengthSortActions()
    {
        return this.fSortActions.length;
    }

    getIndex(pIndex)
    {
        return this.fIndexesPixels[pIndex];
    }

    SetMaxCount(aMaxCount)
    {
        this.fMaxCount = aMaxCount;

        if (this.fCount >= this.fMaxCount)
        {
            this.fCount = this.fMaxCount - 1;
        }
    }

    resize(pMaxWidth, pMaxHeight)
    {
        this.setImage(undefined, pMaxWidth, pMaxHeight);
    }

    /**
    * Changes the canvas' image.

    * Parameters:
        @param {string} pSrcImg The url to the image.
        @param {number} pMaxWidth The maximum width that the image can have on the canvas.
        @param {number} pMaxHeight The maximum height the image can have on the canvas.
    */
    setImage(pSrcImg, pMaxWidth, pMaxHeight)
    {
        if (pSrcImg)
        {
            this.fImageSrc = pSrcImg;
        }
        else if (!pSrcImg && !(this.fImageSrc))
        {
            return;
        }

        // The image to display in this.#fCanvas.
        const lImage = new Image();
        lImage.crossOrigin = 'anonymous'; // ???
        lImage.src = this.fImageSrc;
        lImage.alt = "Image to sort.";

        lImage.addEventListener('load', 
            () => 
            {
                console.log("Image width: " + lImage.width);
                console.log("Image height: " + lImage.height);

                const lImageSize = lImage.width * lImage.height;

                // Scale the image down to fit the maximum allowed size.
                if (lImageSize > this.fMaxSize)
                {
                    let lScaleFactor = Math.sqrt(this.fMaxSize / (lImage.width * lImage.height));

                    lImage.width = Math.floor(lScaleFactor * lImage.width);
                    lImage.height = Math.floor(lScaleFactor * lImage.height);

                    console.log("Scaled width #1: " + lImage.width);
                    console.log("Scaled height #1: " + lImage.height);
                }

                // Further scale down the image if it exceeds the maximum dimensions.
                if (lImage.width > pMaxWidth || lImage.height > pMaxHeight)
                {
                    const lNewDimensions = utils.fitMaxDimensions(lImage.width, lImage.height, pMaxWidth, pMaxHeight);

                    lImage.width = Math.floor(lNewDimensions.width);
                    lImage.height = Math.floor(lNewDimensions.height);

                    console.log("Scaled width #2: " + lImage.width);
                    console.log("Scaled height #2: " + lImage.height);
                }

                this.fCanvas.width = lImage.width;
                this.fCanvas.height = lImage.height;

                this.fCanvasContext.drawImage(lImage, 0, 0, lImage.width, lImage.height);

                const lStyleCanvas = window.getComputedStyle(this.fCanvas);

                console.log("Canvas width: " + lStyleCanvas.width);
                console.log("Canvas height: " + lStyleCanvas.height);

                this.fImageData = this.fCanvasContext.getImageData(0, 0, parseFloat(lStyleCanvas.width), parseFloat(lStyleCanvas.height));

                // The number of pixels (and therefore the number of indexes).
                const lNumPixels = this.fImageData.data.length / 4;

                this.fIndexesPixels = Array.from({ length: lNumPixels }, (element, index) => index);

                // console.log("Pixels");
                // console.log(this.#fImageData);
            }
        );
    }

    /*
    * Populates the sort actions array with actions that result in the elements being shuffled.
    */
    shuffleSnapshot()
    {
        // Speed test.
        // console.log("Speed test:");
        // let lTime1 = Date.now();
        // let lTime2 = 0;
        // let lCount = 0;
        // for (let i = 1; i < 10000000; ++i)
        // {
        //     if (++lCount % 1000000 != 0)
        //         continue;

        //     lTime2 = Date.now();

        //     const lLoopsPerMs = Math.floor(lCount / (lTime2 - lTime1));

        //     console.log(`Loop #: ${i}`);
        //     console.log(`Loops per ms: ${lLoopsPerMs}`);

        //     lTime1 = lTime2;

        //     lCount = 0;
        // }

        // let lCount2 = 0;
        // let lTime12 = Date.now();
        // let lTime22 = 0;

        this.fTime1Public = Date.now();
        this.fTime2Public = 0;
        this.fCountActionsPublic = 0;

        // this.#fTime1 = Date.now();
        // this.#fTime2 = 0;
        // this.#fCountActions = 0;

        // const lDisplayCountFunc1 = () =>
        // {
        //     if (++(lCount2) % 100000 != 0)
        //         return;
    
        //     console.log(`Action #${lCount2}`);
    
        //     if (lTime12 == 0)
        //     {
        //         lTime12 = Date.now();
        //     }
        //     else if (lTime22 == 0)
        //     {
        //         lTime22 = Date.now();
    
        //         const lActionsPerMs = Math.floor(lCount2 / (lTime22 - lTime12));
    
        //         console.log(`Actions per ms: ${lActionsPerMs}`);
    
        //         lTime12 = lTime22;
        //         lTime22 = 0;
        //     }
        // }

        // const lDisplayCountFunc2 = () =>
        // {
        //     if (++(this.fCountActionsPublic) % 100000 != 0)
        //         return;
    
        //     console.log(`Action #${this.fCountActionsPublic}`);
    
        //     if (this.fTime1Public == 0)
        //     {
        //         this.fTime1Public = Date.now();
        //     }
        //     else if (this.fTime2Public == 0)
        //     {
        //         this.fTime2Public = Date.now();
    
        //         const lActionsPerMs = Math.floor(this.fCountActionsPublic / (this.fTime2Public - this.fTime1Public));
    
        //         console.log(`Actions per ms: ${lActionsPerMs}`);
    
        //         this.fTime1Public = this.fTime2Public;
        //         this.fTime2Public = 0;
        //     }
        // }

        // const lDisplayCountFunc3 = () =>
        // {
        //     if (++(this.#fCountActions) % 100000 != 0)
        //         return;
    
        //     console.log(`Action #${this.#fCountActions}`);
    
        //     if (this.#fTime1 == 0)
        //     {
        //         this.#fTime1 = Date.now();
        //     }
        //     else if (this.#fTime2 == 0)
        //     {
        //         this.#fTime2 = Date.now();
    
        //         const lActionsPerMs = Math.floor(this.#fCountActions / (this.#fTime2 - this.#fTime1));
    
        //         console.log(`Actions per ms: ${lActionsPerMs}`);
    
        //         this.#fTime1 = this.#fTime2;
        //         this.#fTime2 = 0;
        //     }
        // }

        this.saveSnapshot();

        const lStartTime = Date.now();

        console.log(`Start Time: ${lStartTime}`);

        for (let i = this.fIndexesPixels.length - 1; i > 0; --i)
        {
            const lIndexRandom = utils.getRandomInt(0, i);

            this.swap(i, lIndexRandom);

            // Speed test.
            // this.DisplayCountFunc(i, 1);
        }

        // Speed test.
        const lEndTime = Date.now();
        console.log(`End Time: ${lEndTime}`);
        console.log(`Length: ${lEndTime - lStartTime}`);

        this.loadSnapshot();
    }

    DisplayCountFunc(pIndexA, pIndexB)
    {
        if (++(this.fCountActionsPublic) % 100000 != 0)
            return;

        console.log(`Action #${this.fCountActionsPublic}`);

        if (this.fTime1Public == 0)
        {
            this.fTime1Public = Date.now();
        }
        else if (this.fTime2Public == 0)
        {
            this.fTime2Public = Date.now();

            const lActionsPerMs = Math.floor(this.fCountActionsPublic / (this.fTime2Public - this.fTime1Public));

            console.log(`Actions per ms: ${lActionsPerMs}`);

            this.fTime1Public = this.fTime2Public;
            this.fTime2Public = 0;
        }
    }

    compare(pIndexA, pOperator, pIndexB)
    {
        return utils.compare(this.fIndexesPixels[pIndexA], pOperator, this.fIndexesPixels[pIndexB]);
    }

    compareValue(pIndex, pOperator, pValue)
    {
        return utils.compare(this.fIndexesPixels[pIndex], pOperator, pValue);
    }

    swap(pIndexA, pIndexB, pRecordSortAction = true)
    {
        const lPixelArray = this.fImageData.data;

        const lIndexRed1 = pIndexA * 4;
        const lIndexRed2 = pIndexB * 4;

        for (let i = 0; i < 4; ++i)
        {
            const lColour1 = lPixelArray[lIndexRed1 + i];

            lPixelArray[lIndexRed1 + i] = lPixelArray[lIndexRed2 + i];

            lPixelArray[lIndexRed2 + i] = lColour1;
        }

        // Also swap the indexes.
        const lIndex1 = this.fIndexesPixels[pIndexA];
        this.fIndexesPixels[pIndexA] = this.fIndexesPixels[pIndexB];
        this.fIndexesPixels[pIndexB] = lIndex1;

        if (pRecordSortAction)
        {
            this.fSortActions.push(new SortAction(SortAction.Type.Swap, pIndexA, pIndexB));
            this.displayActionCount();
        }
    }

    /**
    * 

    * Parameters:
        @param {number} pIndex The index of this.#fIndexesPixels at which to place pIndexPixel.
        @param {number} pIndexPixel The value to place at the index pIndex of this.#fIndexesPixels. pIndexPixel is itself
        an index that corresponds to this.#fImageData.
        @param {string} pColour The hex string of the pixel's colour.
    */
    setValue(pIndex, pIndexPixel, pColour, pRecordSortAction = true)
    {
        const lPixelArray = this.fImageData.data;

        // Set this.#fRgbaColourArray with pColour.
        hexColourStringToIntArrayInPlace(pColour, this.fRgbaColourArray);

        const lIndexRed = pIndex * 4;

        for (let i = 0; i < 4; ++i)
        {
            lPixelArray[lIndexRed + i] = this.fRgbaColourArray[i];
        }

        this.fIndexesPixels[pIndex] = pIndexPixel;

        if (pRecordSortAction)
        {
            this.fSortActions.push(new SortAction(SortAction.Type.Set, pIndex, pIndexPixel, pColour));
            this.displayActionCount();
        }
    }

    displayActionCount()
    {
        if (++(this.fCountActionsPublic) % 100000 != 0)
            return;

        if (this.fTime1Public == 0)
        {
            this.fTime1Public = Date.now();
        }
        else if (this.fTime2Public == 0)
        {
            this.fTime2Public = Date.now();

            const lActionsPerMs = Math.floor(this.fCountActionsPublic / (this.fTime2Public - this.fTime1Public));

            console.log(`Actions per ms: ${lActionsPerMs}`);

            this.fTime1Public = this.fTime2Public;
            this.fTime2Public = 0;
        }

        this.fCountActionsPublic = 0;
    }

    getPixelColour(pIndex)
    {
        const lPixelArray = this.fImageData.data;

        const lIndexRed = pIndex * 4;

        this.fRgbaColourArray[0] = lPixelArray[lIndexRed];
        this.fRgbaColourArray[1] = lPixelArray[lIndexRed + 1];
        this.fRgbaColourArray[2] = lPixelArray[lIndexRed + 2];
        this.fRgbaColourArray[3] = lPixelArray[lIndexRed + 3];

        return intArrayToHexColourString(this.fRgbaColourArray);
    }

    reset()
    {
        this.fSortActions = [];

        // this.#fCountActions = 0;
        // this.#fTime1 = Date.now();

        this.fCountActionsPublic = 0;
        this.fTime1Public = Date.now();
    }

    /**
    * Saves the current values of this.#fIndexesPixels into this.#fSnapshotIndexesPixels.
    */
    saveSnapshot()
    {
        if (!Array.isArray(this.fSnapshotIndexesPixels) || this.fSnapshotIndexesPixels.length != this.fIndexesPixels.length)
        {
            this.fSnapshotIndexesPixels = Array.from({ length: this.fIndexesPixels.length });
        }

        for (let i = 0; i < this.fIndexesPixels.length; ++i)
        {
            this.fSnapshotIndexesPixels[i] = this.fIndexesPixels[i];
        }

        const lPixelArray = this.fImageData.data;

        if (!Array.isArray(this.fSnapshotImageData) || this.fSnapshotImageData.length != lPixelArray.length)
        {
            this.fSnapshotImageData = Array.from({ length: lPixelArray.length });
        }

        for (let i = 0; i < lPixelArray.length; ++i)
        {
            this.fSnapshotImageData[i] = lPixelArray[i];
        }

        // console.log("Image data:");
        // console.log(this.#fImageData);

        // console.log("Snapshot image data:");
        // console.log(this.#fSnapshotImageData);
    }

    /**
    * Loads the values of this.#fSnapshotIndexesPixels into this.#fIndexesPixels.
    * Note: this.#fSnapshotIndexesPixels and this.#fIndexesPixels must have the same length.
    * Also undoes all of the actions in this.fSortActions.
    */
    loadSnapshot()
    {
        const lPixelArray = this.fImageData.data;

        if (!Array.isArray(this.fSnapshotIndexesPixels) || this.fSnapshotIndexesPixels.length != this.fIndexesPixels.length)
        {
            console.log("There was an issue with this.#fSnapshotIndexesPixels.");
            return;
        }
        else if (!Array.isArray(this.fSnapshotImageData) || this.fSnapshotImageData.length != lPixelArray.length)
        {
            console.log("There was an issue with this.#fSnapshotImageData.");
            // console.log(this.#fSnapshotImageData);
            return;
        }

        for (let i = 0; i < this.fSnapshotIndexesPixels.length; ++i)
        {
            this.fIndexesPixels[i] = this.fSnapshotIndexesPixels[i];
        }

        for (let i = 0; i < this.fSnapshotImageData.length; ++i)
        {
            lPixelArray[i] = this.fSnapshotImageData[i];
        }

        // for (let i = this.#fSortActions.length - 1; i >= 0; --i)
        // {
        //     this.applySortAction(this.#fSortActions[i]);
        // }
    }

    /**
    * Applies a given sort action to the elements.
    * Do note that if a given action A, is applied to the elements, if this same action A is applied again, the elements 
      must return to their original form prior to the first application of A. For swaps and comparisons, the sort action
      won't be modified to achieve this; however, for sets, the value that is set must be changed each time the action 
      is applied.

    * Parameters: 
        * @param {SortAction} pSortAction 
        * @param {boolean} pRecordSortAction 
    */
    applySortAction(pSortAction, pRecordSortAction = false)
    {
        // Apply action.
        if (pSortAction.type == SortAction.Type.Swap)
        {
            if ((pSortAction.valueA >= 0 && pSortAction.valueA < this.fIndexesPixels.length) &&
                (pSortAction.valueB >= 0 && pSortAction.valueB < this.fIndexesPixels.length))
            {
                this.swap(pSortAction.valueA, pSortAction.valueB, pRecordSortAction);
            }
        }
        else
        {
            if (pSortAction.valueA >= 0 && pSortAction.valueA < this.fIndexesPixels.length)
            {
                // The value that was at the given index prior to the set.
                const lIndexPixel = this.fIndexesPixels[pSortAction.valueA];
                const lColourPixel = this.getPixelColour(pSortAction.valueA);//this._elements[pSortAction.valueA].value;

                this.setValue(pSortAction.valueA, pSortAction.valueB, pSortAction.valueC, pRecordSortAction);

                // Set value B to lValAtIndex so that if the action is applied again it undoes the effect. 
                pSortAction.valueB = lIndexPixel;
                pSortAction.valueC = lColourPixel;
            }
        }
    }

    update()
    {
        this.fCanvasContext.putImageData(this.fImageData, 0, 0);
    }

    download()
    {
        const lLink = document.createElement('a');
        lLink.download = 'download.png';
        lLink.href = this.fCanvas.toDataURL();
        lLink.click();
        lLink.delete;
    }

}

function intArrayToHexColourString(pIntArray)
{
    let lHexString = "";

    for (let i = 0; i < pIntArray.length; ++i)
    {
        const lValue = pIntArray[i];

        if (lValue < 0 || lValue > 255)
            continue;

        lHexString += lValue.toString(16).padStart(2, "0")
    }

    return lHexString;
}

/**
* 
* @param {string} pHexColour 
*/
function hexColourStringToIntArray(pHexColour)
{
    const lIntArray = [];

    for (let i = 0; i < pHexColour.length; i += 2)
    {
        if (i == pHexColour.length - 1)
            break;

        const lHexNumber = pHexColour.substring(i, i + 1);

        lIntArray.push(parseInt(lHexNumber, 16));
    }

    return lIntArray;
}

function hexColourStringToIntArrayInPlace(pHexColour, pIntArray)
{
    if (!Array.isArray(pIntArray))
        return;
    else if (typeof pHexColour !== 'string')
        return;

    for (let i = 0; i < pHexColour.length; i += 2)
    {
        if (i == pHexColour.length - 1)
            break;

        const lHexNumber = pHexColour.substring(i, i + 2);

        const lIndexIntArray = i / 2;

        try
        {
            if (lIndexIntArray > pIntArray.length - 1)
                pIntArray.push(parseInt(lHexNumber, 16));
            else
                pIntArray[i / 2] = parseInt(lHexNumber, 16);
        }
        catch(ex)
        {
            break;
        }
    }
}

export default SortableImage;