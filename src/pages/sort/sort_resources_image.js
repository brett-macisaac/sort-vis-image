
import utils from "../../standard_ui/utils";

// The sorting algorithms.
const sortAlgos = {

    QuickSortRandomPivot(pImage, pAscending)
    {
        // Take a snapshot of the image's indexes.
        pImage.saveSnapshot();

        const lOperator = pAscending ? utils.compOps.G : utils.compOps.L;

        // const lColourSortIndex = "#0f5099";

        const SortValue = (pImage, pStart, pEnd) =>
        {
            // The index of the value that is to be placed into its sorted position.
            let lIndexPivot = utils.getRandomInt(pStart, pEnd);

            pImage.swap(lIndexPivot, pEnd);

            lIndexPivot = pEnd;

            // The index at which lIndexPivot's value will ultimately be placed.
            let lIndexOfSort = pStart;

            // Highlight the segment from aStart to aEnd.
            // pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.swapped, true);

            // Highlight the value that is to be placed into its sorted position.
            // pElements.SetElementColour(lIndexPivot, pElements.colours.compared, true);

            // Remove colours.
            // pElements.SetElementRangeColour(aStart, aEnd, pElements.colours.default);
            
            // Highlight the index lIndexOfSort.
            // pElements.SetElementColour(lIndexOfSort, lColourSortIndex, true);

            for (let i = pStart; i < pEnd; ++i)
            {
                if (pImage.compare(lIndexPivot, lOperator, i))
                {
                    // Swap current value with the one at lIndexOfSort.
                    if (i != lIndexOfSort)
                        pImage.swap(i, lIndexOfSort);

                    // pElements.SetElementColour(lIndexOfSort, pElements.colours.default);
                    ++lIndexOfSort;
                    // pElements.SetElementColour(lIndexOfSort, lColourSortIndex, true);
                }
                else if (i == lIndexOfSort)
                {
                    // pElements.SetElementColour(lIndexOfSort, lColourSortIndex, true); 
                }
        
            }

            // Move the pivot's value into its sorted position.
            if (lIndexOfSort != lIndexPivot)
            { pImage.swap(lIndexOfSort, lIndexPivot); }

            // Indicate that the value at lIndexOfSort is in its sorted position.
            // pElements.SetElementSorted(lIndexOfSort, true);

            // Return the index of the value sorted by this algorithm.
            return lIndexOfSort;
        }

        const SplitElements = (pImage, aStart, aEnd) => 
        {
            if (aStart < aEnd)
            {
                const lIndexSortedValue = SortValue(pImage, aStart, aEnd);

                // Highlight the lower segment.
                // pElements.SetElementRangeColour(aStart, lIndexSortedValue - 1, pElements.colours.compared, false);

                // if (pElements.stop) return;

                // Highlight the upper segment.
                // pElements.SetElementRangeColour(lIndexSortedValue + 1, aEnd, pElements.colours.swapped, true);

                // Remove colours.
                // pElements.SetElementRangeColour(aStart, lIndexSortedValue - 1, pElements.colours.default);
                // pElements.SetElementRangeColour(lIndexSortedValue + 1, aEnd, pElements.colours.default);

                SplitElements(pImage, aStart, lIndexSortedValue - 1);

                SplitElements(pImage, lIndexSortedValue + 1, aEnd);
            }
            else if (aStart === aEnd)
            {
                // pElements.SetElementSorted(aStart, true);
            }

        }

        SplitElements(pImage, 0, pImage.length - 1);

        // Load the snapshot to undo the changes.
        pImage.loadSnapshot();
    },

    MergeSort(pImage, pAscending)
    {
        // Take a snapshot of the elements.
        pImage.saveSnapshot();

        const lOperator = pAscending ? utils.compOps.LE : utils.compOps.GE;

        const Merge = (pImage, aStart, aMid, aEnd) =>
        {
            // Create a temporary container to house the merged segment.
            const lSizeOfMerger = aEnd - aStart + 1; // Size of merged segment.
            let lMerger = Array(lSizeOfMerger); // Array to hold the merged values of lower and upper segments.

            // (a). The current indexes of the lower and upper segments, respectively.
            let lIndexLowerSegment = aStart;
            let lIndexUpperSegment = aMid + 1;

            // (b). The 'current' index of lMerger.
            let lMergerIndex = 0;
            
            // The purpose of this while loop is to populate lMerger with all elements from lower and upper segments.
            while (true) // (c).
            {
                if (lIndexLowerSegment <= aMid && lIndexUpperSegment <= aEnd) // (d).
                {
                    if (pImage.compare(lIndexLowerSegment, lOperator, lIndexUpperSegment)) // (e).
                    {
                        lMerger[lMergerIndex++] = { index: pImage.getIndex(lIndexLowerSegment), colour: pImage.getPixelColour(lIndexLowerSegment++) };
                        // lMerger[lMergerIndex++] = pImage.elements[lIndexLowerSegment++];
                    }
                    else // (f).
                    {
                        lMerger[lMergerIndex++] = { index: pImage.getIndex(lIndexUpperSegment), colour: pImage.getPixelColour(lIndexUpperSegment++) };
                        // lMerger[lMergerIndex++] = pImage.elements[lIndexUpperSegment++];
                    }
                    
                }
                else if (lIndexLowerSegment <= aMid) // (g).
                {
                    lMerger[lMergerIndex++] = { index: pImage.getIndex(lIndexLowerSegment), colour: pImage.getPixelColour(lIndexLowerSegment++) };
                    // lMerger[lMergerIndex++] = pImage.elements[lIndexLowerSegment++];
                }
                else if (lIndexUpperSegment <= aEnd) // (h).
                {
                    lMerger[lMergerIndex++] = { index: pImage.getIndex(lIndexUpperSegment), colour: pImage.getPixelColour(lIndexUpperSegment++) };
                    // lMerger[lMergerIndex++] = pImage.elements[lIndexUpperSegment++];
                }
                else // (i).
                {
                    break;
                }
                
            }

            // Copy the values from lMerger into the appropriate indexes of pElements.
            for (let i = aStart; i <= aEnd; ++i) 
            { 
                pImage.setValue(i, lMerger[i - aStart].index, lMerger[i - aStart].colour);
                // pElements.SetElementColour(i, lColourMerged, true);
            }
        }

        const SplitAndMerge = (pImage, aStart, aEnd) => 
        {
            if (aStart >= aEnd)
            { return; }

            // Calculate the middle index.
            let lMid = Math.floor((aStart + aEnd) / 2);

            // Split and merge the lower half of the current segment (aStart to lMid).
            // Once this returns, said lower half will have been sorted.
            SplitAndMerge(pImage, aStart, lMid);
            
            // Continue to split and merge the upper half of the current segment (lMid + 1 to aEnd).
            // Once this returns, said upper half will have been sorted.
            SplitAndMerge(pImage, lMid + 1, aEnd);

            // Combine the lower (aStart to lMid) and upper (lMid + 1 to aEnd) segments which, individually, are sorted.
            Merge(pImage, aStart, lMid, aEnd);
        }

        SplitAndMerge(pImage, 0, pImage.length - 1);

        // Load the snapshot to undo the changes.
        pImage.loadSnapshot();
    },

    MergeSortIterative(pImage, pAscending)
    {
        // Take a snapshot of the elements.
        pImage.saveSnapshot();

        const lOperator = pAscending ? utils.compOps.LE : utils.compOps.GE;

        const Merge = (pImage, aStart, aMid, aEnd) =>
        {
            // Create a temporary container to house the merged segment.
            const lSizeOfMerger = aEnd - aStart + 1; // Size of merged segment.
            let lMerger = Array(lSizeOfMerger); // Array to hold the merged values of lower and upper segments.

            // (a). The current indexes of the lower and upper segments, respectively.
            let lIndexLowerSegment = aStart;
            let lIndexUpperSegment = aMid + 1;

            // (b). The 'current' index of lMerger.
            let lMergerIndex = 0;
            
            // The purpose of this while loop is to populate lMerger with all elements from lower and upper segments.
            while (true) // (c).
            {
                if (lIndexLowerSegment <= aMid && lIndexUpperSegment <= aEnd) // (d).
                {
                    if (pImage.compare(lIndexLowerSegment, lOperator, lIndexUpperSegment)) // (e).
                    {
                        lMerger[lMergerIndex++] = { index: pImage.getIndex(lIndexLowerSegment), colour: pImage.getPixelColour(lIndexLowerSegment++) };
                        // lMerger[lMergerIndex++] = pImage.elements[lIndexLowerSegment++];
                    }
                    else // (f).
                    {
                        lMerger[lMergerIndex++] = { index: pImage.getIndex(lIndexUpperSegment), colour: pImage.getPixelColour(lIndexUpperSegment++) };
                        // lMerger[lMergerIndex++] = pImage.elements[lIndexUpperSegment++];
                    }
                    
                }
                else if (lIndexLowerSegment <= aMid) // (g).
                {
                    lMerger[lMergerIndex++] = { index: pImage.getIndex(lIndexLowerSegment), colour: pImage.getPixelColour(lIndexLowerSegment++) };
                    // lMerger[lMergerIndex++] = pImage.elements[lIndexLowerSegment++];
                }
                else if (lIndexUpperSegment <= aEnd) // (h).
                {
                    lMerger[lMergerIndex++] = { index: pImage.getIndex(lIndexUpperSegment), colour: pImage.getPixelColour(lIndexUpperSegment++) };
                    // lMerger[lMergerIndex++] = pImage.elements[lIndexUpperSegment++];
                }
                else // (i).
                {
                    break;
                }
                
            }

            // Copy the values from lMerger into the appropriate indexes of pElements.
            for (let i = aStart; i <= aEnd; ++i) 
            { 
                pImage.setValue(i, lMerger[i - aStart].index, lMerger[i - aStart].colour);
                // pElements.SetElementColour(i, lColourMerged, true);
            }
        }

        // (a).
        let l_segment_size; // Current size of segment to split and merge (range: 2 to l_max_segment_size).
        let l_start; // First index of segment (first index of lower half).
        let l_mid; // Middle index of segment (last index of lower half, first index of lower half).
        let l_end; // Last index of segment (last index of upper half).

        // (b). Not necessary to make these variables, but it does help with readability.
        let l_container_max_index = pImage.length - 1;
        let l_container_size = pImage.length;

        // (c). Calculate and store the maximum length of a segment.
        let l_max_segment_size = 1;
        while (l_max_segment_size < l_container_size)
        { l_max_segment_size *= 2; }

        for (l_segment_size = 2; l_segment_size <= l_max_segment_size; l_segment_size *= 2) // (d).
        {
            for (l_start = 0; l_start <= l_container_max_index - Math.floor(l_segment_size / 2); l_start += l_segment_size) // (e).
            {
                // (f). Calculate middle index of segment lStart to lEnd (max index of lower half).
                l_mid = l_start + Math.floor((l_segment_size / 2)) - 1;

                // (g). Calculate max index of segment lStart to lEnd (max index of upper half).
                let l_end_candidate = l_start + l_segment_size - 1;
                if (l_end_candidate < l_container_max_index)
                {
                    l_end = l_end_candidate;
                }
                else
                {
                    l_end = l_container_max_index;
                }

                // Combine the lower (lStart to lMid) and upper (lMid + 1 to lEnd) halves of the current segment.
                Merge(pImage, l_start, l_mid, l_end);
            }
            
        }

        // Load the snapshot to undo the changes.
        pImage.loadSnapshot();
    },

    HeapSort(pImage, pAscending, pSort = true)
    {
        // Take a snapshot of the elements.
        pImage.saveSnapshot();

        const MaxHeapify = (aIndexLastNode, aIndexParentNode) => 
        {
            // (a).
            let lIndexMaxValue = aIndexParentNode;

            // (b).
            let lIndexLeftChild = 2 * aIndexParentNode + 1;
            let lIndexRightChild = 2 * aIndexParentNode + 2;

            if (lIndexLeftChild <= aIndexLastNode) // (c). If valid index.
            {
                // Reassign the max index if the left child's value is higher than that of its parent.
                if (pImage.compare(lIndexLeftChild, utils.compOps.G, lIndexMaxValue))
                {
                    lIndexMaxValue = lIndexLeftChild;
                }

            }

            if (lIndexRightChild <= aIndexLastNode) // (c). If valid index.
            {
                // Reassign the max index if the right child's value is higher than that of the current max.
                if (pImage.compare(lIndexRightChild, utils.compOps.G, lIndexMaxValue))
                {
                    lIndexMaxValue = lIndexRightChild;
                }
            }

            if (lIndexMaxValue != aIndexParentNode) // (d).
            {
                // Swap value of current parent with that of its highest-value child (whose value is higher than its). 
                pImage.swap(lIndexMaxValue, aIndexParentNode);

                MaxHeapify(aIndexLastNode, lIndexMaxValue); // (e).
            }

        }

        const MinHeapify = (aIndexLastNode, aIndexParentNode) => 
        {
            // (a).
            let lIndexMinValue = aIndexParentNode;

            // (b).
            let lIndexLeftChild = 2 * aIndexParentNode + 1;
            let lIndexRightChild = 2 * aIndexParentNode + 2;

            if (lIndexLeftChild <= aIndexLastNode) // (c). If valid index.
            {
                // Reassign the max index if the left child's value is higher than that of its parent.
                if (pImage.compare(lIndexLeftChild, utils.compOps.L, lIndexMinValue))
                {
                    lIndexMinValue = lIndexLeftChild;
                }

            }

            if (lIndexRightChild <= aIndexLastNode) // (c). If valid index.
            {
                // Reassign the max index if the right child's value is higher than that of the current max.
                if (pImage.compare(lIndexRightChild, utils.compOps.L, lIndexMinValue))
                {
                    lIndexMinValue = lIndexRightChild;
                }
                
            }

            if (lIndexMinValue != aIndexParentNode) // (d).
            {
                // Swap value of current parent with that of its highest-value child (whose value is higher than its). 
                pImage.swap(lIndexMinValue, aIndexParentNode);

                MinHeapify(aIndexLastNode, lIndexMinValue); // (e).
            }

        }


        let lIndexLowestParentNode = Math.floor((pImage.length / 2) - 1);

        for (let i = lIndexLowestParentNode; i >= 0; --i)
        {
            pAscending ? MaxHeapify(pImage.length - 1, i) : 
                         MinHeapify(pImage.length - 1, i);
        }

        if (pSort)
        {
            for (let lIndexLastNode = pImage.length - 1; lIndexLastNode >= 0;)
            {
                pImage.swap(0, lIndexLastNode);

                pAscending ? MaxHeapify(--lIndexLastNode, 0) :
                             MinHeapify(--lIndexLastNode, 0);
            }
        }

        // Load the snapshot to undo the changes.
        pImage.loadSnapshot();
    },

    ShellSort(pImage, pAscending)
    {
        // Take a snapshot of the elements.
        pImage.saveSnapshot();
        // source: https://www.geeksforgeeks.org/shellsort/

        // The operator to use in the while loop's condition.
        const lOperator = pAscending ? utils.compOps.G : utils.compOps.L;

        let n = pImage.length;
    
        /*
        * Perform insertion sort on all sublists of pElements where each sublist is comprised of elements of pElements that
        are 'gap' indexes apart from each other.
        */
        for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap / 2))
        {
            // The maximum index (which is an index of pElements) of the current sublist.
            let lIndexMaxSubList = gap;

            /*
            * Each iteration of this for loop performs an insertion sort on one of the sublists. 
            * A sublist's size, given by lIndexMaxSubList, is increased by 1 every time it is iterated over.
            * Each successive iteration of the loop focuses on a different sublist. Each sublist is iterated over several 
            times (equal to its (final) length minus 1).
            * Each sublist mustn't contain the same element as another sublist.
            * The number of elements in a sublist is, at most, n / gap (s = n /gap); the number of sublists is n / s.
            */
            for (; lIndexMaxSubList < n; ++lIndexMaxSubList)
            {
                const lValueToInsert = { index: pImage.getIndex(lIndexMaxSubList), colour: pImage.getPixelColour(lIndexMaxSubList) };

                // The index of the sublist at which lValueToInsert will be inserted.
                let lIndexOfInsert = lIndexMaxSubList;

                // The lowest index of the sublist.
                let lIndexMinSublist = lIndexMaxSubList % gap;

                for (; lIndexOfInsert > lIndexMinSublist && pImage.compareValue(lIndexOfInsert - gap, lOperator, lValueToInsert.index); 
                    lIndexOfInsert -= gap)
                {
                    pImage.setValue(lIndexOfInsert, pImage.getIndex(lIndexOfInsert - gap), pImage.getPixelColour(lIndexOfInsert - gap));
                }

                pImage.setValue(lIndexOfInsert, lValueToInsert.index, lValueToInsert.colour);
            }

        }

        // Load the snapshot to undo the changes.
        pImage.loadSnapshot();
    }
};

// Add an algorithm which just gets the list into heap form (doesn't actually sort).
sortAlgos.Heapify = function(pImage, pAscending)
{
    sortAlgos.HeapSort(pImage, pAscending, false);
};

// The names of the sorting algorithms.
const sortAlgoNames = [
    "QUICK",
    "MERGE",
    "MERGE ITERATIVE",
    "HEAP",
    "SHELL",
    "HEAPIFY"
];

const sortAlgos2 = {
    "QUICK": sortAlgos.QuickSortRandomPivot,
    "MERGE": sortAlgos.MergeSort,
    "MERGE ITERATIVE": sortAlgos.MergeSortIterative,
    "HEAP": sortAlgos.HeapSort,
    "SHELL": sortAlgos.ShellSort,
    "HEAPIFY": sortAlgos.Heapify
}


// The ranges used for the sliders.
const ranges = {

    // The min and max sorting speed.
    speed: { min: 100,  max: 10000 },

    // The maximum number of pixels.
    size: 250000
}

export { sortAlgoNames, sortAlgos2 as sortAlgos, ranges };