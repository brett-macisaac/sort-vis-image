function sleepFor(aSleepDuration)
{
    if (typeof aSleepDuration !== 'number')
    {
        console.log("aSleepDuration must be a number, not " + typeof aSleepDuration);
        return;
    } 
    else if (aSleepDuration < 0)
    {
        console.log("aSleepDuration can't be negative.");
        return;
    }

    return new Promise (resolve => setTimeout(resolve, aSleepDuration));
}

//https://www.geeksforgeeks.org/how-to-pause-and-play-a-loop-in-javascript-using-event-listeners/
function sleepUntilClick(aElement)
{
    // Wait until the button is pressed.
    return new Promise(resolve => 
        {
            // The function to call when aButton is pressed.
            const RemoveListenerAndResolve = () =>
            {
                aElement.removeEventListener('click', RemoveListenerAndResolve);
                resolve("");
            }

            // Add an event listener that results in RemoveListenerAndResolve being called when aButton is clicked.
            aElement.addEventListener('click', RemoveListenerAndResolve);
        });
}

// Returns the index that was clicked.
function sleepUntilClicks(pElements)
{
    if (!(pElements instanceof Array))
    {
        console.log("aElements must be an array.");
        return;
    }
    else if (!pElements.every(e => e instanceof Element))
    {
        console.log("Every item of aElements must be a DOM element.");
        return;
    }

    // Create a bunch of functions for each button.

    // Wait until the button is pressed, return index of button pressed.
    return new Promise(
        resolve => 
        {
            // The function to call when aButton is pressed.
            // const RemoveListenersAndResolve = (e) =>
            // {
            //     // Remove all of the listeners.
            //     pElements.forEach(e => e.removeEventListener('click', RemoveListenersAndResolve));

            //     console.log(e);

            //     resolve("");
            // }

            const lRemoveListenersFuncs = pElements.map(
                (pElement, pIndex) =>
                {
                    return (e) =>
                    {
                        // Remove all of the listeners.
                        pElements.forEach((e, i) => e.removeEventListener('click', lRemoveListenersFuncs[i]));
        
                        // console.log(e);
        
                        resolve(pIndex);
                    }
                }
            );
            
            // Add an event listener to each element that results in RemoveListenerAndResolve being called.
            // This means that any of the elements can be clicked to resolve the promise.
            pElements.forEach(
                (e, i) => e.addEventListener(
                    'click', lRemoveListenersFuncs[i]
                )
            );
        }
    );
}

/*
* This function returns a random number between aMin and aMax (inclusive of both, i.e. [aMin, aMax]).

* Parameters:
    > aMin: the minimum value of the random number.
    > aMax: the maximum value of the random number.
*/
function getRandomInt(aMin, aMax)
{
    return Math.floor(Math.random() * (aMax - aMin + 1)) + aMin;
}

function getRandomFloat(aMin, aMax)
{
    return Math.random() * (aMax - aMin + 1) + aMin;
}

/*
* Randomises the order of the given array.

* Parameters:
    > aArray: the array to randomise.
*/
function randomiseArray(aArray)
{
    if (!Array.isArray(aArray))
    {
        console.log("The parameter is not an array.");
        return;
    }

    for (let i = aArray.length - 1; i > 0; --i)
    {
        const lIndexRandom = GetRandom(0, i);

        let lValueI = aArray[i];
        aArray[i] = aArray[lIndexRandom];
        aArray[lIndexRandom] = lValueI;
    }

}

function setInLocalStorage(aKey, aValue)
{
    if (aValue instanceof Map)
    {
        console.log("Storing a map in local storage.");

        localStorage[aKey] = JSON.stringify(Array.from(aValue));
    }
    else
    {
        localStorage[aKey] = JSON.stringify(aValue);
    }

}

/*
* Retrieves data from device's internal storage.

* Parameters:
    > aKey: the key that corresponds to the data.
    > aAlt: the value that will be returned should the key have no corresponding value.
*/
function getFromLocalStorage(aKey, aAlt = "")
{
    if (!localStorage.hasOwnProperty(aKey))
    {
        console.log("localStorage doesn't contain data associated with this key.");
    }

    const lString = localStorage[aKey];

    return lString ? JSON.parse(lString) : aAlt;
}

