const paragraph="As the name suggests uses objects in programming. Object-oriented programming aims to implement real-world entities like inheritance, hiding, polymorphism, etc in programming. The main aim of OOP is to bind together the data and the functions that operate on them so that no other part of the code can access this data except that function."
const randomUrl="http://api.quotable.io/random";
const quoteDisplay=document.getElementById("quoteDisplay");
const quoteInput=document.getElementById("quoteInput");
const timer=document.getElementById("countDownTimer")
const refresh =document.getElementById("refresh");
const scoreBoard=document.getElementById("scoreBoard");
const chart=document.getElementById("myChart");
const cpp=document.getElementById("cpp");
const basic=document.getElementById("basic");

//global varibales
let interval,startTime,needToStart,characterTyped,totalError,error,para;

let=displaypara=()=>{
    quoteDisplay.innerHTML=''
    paragraph.split('').forEach(element => {
            const characterSpan = document.createElement('span');
            characterSpan.innerText=element;
            quoteDisplay.appendChild(characterSpan);
    });
    const quoteArray=quoteDisplay.querySelectorAll('span');
    quoteArray[0].classList.add('highlight');
    quoteArray[0].setAttribute("id","scroll-view");
    const scorllView=document.getElementById('scroll-view');
    scorllView.scrollIntoView(true);
    quoteArray[0].removeAttribute("id");
}

let colorDisplay=(inputArray)=>{
    characterTyped++;
    const quoteArray=quoteDisplay.querySelectorAll('span');
    if(quoteArray.length===0){
        return;
    }
    if(inputArray.length>=1){
    quoteArray[inputArray.length-1].classList.remove('highlight');
    }
    quoteArray[inputArray.length+1].classList.remove('highlight');
    quoteArray[inputArray.length].classList.add('highlight');
    if(inputArray.length>=1){
        quoteArray[inputArray.length-1].removeAttribute("id");
    }
    quoteArray[inputArray.length].setAttribute("id","scroll-view");
    const scorllView=document.getElementById('scroll-view');
    scorllView.scrollIntoView(true);
    inputArray=inputArray.split('');
    if(quoteArray.length===inputArray.length){
        para='';
        displaypara();
    }
    error=0;
    quoteArray.forEach((characterQuote,index)=>{
        let character=inputArray[index];
        if(character==null){
            characterQuote.classList.remove('correct');
            characterQuote.classList.remove('incorrect');
        }
        else if(character===characterQuote.innerText){
            characterQuote.classList.add('correct');
            characterQuote.classList.remove('incorrect');
        }
        else{
            characterQuote.classList.add('incorrect');
            characterQuote.classList.remove('correct');
            error++;
        }
    });
    totalError=error;
}
let quote=(e)=>{
    if(e.keyCode == 32) {
        e.preventDefault();
    }
    if(e.keyCode==8){
       // console.log('backspace is hit');
       e.preventDefault();
        para=para.slice(0,-1);
    }
    else{
    let value = String.fromCharCode(e.keyCode);
    para=para+value;
    }
    //console.log(para);
    colorDisplay(para);
}
quoteDisplay.addEventListener('keypress',(e)=>quote(e))
quoteDisplay.addEventListener('keydown',(e)=>{
    if(e.keyCode==8){
        quote(e);
    }
})
//Function to calculate time
let convertToSeconds=(sec)=>{
    let min=Math.floor(sec/60);
    sec=sec%60;
    if(min<10 && sec<10)return '0'+min+':'+'0'+sec;
    else if(min<10)return '0'+min+':'+sec;
    else if(sec<10)return min+':'+'0'+sec;
    return min+":"+sec;
}
async function postData(url = '', data = {}) {
    console.log(data);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) 
    });
    return response.json(); 
  }
let giveScore=()=>{
    scoreBoard.style.display="block";
    let accuracy = (((characterTyped-totalError) / characterTyped) * 100);
    //Need to change if the timing is increased
    let cpm = Math.round(characterTyped-totalError); 
    let wpm = Math.round(((characterTyped-totalError) / 5)); 
    document.getElementById("errors").innerHTML=totalError;
    document.getElementById("cpm").innerHTML=cpm;
    document.getElementById("wpm").innerHTML=wpm;
    document.getElementById("accuracy").innerHTML=`${Math.round(accuracy)}%`;
    postData('/api', { score: wpm })
        .then(data => {console.log(data);})
        .catch(err=>console.log('The user is not logged in'))

    console.log(characterTyped);
}
let startTimer=(sec)=>{
    startTime=new Date();
    timer.innerHTML=convertToSeconds(sec);
    let timeIt=()=>{
        let newTime=Math.floor((new Date() - startTime) / 1000)
        timer.innerHTML=convertToSeconds(sec-newTime);
        if(sec<=newTime){
            clearInterval(interval);
            quoteDisplay.innerHTML=null;
            totalError+=error;
            giveScore();
            //quoteDisplay.removeAttribute("tabindex");
        }

    }
    interval=setInterval(timeIt,1000);
}

let setVariables=()=>{
    //quoteDisplay.setAttribute("tabindex","1");
    para='';
    characterTyped=0;
    totalError=0;
    timer.innerHTML='01:00'
    needToStart=true;
    scoreBoard.style.display="none";
    
}
let startProcess=()=>{
    if(needToStart){
    startTimer(6);
    needToStart=false;
    }
    //console.log("clicked inside")
}
let startFunction=()=>{
    setVariables();
    displaypara();
}

refresh.addEventListener('click',()=>{
    clearInterval(interval);
    startFunction();
})

quoteDisplay.addEventListener('click',()=>{
    startProcess();
});
cpp.addEventListener('click',()=>{
    clearInterval(interval);
    console.log('cpp');
})
basic.addEventListener('click',()=>{
    clearInterval(interval);
    console.log('basic');
})
startFunction();