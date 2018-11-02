defmodule MonitorWeb.RoomChannel do
  use Phoenix.Channel
  alias MonitorWeb.Presence

  intercept ["update_presence"]

  def join("room:lobby", _message, socket) do
    send self(), :after_join
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    push socket, "presence_state", Presence.list(socket)
    {:noreply, socket}
  end

  def handle_out("update_presence", payload, socket) do
    project_id = payload.project["id"]
    name = payload.project["name"]
    pipeline_id = payload.object_attributes["id"]
    branch = payload.object_attributes["ref"]
    status = payload.object_attributes["status"]
    author = payload.commit["author"]["name"]
    message = payload.commit["message"]
    project_branch = "#{project_id}-#{branch}"

    {_, _} = Presence.track(socket, project_branch, %{})
    Presence.update(socket, project_branch, %{
      name: name,
      pipeline_id: pipeline_id,
      branch: branch,
      author: author,
      message: message,
      status: status,
      online_at: inspect(System.system_time(:millisecond))
    })

    push socket, "new_msg", payload
    {:noreply, socket}
  end
end
