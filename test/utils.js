// Add test environment
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.test')})

// Add sinon chai assertions style
const chai = require('chai')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)