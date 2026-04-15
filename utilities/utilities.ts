import { assert } from "node:console";

class GeneralUtilities {
  /**
   * Check the sorting of an array
   * @param inputArray
   * @param sortType
   */
  checkArraySorting(inputArray: any[], sortType: "ascending" | "descending") {
    for (let i = 0; i <= inputArray.length - 2; i++) {
      if (sortType === "ascending") {
        assert(inputArray[i] <= inputArray[i + 1]);
      } else if (sortType === "descending") {
        assert(inputArray[i] >= inputArray[i + 1]);
      }
    }
  }
}

export default GeneralUtilities;
