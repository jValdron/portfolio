See http://www.valdron.ca

Initial Setup
=============
After pulling, just run `npm install` and then `bower install` and you should be able to run the server with `node server`.

Deployment
==========
To deploy to production, setup a production.js file in config and then run `grunt build --target=production` followed by `grunt deploy --target=production`.