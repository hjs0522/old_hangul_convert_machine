import React, { useState,useRef, useEffect } from 'react';
import * as Hangul from 'hangul-js';
import { assemble } from 'hangul-js';
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
  const vowel = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ','ㆍ',]
  const Arrow = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'];
  const convertHangul: Record<string, string> = {
      'ㅁ': 'ᅀ',
      'ㅇ': 'ㆁ',
      'ㅎ': 'ㆆ',
      'ㅏ': 'ㆍ',
      'ㅂ': 'ㅸ',
      'ㄹ': 'ㆅ',
  }
  const cho: Record<string,string> = {
    'ᅀ':encodeURI(String.fromCharCode(0x1140)),
    'ㆁ':encodeURI(String.fromCharCode(0x114C)),
    'ㆆ':encodeURI(String.fromCharCode(0x1159)),
  }
  const jung: Record<string,string> = {
    'ㅏ':encodeURI(String.fromCharCode(0x1161)),
    'ㅐ':encodeURI(String.fromCharCode(0x1162)),
    'ㅑ':encodeURI(String.fromCharCode(0x1163)),
    'ㅒ':encodeURI(String.fromCharCode(0x1164)),
    'ㅓ':encodeURI(String.fromCharCode(0x1165)),
    'ㅔ':encodeURI(String.fromCharCode(0x1166)),
    'ㅕ':encodeURI(String.fromCharCode(0x1167)),
    'ㅖ':encodeURI(String.fromCharCode(0x1168)),
    'ㅗ':encodeURI(String.fromCharCode(0x1169)),
    'ㅛ':encodeURI(String.fromCharCode(0x116D)),
    'ㅜ':encodeURI(String.fromCharCode(0x116E)),
    'ㅠ':encodeURI(String.fromCharCode(0x1172)),
    'ㅡ':encodeURI(String.fromCharCode(0x1173)),
    'ㅣ':encodeURI(String.fromCharCode(0x1175)),
    'ㆍ':encodeURI(String.fromCharCode(0x119E)),
  }

  const handleKeyUp = (e:React.KeyboardEvent) => {
    console.log('key event')
      if (e.key === '.'){
          const newWord = convertHangul[lastWord];
          if (newWord){
              //.을 찍는 순간 handleInputChange에 의해 output의 길이가 1증가한다
              setOutput(output.slice(0,cursorPosition-2)+newWord+output.slice(cursorPosition));
              setLastWord(newWord);
          }else{
              setOutput(output.slice(0,cursorPosition-1)+'.'+output.slice(cursorPosition))
              setLastWord('.');
          }
      }
      else if(Arrow.includes(e.key)){
          setCursorPosition(textareaRef.current?.selectionStart||0);
          setLastWord('');
      }
      else if(vowel.includes(e.key)){
        const firstWord = cho[lastWord]
        const secondWord = jung[e.key]
        if(firstWord && secondWord){
          setOutput(output.slice(0,cursorPosition-2)+decodeURI(firstWord+secondWord)+output.slice(cursorPosition))
        }
        setLastWord(e.key)
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
      console.log('input change event')
      const value =Hangul.disassemble(e.target.value);
      console.log(value)
      setCursorPosition(textareaRef.current?.selectionStart ||0)
      setOutput(assemble(value));
    };
  useEffect(()=>{
    console.log(output)
  },[output])
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