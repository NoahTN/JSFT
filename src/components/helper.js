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

export function formatOutput(words, dontModifyOutput=false) {
    let children = [];
    let indices = {grammar: []};
    let particles = {};
    let word = "";
    let romaji = "";
    let i = 0;
    for(let w of words) {
        if(w.children) {
            for(let c of w.children) {
                word += c.word;
                romaji += c.romaji + " ";
                children.push(c);
                indices[c.type] ??= [];
                indices[c.type].push(i);
                if(c.type === "particle") {
                    particles[c.romaji] ??= [];
                    particles[c.romaji].push(i);
                }
                ++i;
            }
        }
        else {
            word += w.word;
            romaji += w.romaji + " ";
            children.push(w);
            indices[w.type] ??= [];
            indices[w.type].push(i);
            if(w.type === "particle") {
                particles[w.romaji] ??= [];
                particles[w.romaji].push(i);
            }
            ++i;
        }
    }
    return {
        word: dontModifyOutput ? words.map(w => w.word).join("") : word,
        romaji: dontModifyOutput ? words.map(w => w.romaji).join(" ") : romaji.slice(0, -1),
        children: children,
        indices: indices,
        particles: particles
    };
}