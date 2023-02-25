export function getLast(arr) {
    return arr[arr.length-1];
}

export function getSlice(arr, start, offset) {
    return arr.slice(start, arr.length-offset);
}