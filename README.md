# Capstone-Project

Database Schema Design

## API Documentation

## USER AUTHENTICATION/AUTHORIZATION

### All endpoints that require authentication

All endpoints that require a current user to be logged in.

- Request: endpoints that require authentication
- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the
correct role(s) or permission(s).

- Request: endpoints that require proper authorization
- Error Response: Require proper authorization

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Forbidden"
    }
    ```

### Get the Current User

Returns the information about the current user that is logged in.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /users/:userID
  - Body: none

- Successful Response when there is a logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- Successful Response when there is no logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": null
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's
information.

- Require Authentication: false
- Request

  - Method: POST
  - Route path: /login
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "credential": "john.smith@gmail.com",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- Error Response: Invalid credentials

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Invalid credentials"
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "credential": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current
user's information.

- Require Authentication: false
- Request

  - Method: POST
  - Route path: /signup
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- Error response: User already exists with the specified email or username

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already exists",
      "errors": {
        "email": "User with that email already exists",
        "username": "User with that username already exists"
      }
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "firstName": "First Name is required",
        "lastName": "Last Name is required"
      }
    }
    ```

## Gifts

### Get all Gifts

Returns all the gifts.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /gifts
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Gifts": [
        {
          "id": 1,
          "userId": 1,
          "name": "App Academy Gift 1",
          "description": "Wonderful Present",
          "price": 123,
          "quantity": 2,
          "purchased": true,
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "previewImage": "image url"
        }
      ]
    }
    ```

### Get all Gifts added by the Current User

Returns all the gifts added (created) by the current user.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /users/:userId/gifts
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Gifts": [
        {
          "id": 1,
          "userId": 1,
          "name": "App Academy Gift 1",
          "description": "Wonderful Present",
          "price": 123,
          "quantity": 2,
          "purchased": true,
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "previewImage": "image url"
        }
      ]
    }
    ```

### Get details of a Gift from an id

Returns the details of a gift specified by its id.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /gifts/:giftId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {

      "id": 1,
      "userId": 1,
      "name": "App Academy Gift 1",
      "description": "Wonderful Present",
      "price": 123,
      "quantity": 2,
      "purchased": true,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36",
      "previewImage": "image url"
      "GiftImages": [
        {
          "id": 1,
          "url": "image url",
          "preview": true
        },
        {
          "id": 2,
          "url": "image url",
          "preview": false
        }
      ],
      "User": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith"
      }
    }
    ```

- Error response: Couldn't find a Gift with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Gift couldn't be found"
    }
    ```

### Create a Gift

Creates and returns a new gift.

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /gifts
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "name": "App Academy",
      "description": "Wonderful Present",
      "price": 123
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "name": "App Academy",
      "description": "Wonderful Present",
      "price": 123,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "name": "Name must be less than 50 characters",
        "description": "Description is required",
        "price": "Price must be a positive number"
      }
    }
    ```

### Add an Image to a Gift based on the Gift's id

Create and return a new image for a spot specified by id.

- Require Authentication: true
- Require proper authorization: Spot must belong to the current user
- Request

  - Method: POST
  - Route path: /gifts/:giftId/images
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "url": "image url",
      "preview": true
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "url": "image url",
      "preview": true
    }
    ```

- Error response: Couldn't find a Spot with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Gift couldn't be found"
    }
    ```

### Edit a Gift

Updates and returns an existing gift.

- Require Authentication: true
- Require proper authorization: Gift must belong to the current user
- Request

  - Method: PUT
  - Route path: /gifts/:giftId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "name": "App Academy",
      "description": "Wonderful Present",
      "price": 123,
      "quantity": 1
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "name": "App Academy",
      "description": "Wonderful Present",
      "price": 123,
      "quantity": 1,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "name": "Name must be less than 50 characters",
        "description": "Description is required",
        "price": "Price must be a positive number",
        "quantity": "Quantity must be between 1 and 9999"
      }
    }
    ```

- Error response: Couldn't find a Gift with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Gift couldn't be found"
    }
    ```

### Delete a Gift

Deletes an existing gift.

- Require Authentication: true
- Require proper authorization: Gift must belong to the current user
- Request

  - Method: DELETE
  - Route path: /gifts/:giftId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Gift with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Gift couldn't be found"
    }
    ```

