export function logProblem(problem, breakpoints=false, types=false) {
    console.log([problem.word, problem.romaji]);
    if(breakpoints) {
        console.log([problem.breakpoints.words]);
        console.log([problem.breakpoints.romaji]);
    }
    if(types) {
        console.log(problem.children.map(c => c.type));
    }
}