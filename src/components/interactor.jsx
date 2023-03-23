import { useEffect, useRef, useState } from "react"
import { generateProblem } from "./generator"
import OptionBox, { OPTION_OBJECT } from "./options";
import { getRandom } from "./helper";
import "./styles/interactor.css";

function Interactor(props) {
    const inputRef = useRef();
    const [problem, setProblem] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [expectedAnswer, setExpectedAnswer] = useState(props?.debug?.expected ?? "");
    const [isCorrect, setIsCorrect] = useState(null);
    const [hintInfo, setHintInfo] = useState([]);
    const [options, setOptions] = useState(() => {
        if(!props.options) {
            const temp = {};
            Object.entries(OPTION_OBJECT).map(([k, v]) => {
                temp[k] = Array(v.length).fill("");
                if(k !== "Extra") {
                    temp[k][0] = v[0];
                }
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
        inputRef.current.value = "";
        setHintInfo([]);
        setIsCorrect(null);
        setProblem(generated);
        createPrompt(generated,  temp["Extra"].includes("Display Characters"));
    }

    function handleRequestSubmit() {

    }

    function handleAnswerSubmit(event) {
        event.preventDefault();

        if(!problem) {
            return;
        }

        if(isCorrect) {
            handleGenerateProblem();
        }
        else {
            const cleanInput = inputRef.current.value.toLowerCase().replace(/\s+/g, "");
            const cleanExpected = expectedAnswer.toLowerCase().replace(/\s+/g, "")
            setIsCorrect(cleanInput === cleanExpected);
        }
    }

    function updateOptions(category, values) {
        const copy = {...options};
        copy[category] = values;
        // Enable nouns and adjectives if Adjective-Noun type is checked
        
        if(category === "Types" && values[1]) {
            copy["Words"][0] = "Nouns"
            copy["Words"][1] = "Adjectives";
        } 
        else if(category === "Extra") {
            createPrompt(problem, values[1]);
        }
        setOptions(copy);
    }

    function handleHintClick(e, word) {
        const output = [
            ["Type", word.type],
            ["Romaji", word.romaji],
            ["Meaning", word.meaning ?? word.verb.meaning],
        ];
        if(word.category) {
            output.push(["Category", word.category]);
        }
        if(word.form) {
            output.unshift(["Original", word.verb.word]);
            output.push(["Form", word.form]);
        }
        setHintInfo(output);
    }
    
    function createPrompt(data, displayChars) {
        if(displayChars) {
            setPrompt(data.word);
        }
        else {
            if(data.children) {
                setPrompt(data.children.map(c => c.meaning ?? c.verb.meaning + ` (${c.form})`).join(" | "));
            }
            else if(data.verb) {
                setPrompt(data.verb.meaning + ` (${data.form})`);
            }
            else {
                setPrompt(data.meaning);
            }
            
        }
        setExpectedAnswer(data.romaji);
    }

    function getHints() {
        if(problem && options["Extra"][0]) {
            if(problem.children) {
                return problem.children.map(c => {
                    return <Hint key={ c.word + c.romaji } word={ c } onClick={ handleHintClick }/>
                });
            }
            return <Hint word={ problem } onClick={ handleHintClick }/>
        }
    }

    function getAnswerStatus() {
        let className = "answer-status";
        let text = "";
        if(typeof isCorrect === "boolean") {
            if(isCorrect) {
                className += " correct";
                text = "Correct Answer";
            }
            else {
                className += " wrong";
                text = expectedAnswer;
            }
        }
        return <div className={ className }>
            { text }
        </div>
    }

    return <div id="interactor">
        <div id="hint-box">
            {(problem && options["Extra"][0]) && <>
                <div id="hint-info">{hintInfo.map(h =>
                    <span key={ h[0] }>{ h[0] }: <span>{ h[1] }</span></span>
                )}
                </div>
            { getHints() }
            </>}
        </div>
        {/* <div id="correct-answer">{ (typeof isCorrect === "boolean" && !isCorrect) && expectedAnswer }</div> */}
        <div id="prompt">{ prompt }</div>
        <button id="generator" onClick={ handleGenerateProblem }>
            Generate
        </button>
        <div id="input-box">
            <form onSubmit={ handleAnswerSubmit } aria-label="submit-answer">
                <input type="text" ref={ inputRef } aria-label="input-answer"/>
            </form>
        </div>
        <div id="answer-status-box">
            { getAnswerStatus() }
        </div>
        <OptionBox 
            updateOptions={ updateOptions }
            initialSettings={ options }
          //  debugOptions= { true }
        />
    </div>
}

function Hint(props) {
    const word = props.word;
    return <div className="hint" onClick={ (e) => props.onClick(e, word) }>
        { word.word }
    </div>
}


export default Interactor