## COMMENTS

### Get all Comments of the Current User

Returns all the comments written by the current user.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /users/:userId/reviews
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Comments": [
        {
          "id": 1,
          "userId": 1,
          "giftId": 1,
          "comment": "This was an awesome gift!",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "User": {
            "id": 1,
            "firstName": "John",
            "lastName": "Smith"
          },
          "Gifts": {
            "id": 1,
            "userId": 1,
            "name": "App Academy Gift 1",
            "description": "Wonderful Present",
            "price": 123,
            "quantity": 2,
            "previewImage": "image url"
          }
        }
      ]
    }
    ```

### Get all Comments by a Gift's id

Returns all the comments that belong to a gift specified by id.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /gifts/:giftId/comments
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Comments": [
        {
          "id": 1,
          "userId": 1,
          "giftId": 1,
          "comment": "This was an awesome gift!",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "User": {
            "id": 1,
            "firstName": "John",
            "lastName": "Smith"
          }
        }
      ]
    }
    ```

- Error response: Couldn't find a gift with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Gift couldn't be found"
    }
    ```

### Create a Comment for a Gift based on the Gift's id

Create and return a new comment for a gift specified by id.

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /gifts/:giftId/comments
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "comment": "This was an awesome gift!"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "giftId": 1,
      "comment": "This was an awesome gift!",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "comment": "Comment text is required"
      }
    }
    ```

- Error response: Couldn't find a Gift with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Gift couldn't be found"
    }
    ```

### Edit a Comment

Update and return an existing comment.

- Require Authentication: true
- Require proper authorization: Review must belong to the current user
- Request

  - Method: PUT
  - Route path: /comments/:commentId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "comment": "This was an awesome gift!"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "giftId": 1,
      "comment": "This was an awesome gift!",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-20 10:06:40"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "comment": "Comment text is required"
      }
    }
    ```

- Error response: Couldn't find a Review with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Review couldn't be found"
    }
    ```

### Delete a Comment

Delete an existing comment.

- Require Authentication: true
- Require proper authorization: Review must belong to the current user
- Request

  - Method: DELETE
  - Route path: /comments/:commentId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Review with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Comment couldn't be found"
    }
    ```

## Purchases

### Get all of the Current User's Purchases

Return all the purchases that the current user has made.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /users/:userId/purchases
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Purchases": [
        {
          "id": 1,
          "userId": 2,
          "giftId": 1,
          "quantity": 2,
          "totalPrice": 120,
          "text": "I wish you the best with this gift",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "Gifts": {
            "id": 1,
            "userId": 1,
            "name": "App Academy Gift 1",
            "description": "Wonderful Present",
            "price": 123,
            "quantity": 2,
            "previewImage": "image url"
          },
          "Users": {
            "userId": 2,
            "firstName": "John",
            "lastName": "Smith"
          }
        }
      ]
    }
    ```

### Get all Purchases for a Gift based on a Gift's id

Return all the purchases for a gift specified by userId.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /gifts/userId/purchases
  - Body: none

- Successful Response: If you ARE NOT the owner.

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Purchases": [
        {
          "giftId": 1,
          "quantity": 1,
          "totalPrice": 120
        }
      ]
    }
    ```

- Successful Response: If you ARE the owner.

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Purchases": [
        {
          "User": {
            "id": 2,
            "firstName": "John",
            "lastName": "Smith"
          },
          "id": 1,
          "giftId": 1,
          "userId": 2,
          "quantity": 1,
          "totalPrice": 120,
          "text": "I wish you the best with this gift",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36"
        }
      ]
    }
    ```

- Error response: Couldn't find a Gift with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Gift couldn't be found"
    }
    ```

### Create a Purchase for a Gift based on the Gift's id

Create and return a new purchase for a gift specified by id.

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /gifts/:giftId/purchases
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "quantity": 1,
      "totalPrice": 160,
      "text": "I wish you the best with this gift"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "giftId": 1,
      "userId": 2,
      "quantity": 1,
      "totalPrice": 120,
      "text": "I wish you the best with this gift",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request" // (or "Validation error" if generated by Sequelize),
      "errors": {
        "quantity": "quantity cannot exceed the requested quantity",
        }
    }
    ```

- Error response: Couldn't find a Gift with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Gift couldn't be found"
    }
    ```

