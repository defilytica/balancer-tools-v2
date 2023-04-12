/**
 * Finds the root of the given function using the Newton-Raphson method.
 *
 * @param f The function to find the root of.
 * @param df The derivative of the function f.
 * @param x0 The initial guess for the root.
 * @param tol The tolerance level.
 * @param maxIterations The maximum number of iterations to perform.
 * @returns The approximate root of the function.
 * @throws If the method does not converge to a root within the specified number of iterations.
 */
 export function newtonRaphson(
    // D * (ampCoefficient * numAssets^numAssets * sumAssets + numAssets * D^(numAssets + 1) / (numAssets ** numAssets * prodOfAssetBalances))
    f: (x: number) => number,
    // D * (ampCoefficient * numAssets ** numAssets - 1) + D ** (numAssets + 1) * (numAssets +1 ) / (numAssets ** numAssets * prodOfAssetBalances)
    df: (x: number) => number,
    x0: number,
    tol: number = 1e-6,
    maxIterations: number = 6
  ): number {
    let x = x0;
    let i = 0;
  
    while (i < maxIterations) {
      const fVal = f(x);
      const dfVal = df(x);
  
      if (Math.abs(fVal) < tol) {
        // The root has been found
        return x;
      }
  
      if (dfVal === 0) {
        // The derivative is zero, so we can't continue with this method
        throw new Error("Derivative is zero");
      }
  
      // Calculate the next approximation
      const dx = -fVal / dfVal;
      x += dx;
  
      i++;
    }
  
    // The method did not converge to a root within the specified number of iterations
    throw new Error("Method did not converge");
  }
  