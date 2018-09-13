# Newsletter Subscription - Serverless example

## How it works?	
### Users subscription & Welcome email
![Screenshot](https://i.imgur.com/dPrLp9N.png)

### Engaging State Machine
![Screenshot](https://i.imgur.com/qruGQhW.png)


## Requirements
- [Node.js](https://nodejs.org)
- [Serverless framework](https://serverless.com/)

## How to deploy?
- Install dependencies -> `npm i`
- Create the `SENDGRID_API_KEY` parameter on SSM Parameter Store. You can do this from the AWS Console or using the AWS CLI:

```
aws ssm put-parameter --name SENDGRID_API_KEY --type String --value 'API_KEY_HERE' --region us-east-2
```

- Run `sls deploy`

## How to run tests?
Just run `npm test`

## How to remove the Stack?
Just run `sls remove`. If you have non-empty s3 buckets, you can add the `--force` option (use it carefully).

## TODO
- Improve IAMRole
- Manage batch errors in mailer
