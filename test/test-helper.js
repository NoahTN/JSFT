export function logProblem(problem, breakpoints=false) {
    console.log([problem.word, problem.romaji]);
    if(breakpoints) {
        console.log([problem.breakpoints.words]);
        console.log([problem.breakpoints.romaji]);
    }
}