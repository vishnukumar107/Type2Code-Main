
const randomUrl="http://api.quotable.io/random";
const quoteDisplay=document.getElementById("quoteDisplay");
const quoteInput=document.getElementById("quoteInput");
const timer=document.getElementById("countDownTimer")
const refresh =document.getElementById("refresh");
const scoreBoard=document.getElementById("scoreBoard");
const chart=document.getElementById("myChart");

//global varibales
let interval,startTime,needToStart,characterTyped,totalError,error;

//Function which changes the text colour
quoteInput.addEventListener('input',()=>{
    const quoteArray=quoteDisplay.querySelectorAll('span');
    const inputArray=quoteInput.value.split('');
    characterTyped++;
    if(quoteArray.length===inputArray.length){
        displayQuote();
        totalError+=error;
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
});
//function to get quote
let getQuote=()=>{
    return fetch(randomUrl)
    .then(response=>response.json())
    .then(data=>data.content)
}

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
            quoteInput.value=null;
            totalError+=error;
            giveScore();
        }

    }
    interval=setInterval(timeIt,1000);
}

//function which displays quote
async function displayQuote(){
    const quote=await getQuote();
    //console.log(quote)
    quoteDisplay.innerHTML=''
    quote.split('').forEach(element => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText=element;
        quoteDisplay.appendChild(characterSpan);
    });
    quoteInput.value=null;
    //startTimer(60); 
}
let setVariables=()=>{
    characterTyped=0;
    totalError=0;
    timer.innerHTML='01:00'
    needToStart=true;
    scoreBoard.style.display="none";
    
}
let startProcess=()=>{
    if(needToStart){
    startTimer(80);
    needToStart=false;
    }
    //console.log("clicked inside")
}
let startFunction=()=>{
    setVariables();
    displayQuote();
}

refresh.addEventListener('click',()=>{
    clearInterval(interval);
    startFunction();
})

quoteInput.addEventListener('click',()=>{
    startProcess();
});

startFunction();