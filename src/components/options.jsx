import { useState } from "react"
// Particles should have an advanced dropdown listing all of them
export const OPTION_OBJECT = {
    "Format": ["Romaji", "Translate"],
    "Words": ["Nouns", "Adjectives", "Verbs", "Adverbs"],
    "Vocab": ["N5", "N4"],
    "Tenses": ["Plain", "Past", "Polite"],
    "Types": ["Single Word", "Adjecive-Noun", "Basic Sentence", "N5 Grammar", "N4 Grammar"],
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
        if(!["Particles", "Grammar"].includes(props.name) && copy.reduce((sum, curr) => sum + (curr.length > 0), 0) < 2 && copy[i]) {
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
                handleChange={() => handleChange(index)}
                isChecked={ checked[index] }
            />
        )}
    </div>
}

function Option(props) {
    return <label className="option">
       <input
          type="checkbox"
          aria-label= { props.label }
          onChange={ props.handleChange }
          checked={ props.isChecked }
       />
       { props.label }
    </label>
}

export default OptionBox;