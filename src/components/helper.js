export function getLast(arr) {
    return arr[arr.length-1];
}

export function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomNumber(range) {
    return Math.floor(Math.random() * range);
}


export function stringSplice(string, pos, newString) {
    return string.slice(0, pos) + newString + string.slice(pos);
}

export function coinFlipHeads() {
    return getRandomNumber(2) === 0;
}