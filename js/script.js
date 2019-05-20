const TW_BASEURL = YOUR_TW_BASEURL;
const TW_API_KEY = YOUR_TW_API_KEY;
const TW_API_KEY_BASE64 = btoa(TW_API_KEY + ":xxx");
const timeCounterElement = $('#time-counter');
const workLogDescriptionElement = $('#worklog textarea');

let timerIsRunning = false;
let currentTaskId;
let currentProjectId;

$('#tasklist select').dropdown({onChange: updateCurrentTask});
$('#boardlist select').dropdown({onChange: updateTaskList})

function updateCurrentTask(value, text){
  currentTaskId = value;
  workLogDescriptionElement.val(`Works on ${text || 'magic'}`);
}

function updateTaskList(value, text){
  if(value){
    let boardCardsMarkup = [];
    getBoardCards(value).then(cardRes => {
      cardRes.cards.forEach(card => {
        boardCardsMarkup.push({
          value: card.id, 
          name: card.name
        });
      })
      $('#tasklist select').dropdown('change values', boardCardsMarkup);
    })
  }
}

function updateBoardList(value, text){
  let boardListMarkup = [];
  currentProjectId = value;

  getProjectBoards(value)
  .then(boardsRes => {
    boardsRes.columns.forEach(board => {
      boardListMarkup.push({
        value: board.id,
        name: board.name
      })
    })
    $('#boardlist select')
    .dropdown('change values', boardListMarkup);
  })
}

getProjects()
.then(res => {
  let projectListMarkup = '';
  res.projects.forEach(project => {
    projectListMarkup += `<option value="${project.id}">${project.name}</option>`;
  })
  $('#projectlist select').html(projectListMarkup);
  $('#projectlist select').dropdown({
    onChange: updateBoardList
  });
})


function getCurrentDateTime() {
  let d = new Date(),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();
  hours = d.getHours();
  minutes = d.getMinutes();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  if (hours.length < 2) hours = '0' + hours;
  if (minutes.length < 2) minutes = '0' + minutes;

  return {
    date: [year, month, day].join(''), 
    time: [hours, minutes].join(':')
  };
}


let intervalCounterInstance;
let logCounter;

$('#toggle-timer').on('click', (e) => {
  // start
  if(timerIsRunning == false){
    logCounter = 0;
    timerIsRunning = true;
    $('#toggle-timer i').removeClass('play green');
    $('#toggle-timer i').addClass('pause blue');
    intervalCounterInstance = setInterval(function(){
      logCounter += 1; 
      timeCounterElement.html(`${(logCounter / 60).toFixed(0)}:${logCounter % 60}`)
    }, 1000);
  }

  // pause
  else {
    let currentDateTime = getCurrentDateTime();
    timerIsRunning = false;
    $('#toggle-timer i').removeClass('pause blue');
    $('#toggle-timer i').addClass('play green');
    clearInterval(intervalCounterInstance);
    timeCounterElement.html('00:00');
  }

})
