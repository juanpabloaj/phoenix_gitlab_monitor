use Mix.Config

# In this file, we keep production configuration that
# you'll likely want to automate and keep away from
# your version control system.
#
# You should document the content of this
# file or create a script for recreating it, since it's
# kept out of version control and might be hard to recover
# or recreate for your teammates (or yourself later on).
config :monitor, MonitorWeb.Endpoint,
  secret_key_base: System.get_env("SECRET_KEY_BASE") || :crypto.strong_rand_bytes(64) |> Base.encode64 |> binary_part(0, 64)
