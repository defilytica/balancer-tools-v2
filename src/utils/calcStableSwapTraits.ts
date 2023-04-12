  //Step 1: Map assets by name and traits
  //Step 2: For loop to get necessary values
  //Step 3: Calculate Spot Price, Effective Price, Price Impact, TokensOut

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
    const assetsByName = new Map<string, { assetBalance: number; assetRateProvider: number; poolWeights: number }>();
    let tokenInBalance = 0;
    let tokenInWeight = 0;
    let tokenOutBalance = 0;
    let tokenOutWeight = 0;
    let swapFee = SwapFee / 100;
    let tokenPair = buyToken + " / " + sellToken;
  
    for (const asset of assetArray) {
      const { assetName, assetBalance, assetRateProvider, poolWeights } = asset;
      assetsByName.set(assetName, { assetBalance, assetRateProvider, poolWeights });
      if (assetName === sellToken) {
        tokenInBalance += assetBalance * assetRateProvider;
        tokenInWeight += poolWeights / 100;
      } else if (assetName === buyToken) {
        tokenOutBalance += assetBalance * assetRateProvider;
        tokenOutWeight += poolWeights / 100;
      }
    }
  
    const tokenInRate = tokenInBalance / tokenInWeight;
    const tokenOutRate = tokenOutBalance / tokenOutWeight;
    const spotPrice = Number(tokenInRate / tokenOutRate);

    // For effective price we will be using (1-SwapFee) * TokensIn to access fees
    const tokensWithoutPI = 1 / spotPrice * sellTokenQuantity;
    const effectivePriceDenominator = tokenOutBalance * (1 - (tokenInRate / (tokenInRate + (1 - swapFee) * sellTokenQuantity)) ** (tokenInWeight / tokenOutWeight));
    const effectivePrice = Number((1 - swapFee) * sellTokenQuantity / effectivePriceDenominator);
  
    const priceImpact = Number(((effectivePrice / spotPrice - 1) * 100));
  
    const tokensWithPI = 1 / effectivePrice * sellTokenQuantity;
  
    let data = [{
      tokenPair: tokenPair,
      spotPrice: spotPrice,
      effectivePrice: effectivePrice,
      tokensWithoutPI: tokensWithoutPI,
      tokensWithPI: tokensWithPI
    }];
  
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