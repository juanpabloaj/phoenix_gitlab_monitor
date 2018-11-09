// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/web/endpoint.ex":
import { Socket, Presence } from 'phoenix'
import timeago from 'timeago.js'
import * as templates from './templates.js'

let socket = new Socket('/socket', { params: { token: window.userToken } })

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/2" function
// in "lib/web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, pass the token on connect as below. Or remove it
// from connect if you don't care about authentication.

socket.connect()

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel('room:lobby', {})

let messagesContainer = document.querySelector('#messages')

let presences = {}

function getPipelineInfo (payload) {
  let name = payload.project.name
  let pipelineId = payload.object_attributes.id
  let branch = payload.object_attributes.ref
  let state = payload.object_attributes.status
  let author = payload.commit.author.name
  return `${name} ${branch} ${pipelineId} ${author} ${state}`
}

let listBy = (id, { metas }) => {
  if (Object.keys(metas[0]).length <= 1) {
    return {}
  }

  let pipelineDate = new Date(parseInt(metas[0].online_at))
  return {
    online_at: pipelineDate,
    dateString: pipelineDate.toISOString(),
    projectName: metas[0].name,
    pipelineId: metas[0].pipeline_id,
    branch: metas[0].branch,
    author: metas[0].author,
    message: metas[0].message,
    status: metas[0].status
  }
}

function renderPipelines (presences) {
  let pipelineList = document.querySelector('#pipelines')
  let orderedList = Presence.list(presences, listBy)
    .filter(pipeline => pipeline.status !== undefined)
    .sort((a, b) => {
      return b.online_at - a.online_at
    })

  if (orderedList.length === 0) {
    return
  }

  document.title = 'success'

  pipelineList.innerHTML = orderedList
    .slice(0, 16)
    .map((pipeline) => {
      if (pipeline.status === 'failed') {
        document.title = 'failed!'
      }
      return pipeline
    })
    .map(templates.pipelineCard)
    .join('')
  timeago().render(document.querySelectorAll('.rendered-by-timeago'))
}

channel.on('presence_state', state => {
  presences = Presence.syncState(presences, state)
  renderPipelines(presences)
})

channel.on('presence_diff', diff => {
  presences = Presence.syncDiff(presences, diff)
  renderPipelines(presences)
})

channel.on('new_msg', payload => {
  let messageItem = document.createElement('li')
  messageItem.innerText = getPipelineInfo(payload)
  // messagesContainer.appendChild(messageItem)
})

channel.join()
  .receive('ok', resp => { console.log('Joined successfully', resp) })
  .receive('error', resp => { console.log('Unable to join', resp) })

export default socket
