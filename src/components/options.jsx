import { useState } from "react"
import "./styles/options.css";
// Particles should have an advanced dropdown listing all of them
export const OPTION_OBJECT = {
    "Words": ["Noun", "Adjective", "Verb", "Adverb"],
    "Vocab Level": ["N5", "N4"],
    "Tenses": ["Plain", "Polite", "Past", "Negative", "Te", "Provisional", "Conditional", 
               "Imperative", "Volitional", "Potential", "Passive", "Causative"],
    "Types": ["Single Word", "Adjective-Noun", "Basic Sentence", "N5 Grammar", "Complex Sentence"],
    "Extra": ["Hints", "Display Characters"]
}
function OptionBox(props) {
    return <div id="options-box">
        {Object.entries(props.initialSettings).map(([k, v]) => 
            <OptionGroup key={ k } name={ k } checked={ v } updateOptions={ props.updateOptions }/>
        )}
        {props.debugOptions && Object.entries(props.initialSettings).map(([k, v]) =>  
            <p key={ k }>Debug { k }: {
                v.map(setting => {return setting && <span key={ setting }>{ setting } </span>}) 
            }</p>)}
    </div>
}

function OptionGroup(props) {
    const [checked, setChecked] = useState(props.checked);

    function handleChange(i) {
        const copy = [...checked];
        // Checking sentence should automatically include at least noun, verb, think about adverbs and adjectives too
        if(!["Extra"].includes(props.name) && copy.reduce((sum, curr) => sum + (curr.length > 0), 0) < 2 && copy[i]) {
            return;
        }
        if(copy[i]) {
            copy[i] = "";
        }
        else {
            copy[i] = OPTION_OBJECT[props.name][i];
        }
        setChecked(copy);
        props.updateOptions(props.name, copy);
     }

     return <div className="option-group">
        <span>{ props.name }</span>
        {OPTION_OBJECT[props.name].map((item, index) => 
            <Option
                key={ item }
                label={ item }
                group={ props.name }
                handleChange={() => handleChange(index)}
                isChecked={ checked[index] }
            />
        )}
    </div>
}

function Option(props) {
    return <>
       <input
          type="checkbox"
          id={ props.group + "_" + props.label }
          className="option-input"
          aria-label= { props.label }
          onChange={ props.handleChange }
          checked={ props.isChecked }
       />
       <label className="option-label" htmlFor={ props.group + "_" + props.label }>{ props.label }</label>
    </>
}

export default OptionBox;