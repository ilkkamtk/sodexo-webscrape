/**
 * @api {post} /auth/login User Login
 * @apiName UserLogin
 * @apiGroup Authentication
 *
 * @apiDescription Logs in a user with the provided credentials.
 *
 * @apiParam {String} username User's username.
 * @apiParam {String} password User's password.
 *
 * @apiExample {json} Example Request:
 *     POST /auth/login
 *     Content-Type: application/json
 *
 *     {
 *       "username": "john.doe",
 *       "password": "password123"
 *     }
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} token JWT token for authentication.
 * @apiSuccess {Object} data User object containing user information.
 * @apiSuccess {String} data.username User's username.
 * @apiSuccess {String} data.email User's email address.
 * @apiSuccess {String} data.favouriteRestaurant User's favorite restaurant ID.
 * @apiSuccess {String} data._id User's ID.
 * @apiSuccess {String} data.role User's role ('admin' or 'user').
 * @apiSuccess {String} data.avatar User's avatar filename.
 *
 * @apiError (Error 200) {String} message Error message.
 * @apiError (Error 200) {String} message Incorrect username/password.
 * @apiError (Error 200) {String} message User not activated.
 * @apiError (Error 500) {String} message Internal server error.
 */

/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiDescription Creates a new user.
 *
 * @apiParam {String} username User's username.
 * @apiParam {String} password User's password.
 * @apiParam {String} email User's email address.
 *
 * @apiExample {json} Example Request:
 *     POST /users
 *     Content-Type: application/json
 *
 *     {
 *       "username": "john.doe",
 *       "password": "password123",
 *       "email": "john.doe@example.com",
 *     }
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} data User object containing user information.
 * @apiSuccess {String} data.username User's username.
 * @apiSuccess {String} data.email User's email address.
 * @apiSuccess {String} data.favouriteRestaurant User's favorite restaurant ID.
 * @apiSuccess {String} data._id User's ID.
 * @apiSuccess {String} data.role User's role ('user').
 * @apiSuccess {Boolean} data.activated Indicates if the user is activated.
 * @apiSuccess {String} activationUrl Activation URL for the user.
 *
 * @apiError (Error 400) {String} message Error message.
 */

/**
 * @api {put} /users Update Current User
 * @apiName UpdateCurrentUser
 * @apiGroup User
 * @apiDescription Update the current user's information.
 *
 * @apiHeader {String} Authorization User's access token (Bearer Token).
 *
 * @apiParam {string} [username] User's username.
 * @apiParam {string} [password] User's password.
 * @apiParam {string} [email] User's email.
 * @apiParam {ObjectId} [favouriteRestaurant] User's favorite restaurant ID.
 * @apiParam {string} [avatar] User's avatar filename.
 *
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} data Updated user data (excluding password).
 * @apiSuccess {String} data.username User's username.
 * @apiSuccess {ObjectId} data.favouriteRestaurant User's favorite restaurant ID.
 * @apiSuccess {ObjectId} data._id User's ID.
 * @apiSuccess {String} data.avatar User's avatar URL.
 * @apiSuccess {String} data.role User's role ('admin' or 'user').
 *
 * @apiError (401 Unauthorized) Unauthorized Only authenticated users can update their information.
 * @apiError (400 Bad Request) BadRequest Failed to update user information.
 */

/**
 * @api {delete} /users Delete Current User
 * @apiName DeleteCurrentUser
 * @apiGroup User
 * @apiDescription Delete the current user's account.
 *
 * @apiHeader {String} Authorization User's access token (Bearer Token).
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} data Deleted user data.
 * @apiSuccess {String} data.username User's username.
 * @apiSuccess {ObjectId} data.favouriteRestaurant User's favorite restaurant ID.
 * @apiSuccess {ObjectId} data._id User's ID.
 * @apiSuccess {String} data.avatar User's avatar URL.
 * @apiSuccess {String} data.role User's role ('admin' or 'user').
 *
 * @apiError (401 Unauthorized) Unauthorized Only authenticated users can delete their account.
 * @apiError (400 Bad Request) BadRequest Failed to delete user account.
 */

/**
 * @api {get} /users/token Get Current User by Token
 * @apiName CheckToken
 * @apiGroup User
 * @apiDescription Check the validity of the access token and retrieve user information.
 *
 * @apiHeader {String} Authorization User's access token (Bearer Token).
 *
 * @apiSuccess {String} username User's username.
 * @apiSuccess {String} email User's email address.
 * @apiSuccess {ObjectId} favouriteRestaurant User's favorite restaurant ID.
 * @apiSuccess {ObjectId} _id User's ID.
 * @apiSuccess {String} avatar User's avatar URL.
 * @apiSuccess {String} role User's role ('admin' or 'user').
 *
 * @apiError (403 Forbidden) Forbidden Token is not valid.
 */

/**
 * @api {get} /users/available/:username Check Username Availability
 * @apiName CheckUserExists
 * @apiGroup User
 * @apiDescription Check if a username is available or already taken.
 *
 * @apiParam {String} username User's username to check.
 *
 * @apiSuccess {Boolean} available Indicates whether the username is available (true) or already taken (false).
 *
 * @apiError (400 Bad Request) BadRequest Error occurred while processing the request.
 */

