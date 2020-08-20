let ctx = document.getElementById('myChart').getContext('2d');
let ctxcpp=document.getElementById('myChartcpp').getContext('2d');

let getScore=()=>{
    return fetch('/score')
    .then(response=>response.json())
    .then(data=>[data.score,data.scorecpp])
}


async function displayScore(chart,score){
    let myChart = new Chart(chart, {
        type: 'line',
        data: {
            labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
            datasets: [{
                fill:false,
                label: 'Last 30 scores',
                data: score,
                backgroundColor:'black',
                borderColor: 'rgb(245, 110, 86)',
                borderWidth: 4
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
async function storeScores(){
    let [score,scorecpp]=await getScore();
    displayScore(ctx,score);
    displayScore(ctxcpp,scorecpp);
}
storeScores();