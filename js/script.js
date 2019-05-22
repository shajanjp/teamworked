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
$('.ui .accordion').accordion()

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

function secondsToTime(seconds){
  let h = (seconds/3600).toFixed(0);
  let m = ((seconds%3600)/60).toFixed(0);
  let s = (seconds%60).toFixed(0);
  return `${h}:${m}:${s}`;
}

getTimers()
.then(timersRes => {
  let timersMarkup = '';
  console.log('timers', timersRes);
  timersRes.timers.forEach(timer => {
    timersMarkup += `<div class="ui segment" data-timerId='${timer.id}' data-isRunning='${(timer.running==true) ? '1' : '0'}'>
    <h4 class="ui header">${timer.projectName}</h4>
    <p>${timer.taskName}</p>
    <div class="ui icon basic fluid buttons">
    <div class="ui button" title="Start / Pause / Resume timer" data-state="paused" id="toggle-timer">
    <i class="${(timer.running==true) ? 'orange pause' : 'green play'} icon"></i>
    </div>

    <div class="ui button" id="timer-time">
    ${secondsToTime(timer.duration)}
    </div>

    <div class="ui button" title="Stop timer" id="complete-timer">
    <i class="square red play icon"></i>
    </div>

    <div class="ui button" title="Save timelog" id="save-timer">
    <i class="blue save icon"></i>
    </div>
    </div>
    </div>`
  })

  $('#timers-list').html(timersMarkup);

})

$('.create-timer').on('click', (e) => {
  $('.create-timer-form').modal('show');
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
})

$('#toggle-timer').on('click', (e) => {
  // start
  if(timerIsRunning == false){
    timerIsRunning = true;
    $('#toggle-timer i').removeClass('play green');
    $('#toggle-timer i').addClass('pause orange');
  }

  // pause
  else {
    timerIsRunning = false;
    $('#toggle-timer i').removeClass('pause orange');
    $('#toggle-timer i').addClass('play green');
  }

})
