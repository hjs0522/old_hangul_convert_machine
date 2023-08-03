import React, { useState,useRef } from 'react';
/*
완성형 옛한글 만드는 방법 시도
1. 초성,중성,종성을 받아 그에 대응되는 유니코드 값을 이용하여 완성형 글자의 유니코드를 만든다
=> 옛한글의 경우 완성형 유니코드가 없으므로 만들 수 없음
2. hangul-js 라이브러리를 사용하는 방법
https://github.com/e-/Hangul.js/blob/master/hangul.js 
=> 이 경우에도 String.fromCharCode(0xAC00 + (cho * 588) + (jung * 28) + (jong !== -1 ? jong + 1 : 0))
이 코드와 비슷하게 동작한다 console.log(Hangul.assemble(['ㄱ','ㅏ','ㄱ'])) 실행 시 '각'이 나오지만
console.log(Hangul.assemble(['ㆆ','ㅏ','ㄱ'])) 실행시 'ㆆㅏㄱ'이 나온다.
3. 
*/

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
        'ㅁ': String.fromCharCode(0X1140),
        'ㅇ': 'ㆁ',
        'ㅎ': 'ㆆ',
        'ㅏ': 'ㆍ',
        'ㅂ': 'ㅸ',
        'ㄹ': 'ㆅ',
    }
    const handleKeyUp = (e:React.KeyboardEvent) => {
        if (e.key === '.'){
            const newWord = convertHangul[lastWord];
            if (newWord){
                //.을 찍는 순간 handleInputChange에 의해 output의 길이가 1증가한다
                setOutput(output.slice(0,cursorPosition-2)+newWord+output.slice(cursorPosition));
                setLastWord(newWord);
            }else{
                setOutput(output.slice(0,cursorPosition-1)+'.'+output.slice(cursorPosition))
                setLastWord('.')
            }
        }
        else if(Arrow.includes(e.key)){
            setCursorPosition(textareaRef.current?.selectionStart||0);
            setLastWord('');
        }
        else if(preventWord.includes(e.key)){
            if (e.key !== 'Shift'){
                setLastWord('');
            }
            e.preventDefault();
        }
        else{
            setLastWord(e.key)
        }
        
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const result: string[] = [];
        let cho: number = -1;
        let jung: number = -1;
        let jong: number = -1;
    
        for (const ch of value) {
          const code = ch.charCodeAt(0);
    
          if (0x1100 <= code && code <= 0x1112) { // 초성
            if (cho !== -1 && jung !== -1) {
            //만약 초성과 중성이 존재한다면 저장된 값을 합쳐 result에 저장 후 초성,중성,종성 초기화
              result.push(String.fromCharCode(0xAC00 + (cho * 588) + (jung * 28) + (jong !== -1 ? jong + 1 : 0)));
              cho = jung = jong = -1;
            }
            //입력된 초성의 경우 ㄱ 과의 차이값을 저장
            cho = code - 0x1100;
          } else if (0x1161 <= code && code <= 0x1175) { // 중성
            if (cho !== -1 && jung !== -1) {
            //만약 초성과 중성이 존재한다면 
              result.push(String.fromCharCode(0xAC00 + (cho * 588) + (jung * 28) + (jong !== -1 ? jong + 1 : 0)));
              cho = jung = jong = -1;
            }
            jung = code - 0x1161;
          } else if (0x11A7 < code && code <= 0x11C2) { // 종성
            jong = code - 0x11A8;
          } else { // 그 외 문자
            if (cho !== -1 && jung !== -1) {
              result.push(String.fromCharCode(0xAC00 + (cho * 588) + (jung * 28) + (jong !== -1 ? jong + 1 : 0)));
              cho = jung = jong = -1;
            }
            result.push(ch);
          }
        }
    
        if (cho !== -1 && jung !== -1) {
          result.push(String.fromCharCode(0xAC00 + (cho * 588) + (jung * 28) + (jong !== -1 ? jong + 1 : 0)));
        }
        setCursorPosition(textareaRef.current?.selectionStart ||0)
        setOutput(result.join(''));
      };
    console.log(String.fromCharCode(0x1184))
    return (
        <div className={'container'} onKeyUp = {handleKeyUp}>
            <textarea className={'text'} ref={textareaRef} onChange={handleInputChange} value={output}></textarea>
            <div>
                <p>
                훈민정음의 28자모: 훈민정음의 초성과 종성에 쓰이는 자음 문자 17개와 중성에 쓰이는 모음 문자 11개를 통틀어 이르는 글자.
                1443년에 창제된 우리나라 문자인 “훈민정음(=한글)”에 포함된, 초성과 종성에 쓰이는 자음 문자 17개와 중성에 쓰이는 모음 문자 11개를 통틀어 이르는 말이다.
                </p>
                <p>
                『훈민정음』「예의」에는 처음 만들어진 문자인 ‘훈민정음’에 대한 음가와 운용 방법을 설명하고 있는데, 자음 ‘ ㄱ, ㅋ, ㆁ’, ‘ ㄷ, ㅌ, ㄴ’, ‘ ㅂ, ㅍ, ㅁ’, ‘ ㅈ, ㅊ, ㅅ’, ‘ㆆ, ㅎ, ㅇ’, ‘ ㄹ’, ‘ㅿ’의 17개와 모음 ‘ ㆍ, ㅡ, ㅣ, ㅗ, ㅏ, ㅜ, ㅓ, ㅛ, ㅑ, ㅠ, ㅕ’의 11개가 실려 있다.
                </p>
                <div>
                    <strong>변환법</strong>
                    <ul>
                        <li>'ㅁ' + '.' : 'ㅿ'</li>
                        <li>'ㅇ' + '.' : 'ㆁ'</li>
                        <li>'ㅎ' + '.' : 'ㆆ'</li>
                        <li>'ㅏ' + '.' : 'ㆍ'</li>
                        <li>'ㄹ' + '.' : 'ㆅ'</li>
                    </ul>
                </div>
                <div>
                    <strong>참고문헌</strong>
                    <ul>
                        <li>『훈민정음 창제와 연구사』(강신항, 경진, 2010)</li>
                        <li>『훈민정음신연구』(이근수, 보고사, 1995)</li>
                        <li>『훈민정음연구』(강신항, 보고사, 1987)</li>
                        <li>『개정판 국어사개설』(이기문, 탑출판사, 1972)</li>
                        <li>｢중국 문자학과 『훈민정음』문자 이론｣(김주필, 『인문과학연구』48, 2005)</li>
                        <li>｢한글의 과학성과 독착성｣(김주필, 『국제고려학회 논문집』창간호, 1999)</li>
                    </ul>
                </div>
                <p>출처 : <a href='https://encykorea.aks.ac.kr/Article/E0074518'>한국민족문화 대백과 사전</a></p>
            </div>
        </div>
    );
}

export default HangulConverter;