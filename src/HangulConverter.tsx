import React, { useState } from 'react';

const HangulConverter: React.FC = () => {
    const [output, setOutput] = useState('');
    //마지막으로 수정한 단어
    const [lastWord,setLastWord] = useState('');
    //커서의 위치
    const [row,setRow] = useState(0);
    const [col,setCol] = useState(0);
    const preventWord = ['Shift','CapsLock','Tab','Control','Alt','Meta','Escape','F1','F2','F3','F4',
    'F5','F6','F7','F8','F9','F10','F11','F12']
    const arrow = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',]
    const convertHangul: Record<string, string> = {
        'ㅁ': 'ㅿ',
        'ㅇ': 'ㆁ',
        'ㅎ': 'ㆆ',
        'ㅋ': 'ᄼ',
        'ᄼ': 'ᄽ',
        'ㅌ': 'ᄾ',
        'ᄾ': 'ᄿ',
        'ㅊ': 'ᅎ',
        'ᅎ': 'ᅏ',
        'ㅍ': 'ᅐ',
        'ᅐ': 'ᅑ',
        'ㅠ': 'ᅔ',
        'ㅜ': 'ᅕ'
    };
    const handleKeyUp = (event:React.KeyboardEvent) => {
        if (event.key === '.'){
            const newWord = convertHangul[lastWord];
            if (newWord){
                setOutput(output.slice(0,-1)+newWord);
                setLastWord(newWord);
            }else{
                setOutput(output+'.')
                setLastWord('.')
            }

        }
        else if(event.key === 'ㅏ' && lastWord ==='ㅏ'){
            setOutput(output.slice(0,-1)+'ㆍ')
            setLastWord('ㆍ')
        }
        else if (event.shiftKey)
        {   const newWord = convertHangul[event.key]
            if (newWord)
            {
                if (lastWord === newWord && convertHangul[newWord]){
                    setOutput(output.slice(0,-1)+convertHangul[newWord]);
                    setLastWord(convertHangul[newWord]);
                }
                else{
                    setOutput(output+newWord);
                    setLastWord(newWord);
                }
            }else{
                setOutput(output+event.key);
                setLastWord(event.key);
            }
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
            setLastWord(' ')
        }
        else if(event.key ==='Enter'){
            setOutput(output + '\n');
            setLastWord('\n')
        }
        else{
            setOutput(output+event.key);
            setLastWord(event.key)
        }
      }
    return (
        <div onKeyUp={handleKeyUp}>
            <textarea value={output}></textarea>
        </div>
    );
}

export default HangulConverter;