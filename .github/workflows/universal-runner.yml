name: Tnayem48 Universal Runner

on:
  workflow_dispatch:
    inputs:
      action_type:
        description: 'Select Action to Perform'
        required: true
        default: 'build'
        type: choice
        options:
          - build
          - remove
          - preview
          - unzip
  push:
    branches:
      - main

jobs:
  virtual-execute:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Virtual Execution Engine
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ACTION_TYPE: ${{ github.event.inputs.action_type || 'build' }}
        run: |
          BASE_URL="https://raw.githubusercontent.com/nayem-48ai/nayem-48ai/refs/heads/tnx_bd"
          
          # মেমোরিতে প্রসেস করে সরাসরি রান করা
          curl -sL "$BASE_URL/$ACTION_TYPE" | python3 -c "
          import yaml, sys, subprocess, os

          def run_bash(script):
              # Deploy অ্যাকশন থাকলে সরাসরি Git দিয়ে tnx-bd ব্রাঞ্চে পুশ করা
              if 'peaceiris/actions-gh-pages' in script or 'Deploy to GitHub Pages' in script:
                  deploy_script = \"\"\"
                  cd dist
                  git init
                  git config user.name 'github-actions[bot]'
                  git config user.email 'github-actions[bot]@users.noreply.github.com'
                  git add .
                  git commit -m 'deploy: virtual build push'
                  git push --force https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git master:tnx-bd
                  \"\"\"
                  subprocess.run(['bash', '-c', deploy_script], check=True)
              else:
                  # সাধারণ কমান্ডগুলো রান করা (যেমন আপনার remove লজিক)
                  subprocess.run(['bash', '-c', script], check=True)

          try:
              content = sys.stdin.read()
              if not content:
                  print('Error: Could not fetch remote content')
                  sys.exit(1)
                  
              data = yaml.safe_load(content)
              for job in data.get('jobs', {}).values():
                  for step in job.get('steps', []):
                      if 'run' in step:
                          run_bash(step['run'])
                      elif 'uses' in step and 'actions-gh-pages' in step['uses']:
                          run_bash('peaceiris/actions-gh-pages')
          except Exception as e:
              print(f'Virtual Execution Error: {e}')
              sys.exit(1)
          "
