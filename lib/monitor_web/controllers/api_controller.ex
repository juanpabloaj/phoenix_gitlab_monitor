defmodule MonitorWeb.ApiController do
  use MonitorWeb, :controller

  plug :fetch_pipeline

  def put_pipeline_info(params) do
    payload = %{
      object_attributes: params["object_attributes"],
      project: params["project"],
      commit: params["commit"]
    }

    project_id = payload.project["id"]
    name = payload.project["name"]
    pipeline_id = payload.object_attributes["id"]
    branch = payload.object_attributes["ref"]
    status = payload.object_attributes["status"]
    author = payload.commit["author"]["name"]
    message = payload.commit["message"]
    project_branch = "#{project_id}-#{branch}"

    if Enum.member?(params["branches"] || [], branch) do
      Monitor.PipelineCache.put project_branch, %{
        name: name,
        pipeline_id: pipeline_id,
        branch: branch,
        author: author,
        message: message,
        status: status,
        online_at: inspect(System.system_time(:millisecond))
      }
    end
  end

  def fetch_pipeline(conn, _) do
    case conn |> get_req_header("x-gitlab-event") do
      ["Pipeline Hook"] ->
        put_pipeline_info(conn.params)

        MonitorWeb.Endpoint.broadcast! "room:lobby",
          "update_pipelines", %{
            "pipelines": Monitor.PipelineCache.get_all
          }
        conn
      [] -> conn
      [_] -> conn
    end
  end

  def index(conn, _params) do
    json conn, %{message: "info received ok"}
  end
end
