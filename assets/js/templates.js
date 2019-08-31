let statusClassTranslator = (status) => {
  let className = 'secondary'
  switch (status) {
    case 'success':
      className = status
      break
    case 'failed':
      className = 'danger'
      break
    case 'running':
      className = 'primary'
      break
    case 'canceled':
      className = 'secondary'
      break
  }

  return className
}

export let pipelineCard = (pipeline) => `
  <div class="col-sm-3">
    <div class="card text-white bg-${statusClassTranslator(pipeline.status)} mb-3">
      <div class="card-body">
        <h5 class="card-title">${pipeline.projectName} (${pipeline.branch})</h5>
        <p class="card-text">
          ${pipeline.author}: ${pipeline.commitTitle}<br>
          triggered by: ${pipeline.username}
        </p>
      </div>
      <div class="card-footer">
        <ul class="nav justify-content-between">
          <li class="nav-item">
          #${pipeline.pipelineId} ${pipeline.status}
          </li>
          <li class="nav-item rendered-by-timeago" datetime="${pipeline.dateString}">
          </li>
        </ul>
      </div>
    </div>
  </div>
`
