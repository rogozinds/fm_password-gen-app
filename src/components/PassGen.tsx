import {useCallback, useEffect, useMemo, useState} from "react";
//TODO Check can we import it 'properly'
import generator from 'generate-password-ts/dist/generate-password.bundle.js';

//Strength:
// 0 - too weak,
const STRENGTH_STRINGS = [
    "Too weak!",
    "Weak",
    "Medium",
    "Strong"
]
const calcStreng = (pass :string):number =>{

}
export const PassGen = () => {
    const [password,setPassword] = useState<string>("HUI");
    const [charLength,setCharLength] = useState<number>(10);
    const [uppercase,setUppercase] = useState<boolean>(true);
    const [strength,setStrength] = useState<number>(0);

    const generatePassword = useCallback(() =>{
        const p = generator.generate({
            length: 10,
            numbers: true
        });
        console.log("PASSWORD GENERATED", charLength, p);
        setPassword(p);
    },[charLength, uppercase]);

    const copyToClipboard = ()=>{
       console.log("Password is copied to clipboard");
    }
    const strengthUI = useMemo(()=>{
        return  STRENGTH_STRINGS[strength];
    }, [strength])
    return (
        <>
            <div className="layout" >
                {charLength}
                <div className="header" > Password Generator</div>
                <div >{password}</div>
                <button onClick={copyToClipboard}></button>
                <div className="main-card-container">
                    <div className="main-card-item" >
                        <div>Character length</div>
                        <div>{charLength}</div>
                    </div>
                    {/*Extract this into a component*/}
                    <div className="main-card-item" >
                        <input type="checkbox" id="uppercase" value={uppercase} />
                        <div>Include Uppercase letters</div>
                    </div>
                    {/*Create a component for strength*/}
                    <div>
                        Strength
                    </div>
                    <div>
                        {strengthUI}
                    </div>

                    <button onClick={generatePassword}>Generate </button>
                </div>
            </div>
         </>
    );
};