/**
 * @api {get} /restaurants Get Restaurants
 * @apiName GetRestaurants
 * @apiGroup Restaurants
 *
 * @apiDescription Retrieves a list of restaurants.
 *
 * @apiSuccess {Object[]} restaurants List of restaurants.
 * @apiSuccess {String} restaurants._id Restaurant ID.
 * @apiSuccess {Number} restaurants.companyId Company's internal ID of the restaurant. Don't use as Restaurant ID.
 * @apiSuccess {String} restaurants.name Name of the restaurant.
 * @apiSuccess {String} restaurants.address Address of the restaurant.
 * @apiSuccess {String} restaurants.postalCode Postal code of the restaurant.
 * @apiSuccess {String} restaurants.city City of the restaurant.
 * @apiSuccess {String} restaurants.phone Phone number of the restaurant.
 * @apiSuccess {Object} restaurants.location Location coordinates of the restaurant.
 * @apiSuccess {String} restaurants.location.type Type of the location ('Point').
 * @apiSuccess {Number[]} restaurants.location.coordinates Array containing the longitude and latitude coordinates of the restaurant.
 * @apiSuccess {String} restaurants.company Company associated with the restaurant ('Sodexo' or 'Compass Group').
 *
 * @apiError (Error 404) {String} message Restaurant not found error message.
 * @apiError (Error 500) {String} message Internal server error message.
 */

/**
 * @api {get} /restaurants/:id Get Restaurant
 * @apiName GetRestaurant
 * @apiGroup Restaurants
 *
 * @apiDescription Retrieves a restaurant.
 *
 * @apiParam {String} id Restaurant ID.
 *
 * @apiSuccess {String} _id Restaurant ID.
 * @apiSuccess {Number} companyId Company's internal ID of the restaurant. Don't use as Restaurant ID.
 * @apiSuccess {String} name Name of the restaurant.
 * @apiSuccess {String} address Address of the restaurant.
 * @apiSuccess {String} postalCode Postal code of the restaurant.
 * @apiSuccess {String} city City of the restaurant.
 * @apiSuccess {String} phone Phone number of the restaurant.
 * @apiSuccess {Object} location Location coordinates of the restaurant.
 * @apiSuccess {String} location.type Type of the location ('Point').
 * @apiSuccess {Number[]} location.coordinates Array containing the longitude and latitude coordinates of the restaurant.
 * @apiSuccess {String} company Company associated with the restaurant ('Sodexo' or 'Compass Group').
 *
 * @apiError (Error 404) {String} message Restaurant not found error message.
 * @apiError (Error 500) {String} message Internal server error message.
 */

/**
 * @api {get} /restaurants/daily/:id/:lang Get Daily Menu
 * @apiName GetDailyMenu
 * @apiGroup Restaurants
 *
 * @apiDescription Retrieves the daily menu for a restaurant.
 *
 * @apiParam {Number} id Restaurant ID.
 * @apiParam {String} lang Language of the menu ('en' or 'fi').
 *
 * @apiSuccess {Object[]} courses List of courses in the daily menu.
 * @apiSuccess {String} courses.name Name of the course.
 * @apiSuccess {String} courses.price Price of the course.
 * @apiSuccess {String} courses.diets Diets associated with the course.
 *
 * @apiError (Error 404) {String} message Restaurant not found error message.
 * @apiError (Error 500) {String} message Internal server error message.
 */

/**
 * @api {get} /restaurants/weekly/:id/:lang Get Weekly Menu
 * @apiName GetWeeklyMenu
 * @apiGroup Restaurants
 *
 * @apiDescription Retrieves the weekly menu for a restaurant.
 *
 * @apiParam {String} id Restaurant ID.
 * @apiParam {String} lang Language of the menu ('en' or 'fi').
 *
 * @apiSuccess {Object[]} days List of days in the weekly menu.
 * @apiSuccess {String} days.date Date of the day's menu.
 * @apiSuccess {Object[]} days.courses List of courses in the day's menu.
 * @apiSuccess {String} days.courses.name Name of the course.
 * @apiSuccess {String} days.courses.price Price of the course.
 * @apiSuccess {String} days.courses.diets Diets associated with the course.
 *
 * @apiError (Error 404) {String} message Restaurant not found error message.
 * @apiError (Error 500) {String} message Internal server error message.
 */

/**
 * @api {delete} /restaurants/:id Delete Restaurant (Admin only)
 * @apiName DeleteRestaurant
 * @apiGroup Restaurants
 *
 * @apiDescription Deletes a restaurant by its ID.
 *
 * @apiParam {String} id Restaurant ID.
 *
 * @apiHeader {String} Authorization User's JWT token (Bearer Token).
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiError (Error 401) {String} message Unauthorized error message.
 * @apiError (Error 404) {String} message Restaurant not found error message.
 */

/**
 * @api {post} /users/avatar Upload Avatar
 * @apiName UploadAvatar
 * @apiGroup User
 * @apiDescription Uploads an avatar image for a user. Files can be accessed from the '/uploads' folder.
 *
 * @apiHeader {String} Authorization User's JWT token (Bearer Token).
 *
 * @apiParam (Request Body - multipart/formdata) {File} avatar The avatar image file to be uploaded.
 *
 * @apiSuccess (Success 200) {String} message Success message.
 * @apiSuccess (Success 200) {Object} data User data with updated avatar information.
 * @apiSuccess (Success 200) {String} data._id User ID.
 * @apiSuccess (Success 200) {String} data.avatar Avatar filename.
 *
 * @apiError (Error 400) {String} error Error message.
 * @apiError (Error 401) {String} error Unauthorized error message.
 */
