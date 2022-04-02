const basic = {
    'false':      '![]',
    'true':       '!![]',
    'undefined':  '[][[]]',
    'NaN':        '+[![]]',
    'Infinity':   '+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]]+[+[]])'
};

const basicNumber = "+!![]";

const types = {
    'String':   '(([]+[])["constructor"])',
};

let map = {
    'a':'(false+"")[1]',
    'b':'([]["entries"]()+"")[2]',
    'c':'([]["flat"]+"")[3]',
    'd':'(undefined+"")[2]',
    'e':'(true+"")[3]',
    'f':'(false+"")[0]',
    'g':'(false+[0]+String)[20]',
    'h':'(+(101))["to"+String["name"]](21)[1]',
    'i':'([false]+undefined)[10]',
    'j':'([]["entries"]()+"")[3]',
    'k':'(+(20))["to"+String["name"]](21)',
    'l':'(false+"")[2]',
    'm':'([]+(+[])["constructor"])[11]',
    'n':'(undefined+"")[1]',
    'o':'(true+[]["flat"])[10]',
    'p':'(+(211))["to"+String["name"]](31)[1]',
    'q':'("")["fontcolor"]([0]+false+")[20]',
    'r':'(true+"")[1]',
    's':'(false+"")[3]',
    't':'(true+"")[0]',
    'u':'(undefined+"")[0]',
    'v':'(+(31))["to"+String["name"]](32)',
    'w':'(+(32))["to"+String["name"]](33)',
    'x':'(+(101))["to"+String["name"]](34)[1]',
    'y':'(NaN+[Infinity])[10]',
    'z':'(+(35))["to"+String["name"]](36)',
    ' ':'(NaN+[]["flat"])[11]'
}

let specialWords = {
    'flat': 'flat',
    'constructor': 'constructor',
    'entries': 'entries',
    'to': 'to',
    'fontcolor': 'fontcolor',
    'name': 'name'
}

function clearString(string){
    return string.replace(/\[|\]|\(|\)|\+|\!/g, '');
}

function getNumber(number){
    if(number == 0) return "+[]";
    let result = "";
    for(let i = 0; i < number; i++){
        result += basicNumber;
    }
    return result;
}

function replaceFromObj(replace, obj){
    let string = replace.slice();
    for(let value in obj){
        string = string.replace(value, obj[value]);
    }
    return string;
}

function replaceSpecialWords(){
    for(let el in specialWords){
        replaceMap();
        specialWords[el] = replaceFromObj(specialWords[el], specialWords);
        specialWords[el] = specialWords[el].split('').map(elem => replaceFromObj(elem, map)).join('+');
    }

    replaceMap();
}

function replaceMap(){
    for(let el in map){
        map[el] = replaceFromObj(map[el], basic);
        map[el] = replaceFromObj(map[el], types);
        map[el] = replaceFromObj(map[el], specialWords);

        map[el] = map[el].replace(/\"\"/g, '[]');
        map[el] = map[el].replace(/\"/g, '');
    }
}

function replaceNumber(string) {
    let num = "";
    let arrayNum = [];

    for(let i = 0; i < string.length; i++){
        if(+string[i] >= 0){
            num += string[i];
        }else if(num){
            arrayNum.push(num);
            num = "";
        }
    }

    arrayNum = Array.from(new Set(arrayNum));

    arrayNum.sort((a, b) => b - a);

    let result = string.slice();

    arrayNum.forEach(el => {
        result = result.replace(new RegExp(el, 'g'), getNumber(el));
    });

    return result;
}

function convertToJsfuck(string = ""){
    replaceSpecialWords();

    let result = [];
    
    string.split('').forEach(el => {
        result.push(map[el]);
    });

    return replaceNumber(result.join('+'));
}