const fs = require("fs");

fs.readFile("AOC_4_input.txt", (err, input) => {
    if (err) throw err;

    const cards = input.toString().split('\r\n');
    let result = 0;

    cards.forEach((card) => {
        let [winningNumbers, ticketNumbers] = card.replace(/Card\s\d\:\s+/g, '').split('|');
        winningNumbers = winningNumbers.split(' ').filter(f => f !== '');
        ticketNumbers = ticketNumbers.split(' ').filter(f => f !== '');

        let compare = (a1, a2) => a1.reduce((a, c) => a + a2.includes(c), 0);
        
        const matched = compare(winningNumbers, ticketNumbers);
        result += matched > 1 ? (2 ** (matched - 1)) : 1;
    });

    console.log('result:', result);
});
