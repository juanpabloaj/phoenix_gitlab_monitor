let statusClassTranslator = (status) => {
  switch (status) {
    case 'failed':
      status = 'danger'
      break
    case 'running':
      status = 'primary'
      break
  }

  return status
}

export let pipelineCard = (pipeline) => `
  <div class="col-sm-3">
    <div class="card text-white bg-${statusClassTranslator(pipeline.status)} mb-3">
      <div class="card-body">
        <h5 class="card-title">${pipeline.projectName} (${pipeline.branch})</h5>
        <p class="card-text">${pipeline.author}: ${pipeline.message}</p>
      </div>
      <div class="card-footer">
        <ul class="nav justify-content-between">
          <li class="nav-item">
          #${pipeline.pipelineId} ${pipeline.status}
          </li>
          <li class="nav-item">
          ${pipeline.timeAgo}
          </li>
        </ul>
      </div>
    </div>
  </div>
`
