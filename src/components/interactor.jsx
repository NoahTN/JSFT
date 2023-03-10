import { useEffect, useRef, useState } from "react"
import { generateProblem } from "./generator"
import OptionBox, { OPTION_OBJECT } from "./options";

function Interactor(props) {
    const inputRef = useRef();
    const [problem, setProblem] = useState(null);
    const [expectedAnswer, setExpectedAnswer] = useState(props?.debug?.expected ?? null);
    const [answerStatus, setAnswerStatus] = useState("");
    const [options, setOptions] = useState(() => {
        if(!props.options) {
            const temp = {};
            Object.entries(OPTION_OBJECT).map(([k, v]) => {
                temp[k] = Array(v.length).fill("");
                temp[k][0] = v[0];
            })
            return temp;
        }
    });

    useEffect(() => {
        console.log(problem);
    }, [problem]);

    function handleGenerateProblem() {
        const temp = {...options};
        for(let key of Object.keys(temp)) {
            temp[key] = temp[key].filter(value => value);
        }
        const generated = generateProblem(temp);
        setProblem(generated);
        setExpectedAnswer(generated.romaji);
    }

    function handleRequestSubmit() {

    }

    function handleAnswerSubmit(event) {
        event.preventDefault();
        setAnswerStatus(inputRef.current.value === expectedAnswer ? "correct" : "wrong");
    }

    function updateOptions(category, values) {
        const copy = {...options};
        copy[category] = values;
        // Enable nouns and adjectives if Adjective-Noun type is checked
        if(category === "Types" && values[1]) {
            copy["Words"][0] = "Nouns"
            copy["Words"][1] = "Adjectives";
        } 
        setOptions(copy);
    }

    function getAnswerStatus() {
        switch(answerStatus) {
            case "correct":
                return "Correct Answer"
            case "wrong":
                return "Wrong Answer"
        }
        return null;
    }

    return <div id="interactor">
        <div id="problem-box">
            <div id="prompt">
                { problem?.word }
            </div>
            <div id="correct-answer">
                { expectedAnswer }
            </div>
            <button onClick={ handleGenerateProblem }>
                Generate
            </button>
        </div>
        <div id="input-box">
            <form onSubmit={ handleAnswerSubmit } aria-label="submit-answer">
                <input type="text" ref={ inputRef } aria-label="input-answer"/>
            </form>
        </div>
        <div id="answer-status-box">
            { getAnswerStatus() }
        </div>
        <div id="problem-request-box">
            
        </div>
        <div id="hint-box">

        </div>
        <OptionBox 
            updateOptions={ updateOptions }
            initialSettings={ options }
            debugOptions= { true }
        />
    </div>
}


export default Interactor