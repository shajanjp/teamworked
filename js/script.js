let TW_BASEURL = '';
let TW_API_KEY = '';
let TW_API_KEY_BASE64 = btoa(TW_API_KEY + ":xxx");
const timeCounterElement = $('#time-counter');
const workLogDescriptionElement = $('#worklog textarea');

let currentTaskId;
let currentProjectId;

$('#boardlist select').dropdown({onChange: updateTaskList})
$('#tasklist select').dropdown({onChange: onTaskChange})
$('.ui .accordion').accordion()

function onTaskChange(value, text){
  $('#tasklist').data('task-id', value);
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
      $('#tasklist select')
      .dropdown('change values', boardCardsMarkup);
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

// refreshTimers();

function handleTimerDelete(e){
  let currentTimer = $(this).closest('.segment');
  let currentTimerId = currentTimer.data('timer-id'); 
  let timerIsRunning = currentTimer.data('is-running');
  deleteTimer(currentTimerId)
  .then(timerDeleted => {
    refreshTimers();
  })
}

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

$('#configure-form-button').on('click', (e) => {
  $('#configure-tw-form').modal('toggle');
})

$('.save-config-confirm').on('click', (e) => {
  TW_BASEURL = $('#configure-tw-form').find('#tw-base-url').val() 
  TW_API_KEY = $('#configure-tw-form').find('#tw-api-key').val() 
  TW_API_KEY_BASE64 = btoa(TW_API_KEY + ":xxx");
  console.log('TW_BASEURL TW_API_KEY', TW_BASEURL, TW_API_KEY);
})


$('#create-timer-confirm').on('click', (e) => {
  let projectId = $('#create-timer-form #projectlist select').dropdown('get value');
  let taskId = $('#create-timer-form #tasklist').data('task-id');
  startTimer({
    projectId, 
    taskId
  })
  .then(timerStarted => {
    return refreshTimers();
  })
})

$('.create-timer').on('click', (e) => {
  $('#create-timer-form').modal('show');
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
