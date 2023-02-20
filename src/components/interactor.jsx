import { useRef, useState } from "react"
import { generateProblem } from "./generator"

function Interactor(props) {
    const inputRef = useRef();
    const [problem, setProblem] = useState(props.debug.problem ?? null)
    const [expectedAnswer, setExpectedAnswer] = useState(props.debug.expected ?? null);
    const [answerStatus, setAnswerStatus] = useState("");
 

    function handleRequestSubmit() {

    }

    function handleAnswerSubmit(event) {
        event.preventDefault();
        setAnswerStatus(inputRef.current.value === expectedAnswer ? "correct" : "wrong");
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
            { problem }
            <div id="correct-answer">
                { expectedAnswer }
            </div>
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
    </div>
}


export default Interactor