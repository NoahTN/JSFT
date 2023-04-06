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

export function formatOutput(words) {
    // // Maybe custom breakpoints too for subject, object, etc.
    
    
    let children = [];
    //let breakpoints = {words: [], romaji: []};
    let indices = {};
    let types = [];
    let set = new Set();
    let i = 0;
    for(let w of words) {
        if(w.children) {
            for(let c of w.children) {
                children.push(c);
                indices[c.type] ??= [];
                indices[c.type].push(i);
                ++i;
                // addBreakpoint(c);
            }
        }
        else {
            children.push(w);
           // addBreakpoint(w);
           indices[w.type] ??= [];
           indices[w.type].push(i);
           ++i;
        }
    }
    return {
        word: words.map(w => w.word).join(""),
        romaji: words.map(w => w.romaji).join(" "),
        children: children,
        indices: indices
    };
}