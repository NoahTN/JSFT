import { useEffect, useRef, useState } from "react"
import { generateProblem } from "./generator"
import OptionBox, { OPTION_OBJECT } from "./options";
import { getRandom, shuffle } from "./helper";
import { ReactComponent as GithubIcon } from '../assets/github.svg';
import { toKana, toRomaji } from "wanakana";
import "./styles/interactor.css";

function Interactor(props) {
    const inputRef = useRef();
    const voiceSynth = useRef(new SpeechSynthesisUtterance());
    const [problem, setProblem] = useState(null);
    const [shuffled, setShuffled] = useState([]);
    const [prompt, setPrompt] = useState("‎");
    const [expectedAnswer, setExpectedAnswer] = useState(props?.debug?.expected ?? "");
    const [isCorrect, setIsCorrect] = useState(null);
    const [hintInfo, setHintInfo] = useState([]);
    const [answerCount, setAnswerCount] = useState([0, 0]);
    const [firstSubmit, setFirstSubmit] = useState(false);
    const [selectedHint, setSelectedHint] = useState(-1);
    const [options, setOptions] = useState(() => {
        let storedOptions = localStorage.getItem("jsft-options");
        if(storedOptions) {
            return JSON.parse(storedOptions);
        }
       
        const temp = {};
        Object.entries(OPTION_OBJECT).map(([k, v]) => {
            temp[k] = Array(v.length).fill("");
            if(k !== "Extra") {
                temp[k][0] = v[0];
            }
        })
        return temp;
    });

    useEffect(() => {
        voiceSynth.current.volume = 0.75;
        voiceSynth.current.lang = "ja-JP";
    }, []);

    useEffect(() => {
        console.log(problem);
        setHintInfo([]);
        setShuffled(problem?.children ? shuffle(problem.children) : problem);
        setIsCorrect(null);
        setFirstSubmit(true);
        setSelectedHint(-1);
    }, [problem]);

    function handleGenerateProblem() {
        const temp = {...options};
        console.log(temp);
        for(let key of Object.keys(temp)) {
            temp[key] = temp[key].filter(value => value);
        }
        const generated = generateProblem(temp);
        inputRef.current.value = "";
        setProblem(generated);
        createPrompt(generated,  temp["Extra"].includes("Display Characters"));
    }

    function handleInputKeyDown(event) {
        if(event.key == "Enter") {
            event.preventDefault();
            handleAnswerSubmit();
        }
    }

    function handleInputChange(event) {
       
        const input = inputRef.current;
        input.style.height = (2 * parseFloat(getComputedStyle(document.documentElement).fontSize)) + "px";
        if(input.scrollHeight > parseInt(input.style.height.slice(0, -2)) + 10) {
            input.style.height = "0";
            input.style.height = input.scrollHeight + "px";
        }
     
        const prev = input.value;
        const prevStart = input.selectionStart;
        const midModify = prevStart !== input.value.length;
        if(midModify && event.nativeEvent.data !== "n") {
            const set = new Set(["a", "e", "i", "o", "u"]);
            let temp = "";
            for(let i = 0; i < input.value.length; ++i) {
                if(i < input.value.length-1 && input.value[i] === "ん" && set.has(input.value[i+1])) {
                    temp += "n";    
                }
                else {
                    temp += input.value[i];
                }
            }
            input.value = temp;
        }
        console.log(input.value);
        input.value = toKana(input.value, { IMEMode: true });
        console.log(input.value);
        if(midModify && prev !== input.value) {
            let diff = prev.length - input.value.length;
            input.selectionStart = prevStart + diff - (diff ? 2 : 0);
            input.selectionEnd = prevStart + diff - (diff ? 2 : 0);
        }

        if(event.nativeEvent.inputType === "insertLineBreak")  {
            event.preventDefault();
            handleAnswerSubmit();
        }
    }

    function handleAnswerSubmit(event) {
        if(!problem) {
            return;
        }

        if(isCorrect) {
            setIsCorrect(null);
            handleGenerateProblem();
        }
        else {
            let cleanInput = toRomaji(inputRef.current.value).replace(/\s/g, "");
            let cleanExpected = expectedAnswer.toLowerCase().replace(/\s/g, "");
            let correct = cleanInput === cleanExpected;
            if(!correct && problem?.particles?.wa) {
                let i = 0;
                let curLen = 0;
                while(problem.children[i].word !== "は") {
                    curLen += problem.children[i].romaji.length-1;
                    ++i;
                }
                correct = cleanInput.slice(0, curLen+1) + "w" + cleanInput.slice(curLen+2) === cleanExpected;
            }
            if(firstSubmit) {
                let temp = [...answerCount];
              
                ++temp[correct ? 0 : 1];
                setAnswerCount(temp);
            }
            setIsCorrect(correct);
        }
        setFirstSubmit(false);
    }

    function updateOptions(category, values) {
        const copy = {...options};
        copy[category] = values;
        // Enable nouns and adjectives if Adjective-Noun type is checked
        
        if(category === "Types" && values.includes("Adjective-Noun")) {
            copy["Words"][0] = "Noun"
            copy["Words"][1] = "Adjective";
        }
        else if(problem && category === "Extra" && values.length) {
            createPrompt(problem, values.slice(-1)[0] === "Display Characters");
        }
        setOptions(copy);
        console.log(copy);
        localStorage.setItem("jsft-options", JSON.stringify(copy));
    }

    function handleHintClick(e, word, index) {
        playTTS(word.word === "は" ? "わ" : word.word);
        setSelectedHint(index);
        const output = [
            ["Type", word.type],
            ["Romaji", word.romaji],
            ["Meaning", word.meaning || word?.verb?.meaning || word.adjective.meaning],
        ];
        if(word.category) {
            output.push(["Category", word.category]);
        }
        if(word.form) {
            if(word.verb || word.adjective) {
                output.unshift(["Original", word?.verb?.word || word.adjective.word]);
            }
            output.push(["Form", word.form]);
        }
        setHintInfo(output);
    }
    
    function createPrompt(data, displayChars) {
        if(displayChars) {
            setPrompt(<PromptItem text={ data.word }/>);
        }
        else {
            if(data.children) {
                let children = data.children.filter(c => !c.noDisplay);
                setPrompt(children.map((c, i) => <PromptItem key={ data.word + "_" + i + "_" + c.word } word={ c } />));
            }
            else {
                setPrompt(<PromptItem word={ data }/>)
            }
            
        }
        setExpectedAnswer(data.romaji);
    }

    function getHints() {
        if(problem && options["Extra"][0] === "Hints") {
            if(shuffled?.length) {
                return shuffled.map((c, i) => {
                    return <Hint key={ i + "_" + problem.word } word={ c } onClick={ handleHintClick } index={ i } selected={i === selectedHint}/>
                });
            }
            return <Hint word={ problem } onClick={ handleHintClick }/>
        }
    }

    function playTTS(text) {
        if(window.speechSynthesis) {
            voiceSynth.current.text = text;
            window.speechSynthesis.speak(voiceSynth.current);
        }
    }

    function getAnswerStatus() {
        let className = "answer-status";
        let text = "";
        if(typeof isCorrect === "boolean") {
            if(isCorrect) {
                className += " correct";
                text = problem.word;
            }
            else {
                className += " wrong";
                text = expectedAnswer;
            }
        }
        else {
            className += " invisible";
        }
        return <div className={ className } onClick={ () => playTTS(problem.word) }>
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
        <div id="prompt">{ prompt }</div>
        <br/>
        <div id="generate-box">
            <div className="flex-spacer"></div>
            <button type="button" id="generator" onClick={ handleGenerateProblem }>
                Generate
            </button>
            <div id="counter" className="flex-spacer">
                <span id="counter-correct">{ answerCount[0] }</span> / <span id="counter-wrong">{ answerCount[1] }</span>
            </div>
        </div>
       
        <div id="input-box">
            <form onSubmit={ handleAnswerSubmit } aria-label="submit-answer" >
                <textarea ref={ inputRef } aria-label="input-answer" autoComplete="new-password" onChange={ handleInputChange } onKeyDown={ handleInputKeyDown }/>
            </form>
        </div>
        <div id="answer-status-box">
            <div className="flex-spacer"></div>
            { getAnswerStatus() }
        </div>
        <OptionBox 
            updateOptions={ updateOptions }
            initialSettings={ options }
          //  debugOptions= { true }
        />
        <footer>
            <a href="https://github.com/NoahTN/JSFT" target="_blank" rel="noopener noreferrer"><GithubIcon /></a>
            <span>Data from <a target="_blank" rel="noopener noreferrer" href="https://jlptsensei.com/">https://jlptsensei.com/</a></span>
            <span>Inspired by <a target="_blank" rel="noopener noreferrer" href="https://steven-kraft.com/projects/japanese/randomize/">https://steven-kraft.com/projects/japanese/randomize/</a></span>
        </footer>
    </div>
}

function PromptItem(props) {
    let text = props.text;
    let className = "prompt-item";
    if(!text) {
        const word = props.word;
        text = word.meaning || word?.verb?.meaning || word?.adjective?.meaning;
        className += " " + word.type;

        if(word.form) {
            text += " (";
            if(!word.verb && !word.adjective) {
                text += "G: ";
            }
            text += word.form + ")";
        }
    }
   
    return <span className={ className }>
        { text }
    </span>
}

function Hint(props) {
    const word = props.word;
    return <div className={"hint" + (props.selected ? " hint-selected" : "")} onClick={ (e) => props.onClick(e, word, props.index) }>
        { word.word + (word.form && !word.verb && !word.adjective ? "*": "") }
    </div>
}

export default Interactor