/*
* 'Debounces' a function.
* The minimum gap between calls to pFunc is guaranteed to be at least pLengthGap.
* See 'https://www.freecodecamp.org/news/javascript-debounce-example/' for a more in-depth explanation.

* Parameters:
    > aKey: the function to be debounced.
    > pLengthGap: the minimum gap between calls to pFunc.
*/
function debounce(pFunc, pLengthGap)
{
    let lTimer;

    return (...args) => 
    {
      clearTimeout(lTimer);

      lTimer = setTimeout(() => { pFunc.apply(this, args); }, pLengthGap);
    };
}

/*
* Returns an end-padded version of the given array.
* The returned array contains the same data as the one supplied to the function, with additional elements (equal to
  pFillValue) padded to the end. 

* Parameters:
*/
function padEndArray(pArray, pMinLength, pFillValue)
{
    if (pArray.length >= pMinLength)
        return pArray;

    return Object.assign(new Array(pMinLength).fill(pFillValue), pArray);
}

/*
* Returns a percentage of a particular value. 

* Parameters:
    > pPercentage: a number or string which represents the percentage (0-100). If a string, it can be of the form "xx%."
    > pValue: the value to which a percentage will be calculated.
*/
function getPercentVal(pPercentage, pValue)
{
    return (parseInt(pPercentage) / 100) * pValue;
}

function ordinalSuffix(aNum)
{
    if (typeof aNum !== 'number')
        return;

    const lNumAbs = Math.abs(aNum);

    if (lNumAbs > 3 && lNumAbs < 21)
        return "th";
    
    const lNumMod10 = lNumAbs % 10;

    if (lNumMod10 === 1)
        return "st";
    else if (lNumMod10 === 2)
        return "nd"
    else if (lNumMod10 === 3)
        return "rd"
    else
        return "th";
}

/*
* If the supplied dimensions (pWidth and pHeight) fit within their desired maximums, said dimensions are returned; 
  otherwise, the dimensions are altered (preserving aspect ratio) such that they both are at or below their maximums.
*/
function fitMaxDimensions(pWidth, pHeight, pMaxWidth, pMaxHeight)
{
    // The image's aspect ratio.
    const lAspectRatio = pWidth / pHeight;

    if (pWidth > pMaxWidth && pHeight > pMaxHeight)
    {
        pWidth = pMaxWidth;

        pHeight = pWidth / lAspectRatio;

        // If the height is still greater than the max after adjusting for width.
        if (pHeight > pMaxHeight)
        {
            pHeight = pMaxHeight;

            pWidth = pHeight * lAspectRatio;
        }
    }
    else if (pWidth > pMaxWidth)
    {
        pWidth = pMaxWidth;

        pHeight = pWidth / lAspectRatio;
    }
    else if (pHeight > pMaxHeight)
    {
        pHeight = pMaxHeight;

        pWidth = pHeight * lAspectRatio;
    }

    return { width: pWidth, height: pHeight };
}

// An 'enum' for representing comparison operators.
const compOps = Object.freeze(
    {
        E: "E",  // Equals (===)
        NE: "NE", // Not Equals (!==)
        G: "G",  // Greater (>)
        L: "L",  // Less than (<)
        GE: "GE", // Greater or Equal (>=)
        LE: "LE"  // Less than or Equal (<=)
    }
);

function compare(pNum1, pOperator, pNum2)
{
    if (pOperator === utils.compOps.G)
    {
        return pNum1 > pNum2;
    }
    else if (pOperator === utils.compOps.L)
    {
        return pNum1 < pNum2;
    }
    else if (pOperator === utils.compOps.GE)
    {
        return pNum1 >= pNum2;
    }
    else if (pOperator === utils.compOps.LE)
    {
        return pNum1 <= pNum2;
    }
    else if (pOperator === utils.compOps.E)
    {
        return pNum1 === pNum2;
    }
    else if (pOperator === utils.compOps.NE)
    {
        return pNum1 !== pNum2;
    }

    console.log("Unknown comparison operator.");
    return true;
}

const utils =
{
    sleepFor: sleepFor,
    sleepUntilClick: sleepUntilClick,
    sleepUntilClicks: sleepUntilClicks,
    getRandomInt: getRandomInt,
    getRandomFloat: getRandomFloat,
    randomiseArray: randomiseArray,
    setInLocalStorage: setInLocalStorage,
    getFromLocalStorage: getFromLocalStorage,
    debounce: debounce,
    padEndArray: padEndArray,
    getPercentVal: getPercentVal,
    ordinalSuffix: ordinalSuffix,
    compare: compare,
    fitMaxDimensions: fitMaxDimensions,
    compOps: compOps
};

// Export functions.
export { utils as default };
