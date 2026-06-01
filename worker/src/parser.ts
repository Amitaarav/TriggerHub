export const parse = (body: string, zapMetadata: any, startDelimeter = "{", endDelimeter = "}"  ) => {
    // You have received {comment.amount} money form {comment.link}
    let startIndex = 0;
    let endIndex = 1;
    let finalString = "";
    while(endIndex < body.length){
        if(body[startIndex] === startDelimeter){
            let endPointer = startIndex + 2;
            while(body[endPointer] !== endDelimeter){
                endPointer++;
            }
            // enpointer located at the "}"

            let stringHoldingValue = body.slice(startIndex+1, endPointer); // comment.amount
            const keys = stringHoldingValue.split("."); // keys : amount

            let localValues = {
                ...zapMetadata, // include all previous valuesof zapMetadata
            }

            for(let key of keys){
                if(typeof localValues === "string"){
                    localValues = JSON.parse(localValues);
                }
                localValues = localValues[key]; // localvalues[amount]
            }
            finalString += localValues; // amount
            startIndex = endPointer + 1;
            endPointer = endPointer + 2;
        }
        else{
            finalString += body[startIndex];
            startIndex++;
            endIndex++;
        }
    }
    if(body[startIndex]){
        finalString += body[startIndex];
    }
    return finalString;
}