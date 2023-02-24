import { useState } from "react"

export const OPTION_OBJECT = {
    "Words": ["Nouns", "Adjectives", "Verbs", "Adverbs"],
    "Tenses": ["Plain", "Past", "Polite"],
    "Sentence Types": ["Basic"],
    "Level": ["N5", "N4", "N3"]
}

function OptionBox(props) {
    return <div id="options-box">
        {Object.entries(props.initialSettings).map(([k, v]) => 
            <OptionGroup key={ k } name={ k } checked={ v } updateOptions={ props.updateOptions }/>
        )}
        {props.debugOptions && Object.entries(OPTION_OBJECT).map(([k, v]) => 
            <p key={ k }>Debug { k }: {v.filter((item, i) => 
                props.initialSettings[k][i]).map(setting => 
                    <span key={ setting }>{ setting } </span> 
             )}</p>
        )}
    </div>
}

function OptionGroup(props) {
    const [checked, setChecked] = useState(props.checked);

    function handleChange(i) {
        const copy = [...checked];
        if(copy.reduce((sum, curr) => sum+curr, 0) < 2 && copy[i] === true) {
            return;
        }
        copy[i] = !copy[i];
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