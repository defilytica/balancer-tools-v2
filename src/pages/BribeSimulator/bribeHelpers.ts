export function calculateAPR(bribeValue: number, poolTotalValue: number, emissionPerVote: number, incentivePerVote: number) {
    // initializes APR
    let APR = 0.0;
    let emmissionsROI = 1 + (emissionPerVote - incentivePerVote) / emissionPerVote

    if (Number(bribeValue)) {
        APR = Number(bribeValue * emmissionsROI * 26 / poolTotalValue * 100);
    }

     return Number(APR).toFixed(2);
 }


 export function calculateBribeValue(targetAPR: number, poolTotalValue: number, emissionPerVote: number, incentivePerVote: number) {
    // initializes APR
    let bribeValue = 0.0;
    let emmissionsROI = 1 + (emissionPerVote - incentivePerVote) / emissionPerVote

    if (Number(targetAPR)) {
        bribeValue = targetAPR * poolTotalValue / emmissionsROI / 100 / 26;
    }

     return Number(bribeValue).toFixed(2);
 }