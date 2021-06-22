# Serveless

## Documentation
Click [here](https://www.serverless.com/)

## Geting Started
Initiating the project with: `serverless create --template aws-nodejs --path nodeless`

## Dependencies
Create a IAM user with admin permissions
- Get the <i>access key</i> and <i>secret key</i> information

Create or update <i>.aws/credentials</i> file by running: `config credentials -o --provider aws --key=<ACCESS_KEY> --secret <SECRET_KEY>`

## Information
There era three ways to dispatch a serverless function
1. HTTP Route: by an adrress in a browser 
  - Dispatched by the event by the backend api (HTTP)
2. Event
  - Dispatched by another AWS functions 
3. Command line
  - Dispatched by running: `serverless invoke -f handle -l`
    - `-l`: to list all the operations

> `serverless remove` can delete all data related to this functions        

## Files
### serveless.yml
- <b>service:</b> unique name of the service
- <b>provider:</b> google, azure, aws...
  - runtime: node version
- <b>functions:</b>
  - optimize: name of the serverless file
  - handler: name of the serverless function(optimize.handle)

### optimize.js
- <b>handle:</b> serverless function

## Run/Deploy
Run the command: `serverless deploy -v`
- `-v`: verbose output