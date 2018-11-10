defmodule Monitor.PipelineCache do
  use GenServer

  def start_link do
    GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  end

  def init(state) do
    :ets.new(:pipelines_cache, [:set, :public, :named_table])
    {:ok, state}
  end

  def put(key, pipeline_data) do
    GenServer.cast(__MODULE__, {:put, key, pipeline_data})
  end

  def get_all() do
    GenServer.call(__MODULE__, {:get_all})
  end

  def handle_call({:get_all}, _from, state) do
    reply =
      case :ets.tab2list(:pipelines_cache) do
        [] -> []
        pipelines -> Enum.map(pipelines, fn {_, value} -> value end)
      end

    {:reply, reply, state}
  end

  def handle_cast({:put, key, data}, state) do
    :ets.insert(:pipelines_cache, {key, data})
    {:noreply, state}
  end

end
