const fs = require("fs");

fs.readFile("AOC_3_input.txt", (err, data) => {
    if (err) throw err;

    const specialChar = "*";
    const schema = data.toString().split('\r\n');
    let sumResult = 0;
    let log = '';
    let schemmaArray = [];
    const indices = [];

    schema.forEach((schemaLine) => {
        const allChars = schemaLine.split('');
        schemmaArray.push(allChars);

    });

    schema.forEach((schemaLine, schemaLineIndex) => {
        schemaLine.split('').forEach((char, charIndex) => {

            // CHECK SPECIAL CHARS
            if (specialChar.includes(char)) {

                if (schemaLineIndex > 0) {
                    const topSpot = schemmaArray[schemaLineIndex-1][charIndex];
                    const topLeftSpot = schemmaArray[schemaLineIndex-1][charIndex-1];
                    const topRightSpot = schemmaArray[schemaLineIndex-1][charIndex+1];
    
                    isNumeric(topSpot) && indices.push(`${schemaLineIndex-1}:${charIndex}-${schemaLineIndex}:${charIndex}`);
                    isNumeric(topLeftSpot) && indices.push(`${schemaLineIndex-1}:${charIndex-1}-${schemaLineIndex}:${charIndex}`);
                    isNumeric(topRightSpot) && indices.push(`${schemaLineIndex-1}:${charIndex+1}-${schemaLineIndex}:${charIndex}`);
                }
                if (charIndex > 0) {
                    const leftSpot = schemmaArray[schemaLineIndex][charIndex - 1];
                    isNumeric(leftSpot) && indices.push(`${schemaLineIndex}:${charIndex-1}-${schemaLineIndex}:${charIndex}`);
                }
                if (charIndex < schemaLine.length - 1) {
                    const rightSpot = schemmaArray[schemaLineIndex][charIndex + 1];
                    isNumeric(rightSpot) && indices.push(`${schemaLineIndex}:${charIndex+1}-${schemaLineIndex}:${charIndex}`);
                }
                if (schemaLineIndex < schema.length - 1) {
                    const bottomSpot = schemmaArray[schemaLineIndex+1][charIndex];
                    const bottomLeftSpot = schemmaArray[schemaLineIndex+1][charIndex-1];
                    const bottomRightSpot = schemmaArray[schemaLineIndex+1][charIndex+1];
    
                    isNumeric(bottomSpot) && indices.push(`${schemaLineIndex+1}:${charIndex}-${schemaLineIndex}:${charIndex}`);
                    isNumeric(bottomLeftSpot) && indices.push(`${schemaLineIndex+1}:${charIndex-1}-${schemaLineIndex}:${charIndex}`);
                    isNumeric(bottomRightSpot) && indices.push(`${schemaLineIndex+1}:${charIndex+1}-${schemaLineIndex}:${charIndex}`);
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

    const grouped = groupBy(numbers, 'specialCharCoordinates');
    Object.values(grouped).forEach(group => {
        if (group.length === 2) {
            sumResult += group[0].number * group[1].number;
        }
    });

    fs.writeFile("AOC_3_result.txt", log, (err) => {
        if (err) throw err;
        console.log("The file was succesfully saved!");
    });

    function groupBy(arr, property) {
        return arr.reduce(function (memo, x) {
            if (!memo[x[property]]) { memo[x[property]] = []; }
            memo[x[property]].push(x);
            return memo;
        }, {});
    };

    function isNumeric(s) {
        return !isNaN(s - parseFloat(s));
    }

    function findNumberAndPosition(numIndex, schemaList) {
        const [numData, specialData] = numIndex.split('-');
        const [rowId, columnStr] = numData.split(':');
        const colId = parseInt(columnStr);
        const row = schemaList[rowId];

        let start = colId;
        let end = colId;

        while (start > 0 && /\d/.test(row[start - 1])) start--;
        while (end < row.length && /\d/.test(row[end])) end++;

        const numberStr = row.substring(start, end);

        return [...numberStr.matchAll(/\d+/g)].map(match => ({
            number: Number(match[0]),
            row: Number(rowId),
            startPosition: start + match.index,
            endPosition: end + match.index - 1,
            specialCharCoordinates: specialData
        }));
    }
});
