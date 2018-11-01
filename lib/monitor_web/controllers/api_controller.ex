defmodule MonitorWeb.ApiController do
  use MonitorWeb, :controller

  def index(conn, _params) do
    MonitorWeb.Endpoint.broadcast! "room:lobby",
      "new_msg", %{body: "hello from API..."}
    json conn, %{message: "hello world"}
  end
end
