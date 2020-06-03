# Phoenix Gitlab monitor

![gitlab_monitor](https://i.imgur.com/kjSeLr4.png)

### Run

With docker

    docker run --rm --name  gitlab-monitor -p 0.0.0.0:4000:4000 -d juanpabloaj/phoenix_gitlab_monitor:latest

Build image

    docker build -t juanpabloaj/phoenix_gitlab_monitor:latest .

Or to start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Send a pipeline hook with curl

    curl -H "X-Gitlab-Event: Pipeline Hook" \
        -H "content-type:application/json" -d @test/fixtures/pipeline_success.json \
        "http://localhost:4000/api"

### Configure your repository

In your gitlab repository create a webhook: Settings -> Integrations -> Add webhook.

The url field is your host, complete it with

    http://yourhost:4000/api

And in the checkbox select the pipeline events.

Learn more about gitlab webhook gitlab documentation

https://gitlab.com/help/user/project/integrations/webhooks

### To only accept some branches

    http://localhost:4000/api?branches[]=master&branches[]=develop

## Learn more about Phoenix Framework

  * Ready to run in production? Please [check our deployment guides](http://www.phoenixframework.org/docs/deployment).
  * Official website: http://www.phoenixframework.org/
  * Guides: http://phoenixframework.org/docs/overview
  * Docs: https://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix
