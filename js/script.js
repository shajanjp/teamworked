const TW_BASEURL = YOUR_TW_BASEURL;
const TW_API_KEY = YOUR_TW_API_KEY;
const TW_API_KEY_BASE64 = btoa(TW_API_KEY + ":xxx");
const timeCounterElement = $('#time-counter');
const workLogDescriptionElement = $('#worklog textarea');

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

function refreshTimers(){
  return getTimers()
  .then(timersRes => {
    let timersMarkup = '';
    console.log('timers', timersRes);
    timersRes.timers.forEach(timer => {
      timersMarkup += `<div class="ui segment" data-timer-id='${timer.id}' data-is-running='${(timer.running==true) ? '1' : '0'}'>
      <h4 class="ui header">${timer.projectName}</h4>
      <p>${timer.taskName}</p>
      <div class="ui icon basic fluid buttons">
      <div class="ui button toggle-timer" title="Start / Pause / Resume timer">
      <i class="${(timer.running==true) ? 'orange pause' : 'green play'} icon"></i>
      </div>

      <div class="ui button timer-time">
      ${secondsToTime(timer.duration)}
      </div>

      <div class="ui button stop-timer" title="Stop timer">
      <i class="square red play icon"></i>
      </div>

      <div class="ui button log-time" title="Save timelog">
      <i class="blue save icon"></i>
      </div>
      </div>
      </div>`
    })

    $('#timers-list').html(timersMarkup);
    $('#timers-list').on('click', '.toggle-timer', handleTimerToggle);
  })
}

refreshTimers();

function handleTimerToggle(e){
  let currentTimer = $(this).closest('.segment');
  let currentTimerId = currentTimer.data('timer-id'); 
  let timerIsRunning = currentTimer.data('is-running');
  
  // running
  if(!!timerIsRunning){
    pauseTimer(currentTimerId)
    .then(timerPaused => {
      return refreshTimers();
    })
  }

  // paused
  else {
    resumeTimer(currentTimerId)
    .then(timerResumed => {
     return refreshTimers();
    })
  }
}

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

