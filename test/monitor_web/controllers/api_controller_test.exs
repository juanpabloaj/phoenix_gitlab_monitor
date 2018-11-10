defmodule MonitorWeb.ApiControllerTest do
  use MonitorWeb.ConnCase
  alias MonitorWeb.ApiController

  test "Accept branch", %{} do
    branches = ["develop", "master"]
    branch = "develop"
    assert ApiController.accept_branch?(branch, branches) == true
  end

  test "reject branch", %{} do
    branches = ["develop", "master"]
    branch = "other-branch"
    assert ApiController.accept_branch?(branch, branches) == false
  end

  test "Accept branch with empty list", %{} do
    branches = []
    branch = "other-branch"
    assert ApiController.accept_branch?(branch, branches) == true
  end

  test "Accept branch with nil", %{} do
    branches = nil
    branch = "other-branch"
    assert ApiController.accept_branch?(branch, branches) == true
  end
end
