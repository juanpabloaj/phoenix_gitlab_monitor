defmodule MonitorWeb.ApiController do
  use MonitorWeb, :controller

  plug :validate_token
  plug :fetch_pipeline

  def accept_branch?(branch, branches) do
    case branches do
      [] -> true
      nil -> true
      _ -> Enum.member?(branches, branch)
    end
  end

  def put_pipeline_info(params) do
    payload = %{
      object_attributes: params["object_attributes"],
      project: params["project"],
      commit: params["commit"],
      user: params["user"]
    }

    project_id = payload.project["id"]
    name = payload.project["name"]
    pipeline_id = payload.object_attributes["id"]
    branch = payload.object_attributes["ref"]
    status = payload.object_attributes["status"]
    author = payload.commit["author"]["name"]
    username = payload.user["username"]
    message = payload.commit["message"]
    project_branch = "#{project_id}-#{branch}"

    if accept_branch?(branch, params["branches"]) do
      Monitor.PipelineCache.put project_branch, %{
        name: name,
        pipeline_id: pipeline_id,
        branch: branch,
        author: author,
        username: username,
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
            pipelines: Monitor.PipelineCache.get_all
          }
        conn
      [] -> conn
      [_] -> conn
    end
  end
  def validate_token(conn, _) do
    token = MonitorWeb.Endpoint.config(:token)
    header_token =  conn |> get_req_header("x-gitlab-token") 
    if token == "" or [token] == header_token do
      conn
    else
      conn
        |> put_status(403) 
        |> send_resp(403, "Unauthorized")
        |> halt
    end
  end
  def index(conn, _params) do
    json conn, %{message: "info received ok"}
  end
end
