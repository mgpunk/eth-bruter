const fs = require('fs');
const ethers = require('ethers');
const readline = require('readline');
require('colors');

const provider = new ethers.providers.WebSocketProvider(
    'wss://go.getblock.io/bbcea3ee1432440d9d550e65eadc0fb5'
);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the path to hits.txt file: ', async (filePath) => {
    const addresses = fs
        .readFileSync(filePath, 'utf8')
        .split('\n')
        .map((val) => {
            return val.split(',');
        });

    let checkedCount = 0; // Counter for checked addresses

    for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i][0];
        const balance = await provider.getBalance(address);

        checkedCount++; // Increment the counter for each address checked

        if (balance.gt(0)) {
            console.log(`[${checkedCount}]`, address.bgGreen.black, balance.toString().bgGreen.black);
            console.log('Private Key: '.yellow, addresses[i][1]);
        } else {
            console.log(`[${checkedCount}]`, address, 0);
        }
    }

    rl.close();
});
