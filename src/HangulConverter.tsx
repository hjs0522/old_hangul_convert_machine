import React, { useState,useRef,useEffect } from 'react';

const HangulConverter: React.FC = () => {
    const [output, setOutput] = useState('');
    //마지막으로 수정한 단어
    const [lastWord,setLastWord] = useState('');
    //커서의 위치
    const [cursorPosition,setCursorPosition] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preventWord = ['Shift','CapsLock','Tab','Control','Alt','Meta','Escape','F1','F2','F3','F4',
    'F5','F6','F7','F8','F9','F10','F11','F12']
    const Arrow = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'];
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
    useEffect(()=>{
        setCursorPosition(textareaRef.current?.selectionStart ||0)
    },[output])
    const handleKeyUp = (event:React.KeyboardEvent) => {
        setCursorPosition(textareaRef.current?.selectionStart ||0)
        if (event.key === '.'){
            const newWord = convertHangul[lastWord];
            if (newWord){
                setOutput(output.slice(0,cursorPosition-1)+newWord+output.slice(cursorPosition));
                setLastWord(newWord);
            }else{
                setOutput(output.slice(0,cursorPosition)+'.'+output.slice(cursorPosition))
                setLastWord('.')
            }

        }
        else if(event.key === 'ㅏ' && lastWord ==='ㅏ'){
            setOutput(output.slice(0,cursorPosition-1)+'ㆍ'+output.slice(cursorPosition))
            setLastWord('ㆍ')
        }
        else if (event.shiftKey)
        {   const newWord = convertHangul[event.key]
            if (newWord)
            {
                if (lastWord === newWord && convertHangul[newWord]){
                    setOutput(output.slice(0,cursorPosition-1)+convertHangul[newWord]+output.slice(cursorPosition));
                    setLastWord(convertHangul[newWord]);
                }
                else{
                    setOutput(output.slice(0,cursorPosition)+newWord+output.slice(cursorPosition));
                    setLastWord(newWord);
                }
            }else{
                setOutput(output.slice(0,cursorPosition)+event.key+output.slice(cursorPosition));
                setLastWord(event.key);
            }
        }
        else if(Arrow.includes(event.key)){
            setCursorPosition(textareaRef.current?.selectionStart||0);
        }
        else if(preventWord.includes(event.key)){
            if (event.key !== 'Shift'){
                setLastWord('');
            }
            event.preventDefault();
        }
        else if(event.key==='Backspace'){
            setOutput(output.slice(0,cursorPosition-1)+output.slice(cursorPosition+1))
            setLastWord(output[cursorPosition-2])
        }
        else if(event.key ==='Space'){
            setOutput(output.slice(0,cursorPosition)+' '+output.slice(cursorPosition))
            setLastWord(' ')
        }
        else if(event.key ==='Enter'){
            setOutput(output.slice(0,cursorPosition) + '\n' + output.slice(cursorPosition));
            setLastWord('\n')
        }
        else{
            setOutput(output.slice(0,cursorPosition)+event.key+output.slice(cursorPosition));
            setLastWord(event.key)
        }
    }
    return (
        <div onKeyUp={handleKeyUp}>
            <textarea ref={textareaRef} value={output}></textarea>
        </div>
    );
}

export default HangulConverter;