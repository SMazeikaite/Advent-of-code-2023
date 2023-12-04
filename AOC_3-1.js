const fs = require("fs");

fs.readFile("AOC_3_input.txt", (err, data) => {
    if (err) throw err;

    const specialChar = "~!@#$%^&*_-+=`|(){}[]:;\"'<>,?/";
    const schema = data.toString().split('\r\n');
    const indices = [];
    let sumResult = 0;
    let schemmaArray = [];

    schema.forEach((schemaLine, schemaLineIndex) => {
        const allChars = schemaLine.split('');
        schemmaArray.push(allChars);

        schemaLine.split('').forEach((char, charIndex) => {
            const boundaries = {
                top: schemaLineIndex > 0,
                left: charIndex > 0,
                right: charIndex < schemaLine.length - 1
            }

            let isNumber = isNumeric(char);

            // CHECK SPECIAL CHARS
            if (specialChar.includes(char) && schemaLineIndex > 0) {
                const topSpot = schemmaArray[schemaLineIndex-1][charIndex];
                const topLeftSpot = schemmaArray[schemaLineIndex-1][charIndex-1];
                const topRightSpot = schemmaArray[schemaLineIndex-1][charIndex+1];

                isNumeric(topSpot) && indices.push(`${schemaLineIndex-1}:${charIndex}`);
                isNumeric(topLeftSpot) && indices.push(`${schemaLineIndex-1}:${charIndex-1}`);
                isNumeric(topRightSpot) && indices.push(`${schemaLineIndex-1}:${charIndex+1}`);
            }

            // CHECK NUMBERS
            if (isNumber) {     
                if (boundaries.top) {
                    const topSpot = schemmaArray[schemaLineIndex-1][charIndex];
                    const topLeftSpot = schemmaArray[schemaLineIndex-1][charIndex-1];
                    const topRightSpot = schemmaArray[schemaLineIndex-1][charIndex+1];
                    const includes = specialChar.includes(topSpot) || specialChar.includes(topLeftSpot) || specialChar.includes(topRightSpot);
                    if (includes) {
                        indices.push(`${schemaLineIndex}:${charIndex}`);
                    }
                }
                if (boundaries.left) {
                    const leftSpot = schemmaArray[schemaLineIndex][charIndex - 1];
                    const includes = specialChar.includes(leftSpot)
                    if (includes) {
                        indices.push(`${schemaLineIndex}:${charIndex}`);
                    }
                }
                if (boundaries.right) {
                    const rightSpot = schemmaArray[schemaLineIndex][charIndex + 1];
                    const includes = specialChar.includes(rightSpot)
                    if (includes) {
                        indices.push(`${schemaLineIndex}:${charIndex}`);
                    }
                }
            }

        }); 
    });

    const numbers = [];
    indices.forEach((numIndex, i) => {
        const foundNumbers = findNumberAndPosition(numIndex, schema);
        foundNumbers.forEach((foundNo) => {
            const filtered = numbers.filter(num => num.number === foundNo.number && num.row === foundNo.row && num.position === foundNo.position);
            if(filtered.length === 0) {
                numbers.push(foundNo);
                console.log(foundNo);
            }
        })
    });

    numbers.forEach(num => {
        sumResult += num.number;
    });
});

function isNumeric(s) {
    return !isNaN(s - parseFloat(s));
}

function findNumberAndPosition(numIndex, schemaList) {
    const [rowId, columnStr] = numIndex.split(':');
    const columnId = parseInt(columnStr);
    const row = schemaList[rowId];

    let start = columnId;
    let end = columnId;

    while (start > 0 && /\d/.test(row[start - 1])) start--;
    while (end < row.length && /\d/.test(row[end])) end++;

    const numberStr = row.substring(start, end);

    return [...numberStr.matchAll(/\d+/g)].map(match => ({
        number: Number(match[0]),
        row: Number(rowId),
        position: start + match.index
    }));
}