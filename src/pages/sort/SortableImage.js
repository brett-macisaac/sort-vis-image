import utils from "../../standard_ui/utils";

import SortAction from './SortAction.js';


class SortableImage
{
    #fCanvas;

    #fCanvasContext;

    #fImageData;

    #fSnapshotImageData;

    #fIndexesPixels;

    #fSnapshotIndexesPixels;

    #fSortActions;

    #fImageSrc;

    // The maximum number of pixels that the image can be rendered at.
    #fMaxSize;

    #fRgbaColourArray

    #fCount = 0;
    //#fCountWrites = 0;
    #fMaxCount = 10000;

    constructor(pSrcImg, pCanvas, pMaxSize = 250000)
    {
        this.#fMaxSize = pMaxSize;

        this.#fCanvas = pCanvas;

        this.#fCanvasContext = this.#fCanvas.getContext('2d');

        this.#fSortActions = [];
        this.#fSnapshotIndexesPixels = [];

        this.#fRgbaColourArray = Array.from({ length: 4 });

        this.setImage(pSrcImg);

        return;
    }

    get length()
    {
        return this.#fIndexesPixels.length;
    }

    get canvas()
    {
        return this.#fCanvas;
    }

    get sortActions()
    {
        return this.#fSortActions;
    }

    get lengthSortActions()
    {
        return this.#fSortActions.length;
    }

    getIndex(pIndex)
    {
        return this.#fIndexesPixels[pIndex];
    }

