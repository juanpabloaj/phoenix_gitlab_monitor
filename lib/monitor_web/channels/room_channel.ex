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
    pipeline_id = payload.project["id"]
    status = payload.object_attributes["status"]

    {_, _} = Presence.track(socket, pipeline_id, %{})
    Presence.update(socket, pipeline_id, %{status: status})
    push socket, "new_msg", payload
    {:noreply, socket}
  end
end
