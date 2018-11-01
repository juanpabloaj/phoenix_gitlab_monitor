defmodule MonitorWeb.ApiController do
  use MonitorWeb, :controller

  plug :fetch_pipeline

  def pipeline_info(params) do
    %{
      object_attributes: params["object_attributes"],
      project: params["project"],
      commit: params["commit"]
    }
  end

  def fetch_pipeline(conn, _) do
    case conn |> get_req_header("x-gitlab-event") do
      [] -> conn
      ["Pipeline Hook"] ->
        MonitorWeb.Endpoint.broadcast! "room:lobby",
          "new_msg",
          %{body: pipeline_info(conn.params)}
        conn
    end
  end

  def index(conn, _params) do
    json conn, %{message: "info received ok"}
  end
end