    SetMaxCount(aMaxCount)
    {
        this.#fMaxCount = aMaxCount;

        if (this.#fCount >= this.#fMaxCount)
        {
            this.#fCount = this.#fMaxCount - 1;
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
            this.#fImageSrc = pSrcImg;
        }
        else if (!pSrcImg && !(this.#fImageSrc))
        {
            return;
        }

        // The image to display in this.#fCanvas.
        const lImage = new Image();
        lImage.crossOrigin = 'anonymous'; // ???
        lImage.src = this.#fImageSrc;
        lImage.alt = "Image to sort.";

        lImage.addEventListener('load', 
            () => 
            {
                console.log("Image width: " + lImage.width);
                console.log("Image height: " + lImage.height);

                const lImageSize = lImage.width * lImage.height;

                // Scale the image down to fit the maximum allowed size.
                if (lImageSize > this.#fMaxSize)
                {
                    let lScaleFactor = Math.sqrt(this.#fMaxSize / (lImage.width * lImage.height));

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

                this.#fCanvas.width = lImage.width;
                this.#fCanvas.height = lImage.height;

                this.#fCanvasContext.drawImage(lImage, 0, 0, lImage.width, lImage.height);

                const lStyleCanvas = window.getComputedStyle(this.#fCanvas);

                console.log("Canvas width: " + lStyleCanvas.width);
                console.log("Canvas height: " + lStyleCanvas.height);

                this.#fImageData = this.#fCanvasContext.getImageData(0, 0, parseFloat(lStyleCanvas.width), parseFloat(lStyleCanvas.height));

                // The number of pixels (and therefore the number of indexes).
                const lNumPixels = this.#fImageData.data.length / 4;

                this.#fIndexesPixels = Array.from({ length: lNumPixels }, (element, index) => index);

                // console.log("Pixels");
                // console.log(this.#fImageData);
            }
        );
    }

    async Shuffle()
    {
        this.Reset();

        const lNumPixels = this.#fIndexesPixels.length;

        for (let i = 0; i < lNumPixels; ++i)
        {
            const lIndexRandom = utils.GetRandom(i, lNumPixels - 1);

            await this.swap(i, lIndexRandom);
        }

        this.Reset();

        this.Update();
    }

    /*
    * Populates the sort actions array with actions that result in the elements being shuffled.
    */
    shuffleSnapshot()
    {
        this.saveSnapshot();

        for (let i = this.#fIndexesPixels.length - 1; i > 0; --i)
        {
            const lIndexRandom = utils.getRandomInt(0, i);

            this.swap(i, lIndexRandom);
        }

        // console.log(this.sortActions);

        this.loadSnapshot();
    }

    compare(pIndexA, pOperator, pIndexB)
    {
        return utils.compare(this.#fIndexesPixels[pIndexA], pOperator, this.#fIndexesPixels[pIndexB]);
    }

    compareValue(pIndex, pOperator, pValue)
    {
        return utils.compare(this.#fIndexesPixels[pIndex], pOperator, pValue);
    }

    swap(pIndexA, pIndexB, pRecordSortAction = true)
    {
        const lPixelArray = this.#fImageData.data;

        const lIndexRed1 = pIndexA * 4;
        const lIndexRed2 = pIndexB * 4;

        for (let i = 0; i < 4; ++i)
        {
            const lColour1 = lPixelArray[lIndexRed1 + i];

            lPixelArray[lIndexRed1 + i] = lPixelArray[lIndexRed2 + i];

            lPixelArray[lIndexRed2 + i] = lColour1;
        }

        // Also swap the indexes.
        const lIndex1 = this.#fIndexesPixels[pIndexA]
        this.#fIndexesPixels[pIndexA] = this.#fIndexesPixels[pIndexB];
        this.#fIndexesPixels[pIndexB] = lIndex1;

        if (pRecordSortAction)
        {
            this.#fSortActions.push(new SortAction(SortAction.Type.Swap, pIndexA, pIndexB));
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
        const lPixelArray = this.#fImageData.data;

        // Set this.#fRgbaColourArray with pColour.
        hexColourStringToIntArrayInPlace(pColour, this.#fRgbaColourArray);

        const lIndexRed = pIndex * 4;

        for (let i = 0; i < 4; ++i)
        {
            lPixelArray[lIndexRed + i] = this.#fRgbaColourArray[i];
        }

        this.#fIndexesPixels[pIndex] = pIndexPixel;

        if (pRecordSortAction)
        {
            this.#fSortActions.push(new SortAction(SortAction.Type.Set, pIndex, pIndexPixel, pColour));
        }
    }

    getPixelColour(pIndex)
    {
        const lPixelArray = this.#fImageData.data;

        const lIndexRed = pIndex * 4;

        this.#fRgbaColourArray[0] = lPixelArray[lIndexRed];
        this.#fRgbaColourArray[1] = lPixelArray[lIndexRed + 1];
        this.#fRgbaColourArray[2] = lPixelArray[lIndexRed + 2];
        this.#fRgbaColourArray[3] = lPixelArray[lIndexRed + 3];

        return intArrayToHexColourString(this.#fRgbaColourArray);
    }

    reset()
    {
        this.#fSortActions = [];
    }

    /**
    * Saves the current values of this.#fIndexesPixels into this.#fSnapshotIndexesPixels.
    */
    saveSnapshot()
    {
        if (!Array.isArray(this.#fSnapshotIndexesPixels) || this.#fSnapshotIndexesPixels.length != this.#fIndexesPixels.length)
        {
            this.#fSnapshotIndexesPixels = Array.from({ length: this.#fIndexesPixels.length });
        }

        for (let i = 0; i < this.#fIndexesPixels.length; ++i)
        {
            this.#fSnapshotIndexesPixels[i] = this.#fIndexesPixels[i];
        }

        const lPixelArray = this.#fImageData.data;

        if (!Array.isArray(this.#fSnapshotImageData) || this.#fSnapshotImageData.length != lPixelArray.length)
        {
            this.#fSnapshotImageData = Array.from({ length: lPixelArray.length });
        }

        for (let i = 0; i < lPixelArray.length; ++i)
        {
            this.#fSnapshotImageData[i] = lPixelArray[i];
        }

        console.log("Image data:");
        console.log(this.#fImageData);

        console.log("Snapshot image data:");
        console.log(this.#fSnapshotImageData);
    }

    /**
    * Loads the values of this.#fSnapshotIndexesPixels into this.#fIndexesPixels.
    * Note: this.#fSnapshotIndexesPixels and this.#fIndexesPixels must have the same length.
    * Also undoes all of the actions in this.fSortActions.
    */
    loadSnapshot()
    {
        const lPixelArray = this.#fImageData.data;

        if (!Array.isArray(this.#fSnapshotIndexesPixels) || this.#fSnapshotIndexesPixels.length != this.#fIndexesPixels.length)
        {
            console.log("There was an issue with this.#fSnapshotIndexesPixels.");
            return;
        }
        else if (!Array.isArray(this.#fSnapshotImageData) || this.#fSnapshotImageData.length != lPixelArray.length)
        {
            console.log("There was an issue with this.#fSnapshotImageData.");
            console.log(this.#fSnapshotImageData);
            return;
        }

        for (let i = 0; i < this.#fSnapshotIndexesPixels.length; ++i)
        {
            this.#fIndexesPixels[i] = this.#fSnapshotIndexesPixels[i];
        }

        for (let i = 0; i < this.#fSnapshotImageData.length; ++i)
        {
            lPixelArray[i] = this.#fSnapshotImageData[i];
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
            if ((pSortAction.valueA >= 0 && pSortAction.valueA < this.#fIndexesPixels.length) &&
                (pSortAction.valueB >= 0 && pSortAction.valueB < this.#fIndexesPixels.length))
            {
                this.swap(pSortAction.valueA, pSortAction.valueB, pRecordSortAction);
            }
        }
        else
        {
            if (pSortAction.valueA >= 0 && pSortAction.valueA < this.#fIndexesPixels.length)
            {
                // The value that was at the given index prior to the set.
                const lIndexPixel = this.#fIndexesPixels[pSortAction.valueA];
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
        this.#fCanvasContext.putImageData(this.#fImageData, 0, 0);
    }

    download()
    {
        const lLink = document.createElement('a');
        lLink.download = 'download.png';
        lLink.href = this.#fCanvas.toDataURL();
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