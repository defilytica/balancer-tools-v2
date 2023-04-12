export function calculateWeightedSwapTraitsWithTable(
  assetArray: {
    assetName: string;
    assetBalance: number;
    assetRateProvider: number;
    poolWeights: number;
  }[],
  sellToken: string,
  sellTokenQuantity: number,
  buyToken: string,
  SwapFee: number
): [string, number, number, number, number, number, any[]] {
  const copy = [...assetArray];

  //Step 1: Search array for buy and sell token names and traits
  //Step 2: Calculate Spot Price
  //Step 3: Calculate Effective Price
  //Step 4: Price impact

  let tokenInBalance = 0;
  let tokenInWeight = 0;
  let tokenOutBalance = 0;
  let tokenOutWeight = 0;
  let swapFee = SwapFee / 100;
  let tokenPair = buyToken + " / " + sellToken;

  // Using rate providers here yield Virtual Balances in the case a yield bearing asset is in a weighted pool.
  for (let i = 0; i < copy.length; i++) {
    tokenInBalance +=
      copy[i].assetName === sellToken
        ? Number(copy[i].assetBalance * copy[i].assetRateProvider)
        : 0;
    tokenInWeight +=
      copy[i].assetName === sellToken
        ? Number(copy[i].poolWeights) / 100
        : 0;
  }

  for (let i = 0; i < copy.length; i++) {
    tokenOutBalance +=
      copy[i].assetName === buyToken
        ? Number(copy[i].assetBalance * copy[i].assetRateProvider)
        : 0;
    tokenOutWeight +=
      copy[i].assetName === buyToken
        ? Number(copy[i].poolWeights / 100)
        : 0;
  }

  let spotPrice = Number(
    (tokenInBalance / tokenInWeight) / (tokenOutBalance / tokenOutWeight)
  );

  // For effective price we will be using (1-SwapFee) * TokensIn to access fees
  // Will need to run unit tests when we incorporate Rate Providers fully.
  let effectivePrice = Number(
    (1 - swapFee) *
      sellTokenQuantity /
      (tokenOutBalance *
        (1 -
          (tokenInBalance /
            (tokenInBalance + (1 - swapFee) * sellTokenQuantity)) **
            (tokenInWeight / tokenOutWeight)))
  );

  let priceImpact = Number(((effectivePrice / spotPrice - 1) * 100));

  //Calculate table data
  function createDataPI(
    tokenPair: string,
    spotPrice: number,
    effectivePrice: number,
    tokensWithoutPI: number,
    tokensWithPI: number
  ) {
    return { tokenPair, spotPrice, effectivePrice, tokensWithoutPI, tokensWithPI };
  }

  let tokensWithoutPI = 1 / spotPrice * sellTokenQuantity;
  let tokensWithPI = 1 / effectivePrice * sellTokenQuantity;
  let info = createDataPI(tokenPair, spotPrice, effectivePrice, tokensWithoutPI, tokensWithPI);
  let data = [info];

  return [
    tokenPair,
    spotPrice,
    effectivePrice,
    tokensWithoutPI,
    tokensWithPI,
    priceImpact,
    data
  ];
}