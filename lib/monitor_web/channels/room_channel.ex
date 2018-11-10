defmodule MonitorWeb.RoomChannel do
  use Phoenix.Channel

  def join("room:lobby", _message, socket) do
    send self(), :after_join
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    push socket, "update_pipelines", %{
      "pipelines": Monitor.PipelineCache.get_all
    }
    {:noreply, socket}
  end
end
