# React Redux with hooks CRUD example

## Stage II Example

### Background and design

This example code demonstrates how to create a simple fully functional CRUD API 
application using Redux with hooks. 

This purpose of this code is to show how to
develop a React application without many of the pitfalls Redux imposes as well as 
using good design techniques. The following constraints and design practices 
have been employed:

- Using hooks for both Global and local state with no need for Providers 
or passing state to unnecessary components.
- No Redux boilerplate code is required, no React classes and no HOC are required. 
Just pure functional components.
- Separation of data from presentation layer. This means that container 
and components are Redux agnostic and contain no Redux (such as 'dispatch') statements.
- Provide the advantages of Redux where processing is predictable as well as 
enforcing immutability which makes code efficient and maintainable.
- Provide middleware used for debugging and other middleware such as react-thunk and 
saving state to local storage. See Daishi Kato's react-hooks-global-state middleware
examples at https://github.com/dai-shi/react-hooks-global-state/tree/master/examples
for further examples.
- As the state is immutable and predictable, it is easy to test changes.
Accordingly, provide examples on how to unit test both Redux and standalone code. 
- Debugging, give to ability to test code with Redux time travel extension as well as showing
Redux state to console
- As state is stored centrally, give an example on of Optimistic rendering where data can be 
shown before the data is retrieved from an API or database.
- As state is immutable, show how actions can undone or redone back to a particular state. 
For example, a delete action can be restore by adding the deleted data back.
- As per MVC framework separate view, business logic and data access.
As part of this as well loosely coupling components. 
This design principle promotes separation of concerns that makes code easier to understand and test.
- Promote re-use by providing tested generic / abstract and encapulated classes that can be overridden and extended.

## Application

A simple fetch and CRUD client / server application. The purpose of application is to demonstrate React Redux
design and the Server is put in place to demonstrate how REST api can be called from the React client. The server 
uses the NPM package json-server to set up test data that can be accessed by REST API calls. 

The test data contains 
"firstName", "lastName" and a generated "username" which is made up lastName + first initial of firstName. 

Upon creating a new user if the username already exists a incremented digit starting from 2 is suffixed 
to username.
If updating a username that already exists then the application will throw an error.

## Prerequisites
 
Please ensure that the latest version of NPM and NodeJs are installed 
 
 ## Installing
 
```
 yarn 
```

 ## Tailoring
 
 - If you want to change the number of generated users open "generateData.js" and default users from 20
 - If you to simulate load time open package.json, go to "start:server" and change the --delay=0 to adjust 
 the delay in milli-seconds.   
 
## Run application
 
```
yarn start
```
 
 ## Running the tests
 ```
 yarn test
 ```
 
 ## Author
 
 **Paul Caruana** 
 
 ## Demo
 
 TBA
