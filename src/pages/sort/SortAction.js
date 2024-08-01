/*
* For the image one, could create a separate array of the same size as the image. The array of actions has a maximum 
  size, say 100000. Whenever the end of the array is reached, the current set of actions are removed and another set of 
  actions are loaded (a max of 100000). This way we can keep the same architecture as the simple bar graph one. The user
  could potentially go back a certain distance as well. In order to load the actions, the sort process would have to be
  run from the beginning, or the sort process would have to be paused and then unpaused when we need more actions. Not 
  sure how we would just 'pause' the sort process though from another process, and then wait for the actions to be 
  populated before continuing the process. It'd essentially be two sort processes being run in parallel, with one sort
  process running over a section of the sort first, and the other catching up. Not sure how to do that efficiently.
*/
class SortAction
{
    /*
    * The types of actions:
        > Swap: Swapping the values at two indexes.
        > Set: Setting the value at a particular index.
        > Compare: Comparing the values at two indexes.
    */
    static Type = {
        Swap: "0",
        Set: "1",
        Compare: "2"
    };

    // The type of action (should be a value of SortAction.Type)
    fType;

    /*
    * if #fType is either Type.Swap or Type.Compare
        - The index to swap/compare to the other index (#fValueB).
      else if #fType is Type.Set
        - The index at which to store the given value (#fValueB).
    */
    fValueA;

    /*
    * if #fType is either Type.Swap or Type.Compare
        - The index to swap/compare to the other index (#fValueA).
      else if #fType is Type.Set
        - The value to set at the given index (#fValueA).
    */
    fValueB;

    /*
    * if #fType is either Type.Swap or Type.Compare
        - undefined
      else if #fType is Type.Set
        - The colour at which to set at the corresponding index.
    */
    fValueC;

    constructor(pType = "", pValueA = 0, pValueB = 0, pValueC = "")
    {
        this.fType = pType;
        this.fValueA = pValueA;
        this.fValueB = pValueB;
        this.fValueC = pValueC;
    }

    get type() { return this.fType; }

    get valueA() { return this.fValueA; }
    set valueA(pValueA) { this.fValueA = pValueA; }

    get valueB() { return this.fValueB; }
    set valueB(pValueB) { this.fValueB = pValueB; }

    get valueC() { return this.fValueC; }
    set valueC(pValueC) { this.fValueC = pValueC; }
}

export default SortAction;