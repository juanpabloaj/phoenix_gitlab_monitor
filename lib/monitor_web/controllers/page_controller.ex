defmodule MonitorWeb.PageController do
  use MonitorWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
