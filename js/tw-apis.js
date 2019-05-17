function getProjects(){
  return fetch(`${TW_BASEURL}/projects.json`, {
    headers: {
      "Authorization": "BASIC " + TW_API_KEY_BASE64,
      "Content-Type": "application/json"
    }
  })
  .then(data => {
    return data.json();
  });
}

function getProject(projectId){
  return got(`${TW_BASEURL}/projects/${projectId}.json`, {
    headers: {
      "Authorization": "BASIC " + TW_API_KEY_BASE64,
      "Content-Type": "application/json"
    }
  })
  .then(data => {
    let projectData = JSON.parse(data.body);
    return projectData.project;
  });
}

function getProjectTasks(projectId){
  return fetch(`${TW_BASEURL}/projects/${projectId}/tasks.json`, {
    headers: {
      "Authorization": "BASIC " + TW_API_KEY_BASE64,
      "Content-Type": "application/json"
    }
  })
  .then(data => {
    return data.json();
  });
}

function getTasks(){
  return fetch(`${TW_BASEURL}/tasks.json`, {
    headers: {
      "Authorization": "BASIC " + TW_API_KEY_BASE64,
      "Content-Type": "application/json"
    }
  })
  .then(data => {
    return data.json();
  });
}

function getProjectBoards(projectId){
  return fetch(`${TW_BASEURL}/projects/${projectId}/boards/columns.json`, {
    headers: {
      "Authorization": "BASIC " + TW_API_KEY_BASE64,
      "Content-Type": "application/json"
    }
  })
  .then(data => {
    return data.json();
  });
}

function getBoardCards(boardId){
  return fetch(`${TW_BASEURL}/boards/columns/${boardId}/cards.json`, {
    headers: {
      "Authorization": "BASIC " + TW_API_KEY_BASE64,
      "Content-Type": "application/json"
    }
  })
  .then(data => {
    return data.json();
  });
}