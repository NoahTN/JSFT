export function logProblem(problem, types=false) {
    console.log([problem.word, problem.romaji]);

    if(types) {
        console.log(problem.children.map(c => c.type));
    }
}