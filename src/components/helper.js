export function getLast(arr) {
    return arr[arr.length-1];
}

export function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomNumber(range) {
    return Math.floor(Math.random() * range);
}