import React, { useState } from 'react';

const HangulConverter: React.FC = () => {
    const [output, setOutput] = useState('');
    const preventWord = ['Shift','CapsLock','Tab','Control','Alt','Meta','ArrowLeft',
    'ArrowRight','ArrowUp','ArrowDown','Escape','F1','F2','F3','F4',
    'F5','F6','F7','F8','F9','F10','F11','F12']
    const handleKeyDown = (event:React.KeyboardEvent) => {
        console.log(output.charAt(output.length-1))
        const targetWord = output.charAt(output.length-1);
        console.log(targetWord)
        if (event.key === '.'){
            if(targetWord === 'ㅁ'){
                setOutput(output.slice(0,-1)+'ㅿ');
            }
            else if(targetWord === 'ㅇ'){
                setOutput(output.slice(0,-1)+'ㆁ');
            }
            else if(targetWord === 'ㅎ'){
                setOutput(output.slice(0,-1)+'ㆆ');
            }
            else if(targetWord === 'ㅋ'){
                setOutput(output.slice(0,-1)+'ᄼ');
            }
            else if(targetWord === 'ᄼ'){
                setOutput(output.slice(0,-1)+'ᄽ');
            }
            else if(targetWord === 'ㅌ'){
                setOutput(output.slice(0,-1)+'ᄾ');
            }
            else if(targetWord === 'ᄾ'){
                setOutput(output.slice(0,-1)+'ᄿ');
            }
            else if(targetWord === 'ㅊ'){
                setOutput(output.slice(0,-1)+'ᅎ');
            }
            else if(targetWord === 'ᅎ'){
                setOutput(output.slice(0,-1)+'ᅏ');
            }
            else if(targetWord === 'ㅍ'){
                setOutput(output.slice(0,-1)+'ᅐ');
            }
            else if(targetWord === 'ᅐ'){
                setOutput(output.slice(0,-1)+'ᅑ');
            }
            else if(targetWord === 'ㅠ'){
                setOutput(output.slice(0,-1)+'ᅔ');
            }
            else if(targetWord === 'ㅜ'){
                setOutput(output.slice(0,-1)+'ᅕ');
            }else{
                setOutput(output+'.')
            }
            
        }
        else if(event.key === 'ㅏ' && targetWord ==='ㅏ'){
            setOutput(output.slice(0,-1)+'ㆍ')
        }
        else if (event.shiftKey && event.key === 'ㅋ')
        {   
            if (targetWord === 'ᄼ'){
                setOutput(output.slice(0,-1)+'ᄽ');
            }else{
                setOutput(output+'ᄼ')
            }
        }
        else if (event.shiftKey && event.key === 'ㅌ')
        {   
            if (targetWord === 'ᄾ'){
                setOutput(output.slice(0,-1)+'ᄿ');
            }else{
                setOutput(output+'ᄾ')
            }
        }
        else if (event.shiftKey && event.key === 'ㅊ')
        {   
            if (targetWord === 'ᅎ'){
                setOutput(output.slice(0,-1)+'ᅏ');
            }else{
                setOutput(output+'ᅎ')
            }
        }
        else if (event.shiftKey && event.key === 'ㅍ')
        {   
            if (targetWord === 'ᅐ'){
                setOutput(output.slice(0,-1)+'ᅑ');
            }else{
                setOutput(output+'ᅐ')
            }
        }
        else if (event.shiftKey && event.key === 'ㅁ') {
            setOutput(output+'ㅿ');
        }
        else if (event.shiftKey && event.key === 'ㅇ') {
            setOutput(output+'ㆁ');
        }
        else if (event.shiftKey && event.key === 'ㅎ') {
            setOutput(output+'ㆆ');
        }
        else if (event.shiftKey && event.key === 'ㅋ') {
            setOutput(output+'ᄼ');
        }
        else if (event.shiftKey && event.key === 'ㅌ') {
            setOutput(output+'ᄾ');
        }
        else if (event.shiftKey && event.key === 'ㅊ') {
            setOutput(output+'ᅎ');
        }
        else if (event.shiftKey && event.key === 'ㅍ') {
            setOutput(output+'ᅐ');
        }
        else if (event.shiftKey && event.key === 'ㅠ') {
            setOutput(output+'ᅔ');
        }
        else if (event.shiftKey && event.key === 'ㅜ') {
            setOutput(output+'ᅕ');
        }
        else if(preventWord.includes(event.key)){
            event.preventDefault();
        }
        else if(event.key==='Backspace'){
            setOutput(output.slice(0,-1))
        }
        else if(event.key ==='Space'){
            setOutput(output+' ')
        }
        else if(event.key ==='Enter'){
            setOutput(output + '\n');
        }
        else{
            setOutput(output+event.key);
        }
      }
    return (
        <div onKeyUp={handleKeyDown}>
            <textarea value={output}></textarea>
        </div>
    );
}

export default HangulConverter;
