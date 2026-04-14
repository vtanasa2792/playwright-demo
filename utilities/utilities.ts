import { expect } from "@playwright/test";

class GeneralUtilities {
  /**
   * Check the sorting of an array
   * @param inputArray
   * @param sortType
   */
  checkArraySorting(inputArray: any[], sortType: "ascending" | "descending") {
    for (let i = 0; i <= inputArray.length - 2; i++) {
      if (sortType === "ascending") {
        expect(inputArray[i] <= inputArray[i + 1]).toBe(true);
      } else if (sortType === "descending") {
        expect(inputArray[i] >= inputArray[i + 1]).toBe(true);
      }
    }
  }
}

export default GeneralUtilities;
