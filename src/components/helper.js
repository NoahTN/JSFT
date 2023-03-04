export function getLast(arr) {
    return arr[arr.length-1];
}

export function getSlice(arr, start, offset) {
    return arr.slice(start, arr.length-offset);
}

export function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomNumber(range) {
    return Math.floor(Math.random() * range);
}