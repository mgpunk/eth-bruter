const fs = require("fs");
const { ethers } = require("ethers");

let tries = 0, hits = 0;
let currentFileIndex = 1;
const delay = time => new Promise(res => setTimeout(res, time));
const words = fs.readFileSync("bip39.txt", { encoding: 'utf8', flag: 'r' }).replace(/(\r)/gm, "").toLowerCase().split("\n");
const usedMnemonics = new Set();

function gen12(words) {
    const n = 24;
    const shuffled = words.slice(); // Create a copy of the array
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled.slice(0, n).join(" ");
}

console.log("starting....");

async function doCheck() {
    tries++;
    try {
        let mnemonic;
        do {
            mnemonic = gen12(words);
        } while (usedMnemonics.has(mnemonic));
        
        usedMnemonics.add(mnemonic);

        const wallet = ethers.Wallet.fromMnemonic(mnemonic);
        const filename = `hits.${currentFileIndex}.txt`;
        fs.appendFileSync(filename, wallet.address + "," + wallet.privateKey + "\n");
        process.stdout.write("+");
        if (++hits % 10000 === 0) {
            currentFileIndex++;
        }
    } catch (e) {
        console.error("Error occurred: ", e);
    }
    await delay(0); // Prevent Call Stack Overflow
    process.stdout.write("-");
    if (hits >= 100000000) { // End the process after 100000 hits
        console.log("Process completed.");
        process.exit(0);
    }
    doCheck();
}

doCheck();

