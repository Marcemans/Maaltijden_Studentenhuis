# Maaltijden Studentenhuis
## Endpoints
- **Check login status:** `get [URL/check]`
    - Return: status: message: 'ingelogd'
- **Get current user:** `get [URL/user]`
    - Return: 
    message: 'User details',
        user:{
            name: user.name,
            id: user.id,
            email: user.email
        }
- **Register:** `POST [URL/register]`
    - Body: name, email, password (6 karakters & 2 niet woord tekens & 1 digit), secret_key
- **Login:** `POST [URL/login]` 
    - Body: email, password
    - Return: token

For all endpoints below you must use this token in the header (`X-Access-Token`):

- **New meal:** `POST [URL/meal]`
    - Body: datetime (Y-m-d H:i:s), title, desc, price, max_people, image
- **Get all meals:** `GET [URL/meals]`
    - Return: id, title, amount (joined people), max_amount, price, image
- **Get meal:** `GET [URL/meal/:id]`
    - Return: id, title, desc, joined_people[name, guest], max_amount, price, image
- **Join meal:** `POST [URL/meal/join]` 
    - Body: meal_id, guest_amount
- **Leave meal:** `POST [URL/meal/leave]`
    - Body: meal_id
- **Get image:** `GET [api/v1/meal/img/:imgName]`
    - Return: image

## Installation

- Run `npm install`
- Copy `config/db.example.json` to `config/db.json` and change values
- Run `npm start`

## Packages

- **Nodemon:** Auto reload server after file changes
- **Express:** HTTP Web Framework
- **Morgan:** HTTP Request Logger
- **Mysql:** Database connection
- **Mocha:** Test framework
- **Chai:** Test framework extension
- **Chai-HTTP:** Test framework extension
- **JWT-Simple:** JSON Web Token encoder/decoder
- **Multer:** Multipart/form-data parser (uploading files)
- **Moment:** Parsing, validating, manipulating and formatting dates
- **Body-Parser:** Parsing off the HTTP body
- **Bcrypt:** Password encryption