- Error response: Purchase conflict

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Sorry, this gift has already met the requested quantity"
    }
    ```

### Edit a Purchase

Update and return an existing purchase.

- Require Authentication: true
- Require proper authorization: Purchase must belong to the current user
- Request

  - Method: PUT
  - Route path: /purchases/:purchaseId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "quantity": 2,
      "totalPrice": 320,
      "text": "I wish you the best with these gifts" (optional)
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "giftId": 1,
      "userId": 2,
      "quantity": 2,
      "totalPrice": 240,
      "text": "I wish you the best with these gifts",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "quantity": "quantity cannot exceed the requested quantity"
      }
    }
    ```

- Error response: Couldn't find a Purchase with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Purchase couldn't be found"
    }
    ```

- Error response: Purchase conflict

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Sorry, this gift has already been purchased with the requested quantity",
      "errors": {
        "quantity": "quantity cannot exceed the requested quantity"
      }
    }
    ```

### Delete a Purchase

Delete an existing Purchase.

- Require Authentication: true
- Require proper authorization: Purchase must belong to the current user or the
  Gift must belong to the current user
- Request

  - Method: DELETE
  - Route path: /purchases/:purchaseId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Purchase with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Purchase couldn't be found"
    }
    ```

- Error response: Purchases that have been paid can't be deleted

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Purchases that have been paid can't be deleted"
    }
    ```

## LIKES

### Get all Likes on a Gift

Returns all likes on a specific Gift.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /gifts/:giftId/likes
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "likes": [
        {
          "id": 1,
          "userId": 2,
          "giftId": 3,
          "createdAt": "2024-12-17 20:39:36",
          "updatedAt": "2024-12-17 20:39:36"
        }
      ]
    }
    ```

### Like a Gift

Allows a user to like a specific gift.

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /gifts/:giftId/likes
  - Body: none

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 10,
      "userId": 1,
      "giftId": 3,
      "createdAt": "2024-12-17 20:39:36",
      "updatedAt": "2024-12-17 20:39:36"
    }
    ```

- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

- Error Response: Couldn't find a Gift with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Gift not found"
    }
    ```

- Error Response: Bad request

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User has already liked this gift"
    }
    ```

### Unlike a Gift

Allows a user to remove their like from a specific gift.

- Require Authentication: true
- Request

  - Method: DELETE
  - Route path: /gifts/:giftId/likes/:likeId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    { "message": "Successfully unliked the gift." }
    ```

## IMAGES

### Delete a Gift Image

Delete an existing image for a Gift.

- Require Authentication: true
- Require proper authorization: Gift must belong to the current user
- Request

  - Method: DELETE
  - Route path: /gifts/:giftId/images/:imageId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Gift Image with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Gift Image couldn't be found"
    }
    ```

## Add Query Filters to Get All Gifts

Return spots filtered by query parameters.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /gifts
  - Query Parameters
    - page: integer, minimum: 1, default: 1
    - size: integer, minimum: 1, maximum: 20, default: 20
    - minLat: decimal, optional
    - maxLat: decimal, optional
    - minLng: decimal, optional
    - maxLng: decimal, optional
    - minPrice: decimal, optional, minimum: 0
    - maxPrice: decimal, optional, minimum: 0
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Spots": [
        {
          "id": 1,
          "ownerId": 1,
          "address": "123 Disney Lane",
          "city": "San Francisco",
          "state": "California",
          "country": "United States of America",
          "lat": 37.7645358,
          "lng": -122.4730327,
          "name": "App Academy",
          "description": "Place where web developers are created",
          "price": 123,
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "avgRating": 4.5,
          "previewImage": "image url"
        }
      ],
      "page": 2,
      "size": 20
    }
    ```

- Error Response: Query parameter validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "page": "Page must be greater than or equal to 1",
        "size": "Size must be between 1 and 20",
        "maxLat": "Maximum latitude is invalid",
        "minLat": "Minimum latitude is invalid",
        "minLng": "Maximum longitude is invalid",
        "maxLng": "Minimum longitude is invalid",
        "minPrice": "Minimum price must be greater than or equal to 0",
        "maxPrice": "Maximum price must be greater than or equal to 0"
      }
    }
    ```
