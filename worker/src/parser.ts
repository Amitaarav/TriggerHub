export const parse = (body: string, zapMetadata: any, startDelimeter = "{", endDelimeter = "}"  ) => {
    // You have received {comment.amount} money form {comment.link}
    let startIndex = 0;
    let endIndex = 1;
    let finalString = "";
    while(endIndex < body.length){
        if(body[startIndex] === startDelimeter){
            let endPointer = startIndex + 2;
            while(body[endIndex] !== endDelimeter){
                endPointer++;
            }
            let stringHoldingValue = body.slice(startIndex+1, endPointer);
            const keys = stringHoldingValue.split(".");
            let localValues = {
                ...zapMetadata,
            }
            for(let key of keys){
                if(typeof localValues === "string"){
                    localValues = JSON.parse(localValues);
                }
                localValues = localValues[key];
            }
            finalString += localValues;
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