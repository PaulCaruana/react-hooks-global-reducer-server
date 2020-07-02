# React Redux with hooks CRUD example

## Stage II Example

Fully functional Redux without the drawbacks. No plumbling code, pure functions, loosely coupled components
with SOLID design principles.


For a simpler CRUD client only version with simulated asyncronous calls please refer to Stage I example 
of this code at https://github.com/PaulCaruana/react-hooks-global-reducer.

### Background and design

This purpose of this code is to show how to
develop a simple to use CRUD API React application without many of the pitfalls Redux imposes as well as 
using good design techniques. The following constraints and design practices 
have been employed:

- Using hooks for both Global and local state with no need for Providers 
or passing state to unnecessary components.
- No Redux boilerplate code, no React classes and no HOC are required. 
Just pure functional components.
- Separation of data from presentation layer. This means that containers 
and components are Redux agnostic and contain no Redux statements (such as 'dispatch').
- Provide the advantages of Redux design ensuring processing is predictable in addition to
enforcing immutability which makes code efficient and maintainable.
- Provide middleware for debugging when developing. In addition, add other middleware such as react-thunk and 
saving state to local storage. See Daishi Kato's react-hooks-global-state middleware
examples at https://github.com/dai-shi/react-hooks-global-state/tree/master/examples
for further examples.
- Provide examples on how to unit test both Redux and standalone code. 
- Debugging in development, give to ability to test code with Redux time travel browser extension as well as logging
Redux state to console.
- As state is stored centrally, give an example on of Optimistic rendering. That is, data can be 
shown from updated Redux state before the data is retrieved from an API or database.
- As state is immutable, show how actions can undone or redone back to a particular state. 
For example, a delete action can be restore by adding the deleted data back.
- As per MVC framework separate view, business logic and data access.
This design principle promotes separation of concerns that makes code easier to understand and test.
- Promote re-use by providing tested generic / abstract and encapulated classes that can be overridden 
and extended.
- Above all, the code must be designed and structured to be easy to develop and maintained.

## Application

A simple fetch and CRUD client / server application. The purpose of this application is to demonstrate React Redux
design solution which meets the criteria above. The Server is put in place to demonstrate how REST api calls from React
only. FYI, the server uses the NPM package json-server to simulate client based REST API calls. 

The test data generated on the server contains 
"firstName", "lastName" and a generated "username" which is made up lastName + first initial of firstName. 

On the add user page, if the username already exists a incremented digit starting from 2 is suffixed 
to username.
If updating a username that already exists, the application will throw an error.

## Tailoring
 
 - If you want to change the number of generated users, open "generateData.js" and change the default users from 20
 - If you to simulate load time, open package.json, go to "start:server" line and change the --delay=0 to adjust 
 the delay in milli-seconds.   

## Prerequisites
 
Please ensure that the latest version of NPM and NodeJs are installed 
 
## Installing
 
```
yarn 
```
 
## Run application
 
```
yarn start
```
 
 ## Running the tests
```
yarn test
```
  
 ## Build
```
yarn build
```

## Author
 
**Paul Caruana**
 
## Demo
 
 TBA
