import React, { useState } from 'react';

const HangulConverter: React.FC = () => {
    const [output, setOutput] = useState('');
    const [lastWord,setLastWord] = useState('');
    const preventWord = ['Shift','CapsLock','Tab','Control','Alt','Meta','ArrowLeft',
    'ArrowRight','ArrowUp','ArrowDown','Escape','F1','F2','F3','F4',
    'F5','F6','F7','F8','F9','F10','F11','F12']
    const handleKeyUp = (event:React.KeyboardEvent) => {
        if (event.key === '.'){
            if(lastWord === 'ㅁ'){
                setOutput(output.slice(0,-1)+'ㅿ');
                setLastWord('ㅿ');
            }
            else if(lastWord === 'ㅇ'){
                setOutput(output.slice(0,-1)+'ㆁ');
                setLastWord('ㆁ');
            }
            else if(lastWord === 'ㅎ'){
                setOutput(output.slice(0,-1)+'ㆆ');
                setLastWord('ㆆ');
            }
            else if(lastWord === 'ㅋ'){
                setOutput(output.slice(0,-1)+'ᄼ');
                setLastWord('ᄼ');
            }
            else if(lastWord === 'ᄼ'){
                setOutput(output.slice(0,-1)+'ᄽ');
                setLastWord('ᄽ');
            }
            else if(lastWord === 'ㅌ'){
                setOutput(output.slice(0,-1)+'ᄾ');
                setLastWord('ᄾ');
            }
            else if(lastWord === 'ᄾ'){
                setOutput(output.slice(0,-1)+'ᄿ');
                setLastWord('ᄿ');
            }
            else if(lastWord === 'ㅊ'){
                setOutput(output.slice(0,-1)+'ᅎ');
                setLastWord('ᅎ');
            }
            else if(lastWord === 'ᅎ'){
                setOutput(output.slice(0,-1)+'ᅏ');
                setLastWord('ᅏ');
            }
            else if(lastWord === 'ㅍ'){
                setOutput(output.slice(0,-1)+'ᅐ');
                setLastWord('ᅐ');
            }
            else if(lastWord === 'ᅐ'){
                setOutput(output.slice(0,-1)+'ᅑ');
                setLastWord('ᅑ');
            }
            else if(lastWord === 'ㅠ'){
                setOutput(output.slice(0,-1)+'ᅔ');
                setLastWord('ᅔ');
            }
            else if(lastWord === 'ㅜ'){
                setOutput(output.slice(0,-1)+'ᅕ');
                setLastWord('ᅕ');
            }else{
                setOutput(output+'.')
                setLastWord('.')
            }
            
        }
        else if(event.key === 'ㅏ' && lastWord ==='ㅏ'){
            setOutput(output.slice(0,-1)+'ㆍ')
            setLastWord('ㆍ')
        }
        else if (event.shiftKey && event.key === 'ㅋ')
        {   
            if (lastWord === 'ᄼ'){
                setOutput(output.slice(0,-1)+'ᄽ');
                setLastWord('ᄽ');
            }else{
                setOutput(output+'ᄼ')
                setLastWord('ᄼ')
            }
        }
        else if (event.shiftKey && event.key === 'ㅌ')
        {   
            if (lastWord === 'ᄾ'){
                setOutput(output.slice(0,-1)+'ᄿ');
                setLastWord('ᄿ');
            }else{
                setOutput(output+'ᄾ')
                setLastWord('ᄾ')
            }
        }
        else if (event.shiftKey && event.key === 'ㅊ')
        {   
            if (lastWord === 'ᅎ'){
                setOutput(output.slice(0,-1)+'ᅏ');
                setLastWord('ᅏ');
            }else{
                setOutput(output+'ᅎ')
                setLastWord('ᅎ')
            }
        }
        else if (event.shiftKey && event.key === 'ㅍ')
        {   
            if (lastWord === 'ᅐ'){
                setOutput(output.slice(0,-1)+'ᅑ');
                setLastWord('ᅑ');
            }else{
                setOutput(output+'ᅐ')
                setLastWord('ᅐ')
            }
        }
        else if (event.shiftKey && event.key === 'ㅁ') {
            setOutput(output+'ㅿ');
            setLastWord('ㅿ')
        }
        else if (event.shiftKey && event.key === 'ㅇ') {
            setOutput(output+'ㆁ');
            setLastWord('ㆁ')
        }
        else if (event.shiftKey && event.key === 'ㅎ') {
            setOutput(output+'ㆆ');
            setLastWord('ㆆ')
        }
        else if (event.shiftKey && event.key === 'ㅋ') {
            setOutput(output+'ᄼ');
            setLastWord('ᄼ')
        }
        else if (event.shiftKey && event.key === 'ㅌ') {
            setOutput(output+'ᄾ');
            setLastWord('ᄾ')
        }
        else if (event.shiftKey && event.key === 'ㅊ') {
            setOutput(output+'ᅎ');
            setLastWord('ᅎ')
        }
        else if (event.shiftKey && event.key === 'ㅍ') {
            setOutput(output+'ᅐ');
            setLastWord('ᅐ')
        }
        else if (event.shiftKey && event.key === 'ㅠ') {
            setOutput(output+'ᅔ');
            setLastWord('ᅔ')
        }
        else if (event.shiftKey && event.key === 'ㅜ') {
            setOutput(output+'ᅕ');
            setLastWord('ᅕ')
        }
        else if(preventWord.includes(event.key)){
            event.preventDefault();
        }
        else if(event.key==='Backspace'){
            setOutput(output.slice(0,-1))
            setLastWord(output[-2])
        }
        else if(event.key ==='Space'){
            setOutput(output+' ')
            setLastWord('')
        }
        else if(event.key ==='Enter'){
            setOutput(output + '\n');
            setLastWord('')
        }
        else{
            setOutput(output+event.key);
            setLastWord(event.key)
        }
      }
    const formattedInput = output.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
    return (
        <div onKeyUp={handleKeyUp}>
            <input type="text" value={output}/>
            <p>{formattedInput}</p>
        </div>
    );
}

export default HangulConverter;
