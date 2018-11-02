// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/web/endpoint.ex":
import { Socket, Presence } from 'phoenix'

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
  return {
    id: id,
    status: metas[0].status,
    online_at: metas[0].online_at
  }
}

function renderPipelines (presences) {
  let pipelineList = document.querySelector('#pipelines')
  pipelineList.innerHTML = Presence.list(presences, listBy)
    .sort((a, b) => {
      return new Date(parseInt(b.online_at)) - new Date(parseInt(a.online_at))
    })
    .map(presence => `
      <div class="col-sm-4">
        <div class="card text-white bg-success mb-3">
          <div class="card-header">${presence.id}</div>
          <div class="card-body">
            <h5 class="card-title">${presence.id} ${presence.status}</h5>
            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
          </div>
        </div>
      </div>
    `)
    .join('')
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
  messagesContainer.appendChild(messageItem)
})

channel.join()
  .receive('ok', resp => { console.log('Joined successfully', resp) })
  .receive('error', resp => { console.log('Unable to join', resp) })

export default socket
