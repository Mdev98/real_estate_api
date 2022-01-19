# DevCamper Backend API Specifications

Create the backend for a estate directory website. The frontend/UI will be created. All of the functionality below needs to be fully implmented in this project.

### Houses OK
- List all houses in the database
   * Pagination OK
   * Limit number of results OK
   * Filter by fields (bedroom, rooflevel, etc...) OK
- Search houses by location OK
  * Use a geocoder to get exact location and coords from a single address field
- Get single house OK
- Add new house OK
  * Authenticated users only
  * Must have the role "admin"
  * Field validation via Mongoose
- Upload a gallery for house  OK
  * admin only
  * Photo will be uploaded to local filesystem
- Update houses OK
  * admin only
  * Validation on update
- Delete house OK
  * admin only
- Calculate the average cost of all houses for a location COMMING SOON
- Calculate the average rating from the reviews for a house COMMING SOON

### Manager

- List all manager
- Create manager OK
  * Admin only
- Update manager
  * Admin only
- Delete manager
  * Admin only
- allocate manager a house
- Manager with most sell

### Customer

- List all customer
- Schedule a visit
- Cancel a visit 



### Users & Authentication
- Authentication will be done using JWT/cookies
  * JWT and cookie should expire in 30 days
- User registration
  * Register as a "user"
  * Once registered, a token will be sent along with a cookie (token = xxx)
  * Passwords must be hashed
- User login
  * User can login with email and password
  * Plain text password will compare with stored hashed password
  * Once logged in, a token will be sent along with a cookie (token = xxx)
- User logout
  * Cookie will be sent to set token = none
- Get user
  * Route to get the currently logged in user (via token)
- Password reset (lost password)
  * User can request to reset password
  * A hashed token will be emailed to the users registered email address
  * A put request can be made to the generated url to reset password
  * The token will expire after 10 minutes
- Update user info
  * Authenticated user only
  * Separate route to update password
- Users can only be made admin by updating the database field manually
- Users can only be made manager by the admin

## Security
- Encrypt passwords and reset tokens
- Prevent cross site scripting - XSS
- Prevent NoSQL injections
- Add a rate limit for requests of 100 requests per 10 minutes
- Protect against http param polution
- Add headers for security (helmet)
- Use cors to make API public (for now)

## Documentation
- Use Postman to create documentation
- Use docgen to create HTML files from Postman
- Add html files as the / route for the api

## Deployment (Digital Ocean)
- Push to Github
- Create a droplet - https://m.do.co/c/5424d440c63a
- Clone repo on to server
- Use PM2 process manager
- Enable firewall (ufw) and open needed ports
- Create an NGINX reverse proxy for port 80
- Connect a domain name
- Install an SSL using Let's Encrypt

## Code Related Suggestions
- NPM scripts for dev and production env
- Config file for important constants
- Use controller methods with documented descriptions/routes
- Error handling middleware
- Authentication middleware for protecting routes and setting user roles
- Validation using Mongoose and no external libraries
- Use async/await (create middleware to clean up controller methods)
- Create a database seeder to import and destroy data