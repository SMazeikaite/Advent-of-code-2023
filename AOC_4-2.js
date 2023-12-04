const fs = require("fs");
const originalCards = [];

fs.readFile("AOC_4_input.txt", (err, input) => {
    if (err) throw err;

    const cards = input.toString().split('\r\n');

    cards.forEach((card, cIndex) => {
        let [winningNumbers, ticketNumbers] = card.replace(/Card\s\d\:\s+/g, '').split('|');
        winningNumbers = winningNumbers.split(' ').filter(f => f !== '');
        ticketNumbers = ticketNumbers.split(' ').filter(f => f !== '');

        const compare = (a1, a2) => a1.reduce((a, c) => a + a2.includes(c), 0);
        const matchedCards = compare(winningNumbers, ticketNumbers);

        originalCards.push({
            cardNo: cIndex + 1,
            matched: matchedCards
        });
    });

    const onlyMatchedCards = originalCards.filter(c => c.matched > 0);
    const copiedScratchcardResult = onlyMatchedCards.reduce((partialSum, a) => calculateMatched(a) + partialSum, 0);

    const result = copiedScratchcardResult + originalCards.length;
    console.log('result: ', result);
});

function calculateMatched(card) {
    let wonCards = 0;
    for (let i = card.cardNo + 1 ; i < card.cardNo + 1 + card.matched; i++) {
        wonCards += calculateMatched(originalCards[i-1]) + 1;
    }
    return wonCards;
}
