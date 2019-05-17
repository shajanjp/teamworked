const TW_BASEURL = YOUR_TW_BASEURL;
const TW_API_KEY = YOUR_TW_API_KEY;

const TW_API_KEY_BASE64 = btoa(TW_API_KEY + ":xxx");

$('#tasklist select').dropdown();
$('#boardlist select').dropdown({onChange: updateTaskList})

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
      console.log('boardCardsMarkup', boardCardsMarkup);
      $('#tasklist select').dropdown('change values', boardCardsMarkup);
    })
  }
}

function updateBoardList(value, text){
  let boardListMarkup = [];
  getProjectBoards(value)
  .then(boardsRes => {
    boardsRes.columns.forEach(board => {
      boardListMarkup.push({
        value: board.id,
        name: board.name
      })
    })
    console.log('boardListMarkup', boardListMarkup);
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

$('#toggle-timer').on('click', (e) => {
  alert('hello')
})
