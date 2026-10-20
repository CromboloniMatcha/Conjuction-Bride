# Conjunction Bridge

A drag-and-drop grammar game: students build a bridge between two sentences with the right conjunction.
A wrong piece makes the bridge wobble, crack and fall into the river.

## Pages
- **About**: description and how to play (shown first), with a conjunction guide.
- **Play**: the game.
- **Edit questions**: password protected (teacher only).

## Structure
```
conjunction-chain/
├── index.html        Page markup (About, Play, Edit views + password dialog)
├── css/styles.css    All styling
├── js/data.js        Default content: conjunctions + questions
├── js/storage.js     Saves teacher edits in the browser (localStorage)
├── js/config.js      Hash of the teacher password
├── js/auth.js        Password check and lock state
├── js/app.js         Game logic
├── js/editor.js      Edit view: add / edit / reorder / delete
├── js/nav.js         Page navigation and password dialog
├── build.py          Optional: bundles everything into dist/conjunction-chain.html
└── dist/             Single-file build
```

## Run
Open `index.html` in a browser. No install or server needed.

## Password
The editor is locked. The password is stored only as a hash in `js/config.js`.
To change it: open the app, press F12, in the Console run `Auth.hash("new password")`, and paste the number into `ADMIN_HASH`.

**Important:** this lock runs in the browser, so it only stops students from opening the editor by accident.
Someone who reads the code (or the browser storage) can get around it. Real protection needs a server with a login.

## Edit the lessons
Use the **Edit questions** tab. Edits save automatically in *this browser only*.
Use "Backup, restore & share" to move them, or "Show as data.js" and paste into `js/data.js` to make them the permanent defaults.

## Single-file build
`python3 build.py`
