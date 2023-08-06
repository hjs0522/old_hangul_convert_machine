import React, { useState,useRef, useEffect } from 'react';
import * as Hangul from 'hangul-js';
import { a, assemble } from 'hangul-js';
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
type Table = Record<string,string>;

//대응되는 값을 찾아주는 함수
function mapping(str:string, table:Table) {
  for(let l = 2; l >= 0; l--) {
    for(let k in table) {
      if(k.length <= l) continue;
      str = str.split(k).join(table[k]);
    }
  }
  return str;
}

const HangulConverter: React.FC = () => {
	//현재의 초성 문자 -> 옛한글 초성
	const cho_cur_to_old:Table = {};
	//옛한글 초성 -> 현재의 초성
	const cho_old_to_cur:Table = {};
	//현재 중성 -> 옛한글 중성
	const jung_cur_to_old:Table = {};
	//옛한글 중성 -> 현재 중성
	const jung_old_to_cur:Table = {};
	//현재 종성 -> 옛한글 종성
	const jong_cur_to_old:Table = {};
	//옛한글 종성 -> 현재 종성
	const jong_old_to_cur:Table = {};
	//ㅜ,ㅠ 특수키 조합 -> 옛한글 초성
	const specialkey_to_oldcho:Table = {};
  
  //조합형 자모에 대응되는 초성들
	const tableCho:Table = {
    '\u3131':'\u1100',
    '\u3132':'\u1101',
    '\u3134':'\u1102',
    '\u3137':'\u1103',
    '\u3138':'\u1104',
    '\u3139':'\u1105',
    '\u3141':'\u1106',
    '\u3142':'\u1107',
    '\u3143':'\u1108',
    '\u3145':'\u1109',
    '\u3146':'\u110A',
    '\u3147':'\u110B',
    '\u3148':'\u110C',
    '\u3149':'\u110D',
    '\u314A':'\u110E',
    '\u314B':'\u110F',
    '\u314C':'\u1110',
    '\u314D':'\u1111',
    '\u314E':'\u1112',
    '\u1100':'\u1100',
    '\u1101':'\u1101',
    '\u1102':'\u1102',
    '\u1103':'\u1103',
    '\u1104':'\u1104',
    '\u1105':'\u1105',
    '\u1106':'\u1106',
    '\u1107':'\u1107',
    '\u1108':'\u1108',
    '\u1109':'\u1109',
    '\u110A':'\u110A',
    '\u110B':'\u110B',
    '\u110C':'\u110C',
    '\u110D':'\u110D',
    '\u110E':'\u110E',
    '\u110F':'\u110F',
    '\u1110':'\u1110',
    '\u1111':'\u1111',
    '\u1112':'\u1112',
    '\u1140':'\u1140',
    '\u1159':'\u1159',
  };
  
  /* 자음(초성) + Shift키 -> 옛한글 매핑 테이블
	 ** ㅠ+Shift, ㅜ+Shift도 자음으로 매핑되므로 이 테이블에 포함됨
	*/
	const tableChoShift:Table = {
    '\u3141':'\u1140',
    '\u3147':'\u114C',
    '\u314E':'\u1159',
    '\u314B':'\u113C',
    '\u314C':'\u113E',
    '\u314A':'\u114E',
    '\u314D':'\u1150',
    '\u3160':'\u1154',
    '\u315C':'\u1155',
  };
  
  /* 모음 -> 옛한글 매핑 테이블 */
	const tableJung:Table = {
    '\u314F':'\u1161',
    '\u3150':'\u1162',
    '\u3151':'\u1163',
    '\u3152':'\u1164',
    '\u3153':'\u1165',
    '\u3154':'\u1166',
    '\u3155':'\u1167',
    '\u3156':'\u1168',
    '\u3157':'\u1169',
    '\u315B':'\u116D',
    '\u315C':'\u116E',
    '\u3160':'\u1172',
    '\u3161':'\u1173',
    '\u3163':'\u1175',
    '\u1161':'\u1161',
    '\u1162':'\u1162',
    '\u1163':'\u1163',
    '\u1164':'\u1164',
    '\u1165':'\u1165',
    '\u1166':'\u1166',
    '\u1167':'\u1167',
    '\u1168':'\u1168',
    '\u1169':'\u1169',
    '\u116D':'\u116D',
    '\u116E':'\u116E',
    '\u1172':'\u1172',
    '\u1173':'\u1173',
    '\u1175':'\u1175',
    '\u119E':'\u119E',
  };
  
  /* 자음(종성) -> 옛한글 매핑 테이블 */
	const tableJong:Table = {
    '\u3131':'\u11A8',
    '\u3132':'\u11A9',
    '\u3134':'\u11AB',
    '\u3137':'\u11AE',
    '\u3139':'\u11AF',
    '\u3141':'\u11B7',
    '\u3142':'\u11B8',
    '\u3145':'\u11BA',
    '\u3146':'\u11BB',
    '\u3147':'\u11BC',
    '\u3148':'\u11BD',
    '\u314A':'\u11BE',
    '\u314B':'\u11BF',
    '\u314C':'\u11C0',
    '\u314D':'\u11C1',
    '\u314E':'\u11C2',
    '\u11A8':'\u11A8',
    '\u11A9':'\u11A9',
    '\u11AB':'\u11AB',
    '\u11AE':'\u11AE',
    '\u11AF':'\u11AF',
    '\u11B7':'\u11B7',
    '\u11B8':'\u11B8',
    '\u11BA':'\u11BA',
    '\u11BB':'\u11BB',
    '\u11BC':'\u11BC',
    '\u11BD':'\u11BD',
    '\u11BE':'\u11BE',
    '\u11BF':'\u11BF',
    '\u11C0':'\u11C0',
    '\u11C1':'\u11C1',
    '\u11C2':'\u11C2',
  };
  
  //종성을 같은 글자 초성유니코드로 변환
  const JongToCho:Table = {}
  for(let key in tableJong){
    if (tableCho.hasOwnProperty(key) && tableCho[key] !== tableJong[key]){
      JongToCho[tableJong[key]] = tableCho[key]
    }
  }
  
  /* 자음(종성) + Shift키 -> 옛한글 매핑 테이블 */
	const tableJongShift:Table = {
    '\u3141':'\u11EB',
    '\u3147':'\u11F0',
    '\u314E':'\u11F9',
  };
  
  /* 옛한글 초성 분해 테이블 */
	const array_oldCho = [
    'ㄴㄱ',
    'ㄴㄴ',
    'ㄴㄷ',
    'ㄴㅂ',
    'ㄷㄱ',
    'ㄹㄴ',
    'ㄹㄹ',
    'ㄹㅎ',
    'ㄹㅇ',
    'ㅁㅂ',
    'ㅁㅇ',
    'ㅂㄱ',
    'ㅂㄴ',
    'ㅂㄷ',
    'ㅂㅅ',
    'ㅂㅅㄱ',
    'ㅂㅅㄷ',
    'ㅂㅅㅂ',
    'ㅂㅅㅅ',
    'ㅂㅅㅈ',
    'ㅂㅈ',
    'ㅂㅊ',
    'ㅂㅌ',
    'ㅂㅍ',
    'ㅂㅇ',
    'ㅃㅇ',
    'ㅅㄱ',
    'ㅅㄴ',
    'ㅅㄷ',
    'ㅅㄹ',
    'ㅅㅁ',
    'ㅅㅂ',
    'ㅅㅂㄱ',
    'ㅅㅅㅅ',
    'ㅅㅇ',
    'ㅅㅈ',
    'ㅅㅊ',
    'ㅅㅋ',
    'ㅅㅌ',
    'ㅅㅍ',
    'ㅅㅎ',
    '\u113C',
    '\u113C\u113C',
    '\u113E',
    '\u113E\u113E',
    '\u1140',
    'ㅇㄱ',
    'ㅇㄷ',
    'ㅇㅁ',
    'ㅇㅂ',
    'ㅇㅅ',
    'ㅇ\u1140',
    'ㅇㅇ',
    'ㅇㅈ',
    'ㅇㅊ',
    'ㅇㅌ',
    'ㅇㅍ',
    '\u114C',
    'ㅈㅇ',
    '\u114E',
    '\u114E\u114E',
    '\u1150',
    '\u1150\u1150',
    'ㅊㅋ',
    'ㅊㅎ',
    '\u1154',
    '\u1155',
    'ㅍㅂ',
    'ㅍㅇ',
    'ㅎㅎ',
    '\u1159',
    'ㄱㄷ',
    'ㄴㅅ',
    'ㄴㅈ',
    'ㄴㅎ',
    'ㄷㄹ',
  ];
  
  /* 옛한글 초성 분해 테이블 (유니코드 5.2 추가 영역) */
	const array_oldCho2 = [
    'ㄷㅁ',
    'ㄷㅂ',
    'ㄷㅅ',
    'ㄷㅈ',
    'ㄹㄱ',
    'ㄹㄱㄱ',
    'ㄹㄷ',
    'ㄹㄷㄷ',
    'ㄹㅁ',
    'ㄹㅂ',
    'ㄹㅂㅂ',
    'ㄹㅂㅇ',
    'ㄹㅅ',
    'ㄹㅈ',
    'ㄹㅋ',
    'ㅁㄱ',
    'ㅁㄷ',
    'ㅁㅅ',
    'ㅂㅅㅌ',
    'ㅂㅋ',
    'ㅂㅎ',
    'ㅅㅅㅂ',
    'ㅇㄹ',
    'ㅇㅎ',
    'ㅉㅎ',
    'ㅌㅌ',
    'ㅍㅎ',
    'ㅎㅅ',
    '\u1159\u1159',
  ];
  
  /* 옛한글 중성 분해 테이블 */
	const array_oldJung = [
    'ㅏ',
    'ㅐ',
    'ㅑ',
    'ㅒ',
    'ㅓ',
    'ㅔ',
    'ㅕ',
    'ㅖ',
    'ㅗ',
    'ㅗㅏ',
    'ㅗㅐ',
    'ㅗㅣ',
    'ㅛ',
    'ㅜ',
    'ㅜㅓ',
    'ㅜㅔ',
    'ㅜㅣ',
    'ㅠ',
    'ㅡ',
    'ㅡㅣ',
    'ㅣ',
    'ㅏㅗ',
    'ㅏㅜ',
    'ㅑㅗ',
    'ㅑㅛ',
    'ㅓㅗ',
    'ㅓㅜ',
    'ㅓㅡ',
    'ㅕㅗ',
    'ㅕㅜ',
    'ㅗㅓ',
    'ㅗㅔ',
    'ㅗㅖ',
    'ㅗㅗ',
    'ㅗㅜ',
    'ㅛㅑ',
    'ㅛㅒ',
    'ㅛㅕ',
    'ㅛㅗ',
    'ㅛㅣ',
    'ㅜㅏ',
    'ㅜㅐ',
    'ㅜㅓㅡ',
    'ㅜㅖ',
    'ㅜㅜ',
    'ㅠㅏ',
    'ㅠㅓ',
    'ㅠㅔ',
    'ㅠㅕ',
    'ㅠㅖ',
    'ㅠㅜ',
    'ㅠㅣ',
    'ㅡㅜ',
    'ㅡㅡ',
    'ㅡㅣㅜ',
    'ㅣㅏ',
    'ㅣㅑ',
    'ㅣㅗ',
    'ㅣㅜ',
    'ㅣㅡ',
    'ㅣㅏㅏ',
    'ㅏㅏ',
    'ㅏㅏㅓ',
    'ㅏㅏㅜ',
    'ㅏㅏㅣ',
    'ㅏㅏㅏㅏ',
    'ㅏㅡ',
    'ㅑㅜ',
    'ㅕㅑ',
    'ㅗㅑ',
    'ㅗㅒ',
  ];
  
  /* 옛한글 중성 분해 테이블 (유니코드 5.2 추가 영역) */
	const array_oldJung2 = [
    'ㅗㅕ',
    'ㅗㅗㅣ',
    'ㅛㅏ',
    'ㅛㅐ',
    'ㅛㅓ',
    'ㅜㅕ',
    'ㅜㅣㅣ',
    'ㅠㅐ',
    'ㅠㅗ',
    'ㅡㅏ',
    'ㅡㅓ',
    'ㅡㅔ',
    'ㅡㅗ',
    'ㅣㅑㅗ',
    'ㅣㅒ',
    'ㅣㅕ',
    'ㅣㅖ',
    'ㅣㅗㅣ',
    'ㅣㅛ',
    'ㅣㅠ',
    'ㅣㅣ',
    'ㅏㅏㅏ',
    'ㅏㅏㅔ',
  ];
  
  /* 옛한글 종성 분해 테이블 (유니코드 5.2 추가 영역) */
	const array_oldJong = [
    'ㄱ',
    'ㄲ',
    'ㄱㅅ',
    'ㄴ',
    'ㄴㅈ',
    'ㄴㅎ',
    'ㄷ',
    'ㄹ',
    'ㄹㄱ',
    'ㄹㅁ',
    'ㄹㅂ',
    'ㄹㅅ',
    'ㄹㅌ',
    'ㄹㅍ',
    'ㄹㅎ',
    'ㅁ',
    'ㅂ',
    'ㅂㅅ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
    'ㄱㄹ',
    'ㄱㅅㄱ',
    'ㄴㄱ',
    'ㄴㄷ',
    'ㄴㅅ',
    'ㄴ\u1140',
    'ㄴㅌ',
    'ㄷㄱ',
    'ㄷㄹ',
    'ㄹㄱㅅ',
    'ㄹㄴ',
    'ㄹㄷ',
    'ㄹㄷㅎ',
    'ㄹㄹ',
    'ㄹㅁㄱ',
    'ㄹㅁㅅ',
    'ㄹㅂㅅ',
    'ㄹㅂㅎ',
    'ㄹㅂㅇ',
    'ㄹㅅㅅ',
    'ㄹ\u1140',
    'ㄹㅋ',
    'ㄹ\u1159',
    'ㅁㄱ',
    'ㅁㄹ',
    'ㅁㅂ',
    'ㅁㅅ',
    'ㅁㅅㅅ',
    'ㅁ\u1140',
    'ㅁㅊ',
    'ㅁㅎ',
    'ㅁㅇ',
    'ㅂㄹ',
    'ㅂㅍ',
    'ㅂㅎ',
    'ㅂㅇ',
    'ㅅㄱ',
    'ㅅㄷ',
    'ㅅㄹ',
    'ㅅㅂ',
    '\u1140',
    'ㅇㄱ',
    'ㅇㄱㄱ',
    'ㅇㅇ',
    'ㅇㅋ',
    '\u114C',
    'ㅇㅅ',
    'ㅇ\u1140',
    'ㅍㅂ',
    'ㅍㅇ',
    'ㅎㄴ',
    'ㅎㄹ',
    'ㅎㅁ',
    'ㅎㅂ',
    '\u1159',
    'ㄱㄴ',
    'ㄱㅂ',
    'ㄱㅊ',
    'ㄱㅋ',
    'ㄱㅎ',
    'ㄴㄴ',
  ];
  
  /* 옛한글 종성 분해 테이블 (유니코드 5.2 추가 영역) */
	const array_oldJong2 = [
    'ㄴㄹ',
    'ㄴㅊ',
    'ㄷㄷ',
    'ㄷㄷㅂ',
    'ㄷㅂ',
    'ㄷㅅ',
    'ㄷㅅㄱ',
    'ㄷㅈ',
    'ㄷㅊ',
    'ㄷㅌ',
    'ㄹㄱㄱ',
    'ㄹㄱㅎ',
    'ㄹㄹㅋ',
    'ㄹㅁㅎ',
    'ㄹㅂㄷ',
    'ㄹㅂㅍ',
    'ㄹㅇ',
    'ㄹ\u1159ㅎ',
    'ㄹㅇ',
    'ㅁㄴ',
    'ㅁㄴㄴ',
    'ㅁㅁ',
    'ㅁㅂㅅ',
    'ㅁㅈ',
    'ㅂㄷ',
    'ㅂㄹㅍ',
    'ㅂㅁ',
    'ㅂㅂ',
    'ㅂㅅㄷ',
    'ㅂㅈ',
    'ㅂㅊ',
    'ㅅㅁ',
    'ㅅㅂㅇ',
    'ㅅㅅㄱ',
    'ㅅㅅㄷ',
    'ㅅ\u1140',
    'ㅅㅈ',
    'ㅅㅊ',
    'ㅅㅌ',
    'ㅅㅎ',
    '\u1140ㅂ',
    '\u1140ㅂㅇ',
    'ㅇㅁ',
    'ㅇㅎ',
    'ㅈㅂ',
    'ㅈㅂㅂ',
    'ㅈㅈ',
    'ㅍㅅ',
    'ㅍㅌ',
    ];
  for(let i in array_oldCho) {
    //해당 글자에 대응되는 옛한글(같은 글자임에도 유니코드가 다른 경우가 존재)
    const t = mapping(array_oldCho[i], tableCho);
    const u = String.fromCharCode(0x1113 + (Number(i)));
    if(t === u) {
      continue;
    }
    
    cho_cur_to_old[t] = u;
    cho_old_to_cur[u] = t;
  }
  
  
  for(let i in array_oldCho2) {
		const t = mapping(array_oldCho2[i], tableCho);
		const u = String.fromCharCode(0xA960 + Number(i));
		if(t === u) continue;
		cho_cur_to_old[t] = u;
		cho_old_to_cur[u] = t;
	}
  
  for(let i in tableChoShift) {
		if(tableCho[i]) {
			cho_cur_to_old[tableCho[i] + '.'] = tableChoShift[i];
		} else if(tableJung[i]) {
			specialkey_to_oldcho[tableJung[i] + '.'] = tableChoShift[i];
		}
	}
	//ㅅㅅ -> ㅆ
	cho_cur_to_old['\u1109\u1109'] = '\u110A';
	//ㅆ -> ㅅㅅ
	cho_old_to_cur['\u110A'] = '\u1109\u1109';
  //ᄼ. -> ᄽ
	cho_cur_to_old['\u113C.'] = '\u113D';
	//ᄾ. -> ᄿ
	cho_cur_to_old['\u113E.'] = '\u113F';
	//ᅎ. -> ᅏ
	cho_cur_to_old['\u114E.'] = '\u114F';
	//ᅐ. -> ᅑ
	cho_cur_to_old['\u1150.'] = '\u1151';
	
	for(let i in array_oldJung) {
		const t = mapping(array_oldJung[i], tableJung);
		const u = String.fromCharCode(0x1161 + Number(i));
		if(t === u) continue;
		jung_cur_to_old[t] = u;
		jung_old_to_cur[u] = t;
	}
	
	for(let i in array_oldJung2) {
		const t = mapping(array_oldJung2[i], tableJung);
		const u = String.fromCharCode(0xD7B0 + Number(i));
		if(t === u) continue;
		jung_cur_to_old[t] = u;
		jung_old_to_cur[u] = t;
	}
	
	for(let i in array_oldJong) {
		const t = mapping(array_oldJong[i], tableCho);
		const u = String.fromCharCode(0x11A8 + Number(i));
		if(t === u) continue;
		jong_cur_to_old[t] = u;
		if(t.indexOf('\u1140') >= 0) {
			jong_cur_to_old[t.replace('\u1140', '\u1106.')] = u;
		} else if(t.indexOf('\u1159') >= 0) {
			jong_cur_to_old[t.replace('\u1159', '\u1112.')] = u;
		}
		jong_old_to_cur[u] = t;
	}

  for(let i in array_oldJong2) {
		let t = mapping(array_oldJong2[i], tableCho);
		let u = String.fromCharCode(0xD7CB + Number(i));
		if(t === u) continue;
		jong_cur_to_old[t] = u;
		if(t.indexOf('\u1140') >= 0) {
			jong_cur_to_old[t.replace('\u1140', '\u1106.')] = u;
		} else if(t.indexOf('\u1159') >= 0) {
			jong_cur_to_old[t.replace('\u1159', '\u1112.')] = u;
		}
		jong_old_to_cur[u] = t;
	}
	
	for(let i in tableJongShift) {
		jong_cur_to_old[tableCho[i] + '.'] = tableJongShift[i];
	}
  jong_cur_to_old['\u1109\u1109'] = '\u11BB';
	jong_old_to_cur['\u11BB'] = '\u1109\u1109';

	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [output, setOutput] = useState('');
	const handleInputChange = (e:React.ChangeEvent<HTMLTextAreaElement>) =>{
    const value = Hangul.disassemble(e.target.value);
    const result:string[] = []
    let cho:string[] = []
    let jung:string[] = []
    let jong:string[] = []
    let count = 0
    let temp = ''
    for(let i=0;i<value.length;i++){
      const ch = value[i]
      //초성이 입력된 경우
      temp = ''
      if(count === 0){
        if(tableCho[ch]){
          cho.push(tableCho[ch])
          count+=1
        }
        else if(cho_old_to_cur[ch]){
          cho = cho.concat([...cho_old_to_cur[ch].split('')])
          count+=1
        }
        else if(tableJung[ch]){
          jung.push(tableJung[ch])
          count=2
        }
        else if(jung_old_to_cur[ch]){
          jung = jung.concat([...jung_old_to_cur[ch].split('')])
          count =2
        }
        else{
          temp = ch
        }
      }
      else if(count === 1){
        //count가 1인데 초성이 들어온 경우 조합되는 단어일 수 있음
        if(tableCho[ch]){
          cho.push(tableCho[ch])
        }
        else if(ch==='.'){
          cho.push('.')
        }
        else if(tableJung[ch]){
          jung.push(tableJung[ch])
          count+=1
        }
        else if(jung_old_to_cur[ch]){
          jung = jung.concat([...jung_old_to_cur[ch].split('')])
          count +=1
        }
        else{
          temp=ch
          count = 0
        }
      }
      else if(count === 2){
        //종성이 초성으로 바뀌는 경우
        if(i+1 < value.length && JongToCho[ch]){
          const next_ch = value[i+1]
          if(tableJung[next_ch] || jung_old_to_cur[next_ch]){
            count = 1
            const sumCho = cho_cur_to_old[cho.join('')] || cho.join('')
            const sumJung = jung_cur_to_old[jung.join('')] || jung.join('')
            result.push(sumCho+sumJung)
            cho = []
            jung = []
            jong = []
            cho.push(JongToCho[ch])
            continue
          }
        }
        if(tableJung[ch]){
          jung.push(tableJung[ch])
        }
        else if (tableJong[ch]){
          jong.push(tableJong[ch])
          count +=1
        }
        else if(jong_old_to_cur[ch])
        {
          jong = jong.concat([...jong_old_to_cur[ch].split('')])
          count+=1
        }
        else{
          temp=ch
          count = 0
        }
      }
      count = count%3
      if(count === 0){
        const sumCho = cho_cur_to_old[cho.join('')] || cho.join('')
        const sumJung = jung_cur_to_old[jung.join('')] || jung.join('')
        const sumJong = jong_cur_to_old[jong.join('')] || jong.join('')
        cho = []
        jung = []
        jong = []
        result.push(sumCho+sumJung+sumJong)
        result.push(temp)
      }
      
    }
    const sumCho = cho_cur_to_old[cho.join('')] || cho.join('')
    const sumJung = jung_cur_to_old[jung.join('')] || jung.join('')
    const sumJong = jong_cur_to_old[jong.join('')] || jong.join('')
    cho = []
    jung = []
    jong = []
    result.push(sumCho+sumJung+sumJong)
    setOutput(result.join(''));
	}
  return (
    <div className={'container'}>
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
                    <li>'ㅏ' + 'ㅏ' : 'ㆍ'</li>
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