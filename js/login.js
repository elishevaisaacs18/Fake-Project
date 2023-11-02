// localStorage.setItem("Users", JSON.stringify([{ name: "eli", password: "eli", id: 0, connected: true }]));
// function logOut (){
//     let logOutn=document.getElementById("log-out");
//     if(logOutn){
//         localStorage.removeItem(getCurrUser);
//     }
// }
function login(event) {
    event.preventDefault();
}
let username = document.getElementById("user-name");
let password = document.getElementById("password");

class DB {
    constructor() {
        this.users = [];
    }

    getArrayOf(objName) {
        return JSON.parse(localStorage.getItem(objName));
    }

    getObjById(objType, id) {
        return this.getArrayOf(objType)[id];
    }

    deleteObj(objType, id) {
        const ARR = this.getArrayOf(objType);
        ARR[id] = {};
        localStorage.setItem(objType, JSON.stringify(ARR));
        return "success";
    }

    deleteItemFromDB(objType, id, name) {
        const usersArr = this.getArrayOf(objType);
        const removeItemIndex = usersArr[Number(id)].shoppingList.items.indexOf(name);
        usersArr[id].shoppingList.items.splice(removeItemIndex, 1);
        localStorage.setItem(objType, JSON.stringify(usersArr));
        return "success";
    }

    addUser(username, password) {
        let user = new User(username, password);
        this.users.push(user);
        localStorage.setItem("Users", JSON.stringify(this.users));
        return "success";
    }

    addShoppingItem(objType, id, item) {
        const usersArr = this.getArrayOf(objType);
        usersArr[Number(id)].shoppingList.items.push(item);
        localStorage.setItem(objType, JSON.stringify(usersArr));
        return "success";


        // let item = new ShoppingItem(name);
        // const user = getCurrUser();
        // const shoppingArr = Array.from(user.shoppingList);
        // shoppingArr.push(item);
        // user.shoppingList = shoppingArr;
        // this.users[getCurrUser().id] = user;
        // localStorage.setItem("Users", JSON.stringify(this.users));
        // return "success";
    }

    getFilterdArrayByAttribure(arr, attribute, value) {
        return this.getArrayOf(arr).filter((element) => element[attribute] === value);
    }
}

const db = new DB();

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.id = db.getArrayOf("Users")?.length ?? 0;
        this.shoppingList = new ShoppingList();
        this.connected = false;
    }
}

class ShoppingList {
    constructor() {
        this.items = [];
    }
}

class ShoppingItem {
    constructor(name) {
        this.name = name;
    }
}

class Client {
    constructor() {
        this.info;
    }
}

const client = new Client();

class Server {
    constructor() {
        this.state = 0;
    }

    sendRequestToDb(requestStr) {
        const requestArr = requestStr.split(/\s|\/|\b/).filter(Boolean);
        switch (true) {
            case /^GET\s[A-Za-z]+$/.test(requestStr):
                console.log("Server is looking for Data in DB")
                sendServerDataToClient(db.getArrayOf(requestArr[1]));

                //place 1 in the request is the array name
                break;
            case /^GET\s[A-Za-z]+\/\d+$/.test(requestStr):
                console.log("Server is looking for Data in DB")
                sendServerDataToClient(db.getObjById(requestArr[1], requestArr[2]));

                //place 1 in the request is the array name, place 2 is the specific item id
                break;
            case /^DELETE\s[A-Za-z]+\/\d+$/.test(requestStr):
                console.log("Server is looking for Data in DB")
                sendServerDataToClient(db.deleteObj(requestArr[1], requestArr[2]));

                //place 1 in the request is the array name, place 2 is the specific item id
                break;
            //delete item
            case /^DELETE\s[A-Za-z]+\/\d+\/[A-Za-z]+$/.test(requestStr):
                console.log("Server is looking for Data in DB")
                sendServerDataToClient(db.deleteItemFromDB(requestArr[1], requestArr[2], requestArr[3]));
                //place 1 in the request is the array name, place 2 is the specific item id place 3 is the name of the item to remove
                break;

            case /^GET (\w+\/){2}\w+$/.test(requestStr):
                console.log("Server is looking for Data in DB")
                sendServerDataToClient(db.getFilterdArrayByAttribure(requestArr[1], requestArr[2], requestArr[3]))
                //place 1 in the request is the array name, place 2 is the attribute, place 3 is the attribute value
                break;
            case /^POST(\s[A-Za-z]+){3}$/.test(requestStr):
                console.log("Server is looking for Data in DB")
                sendServerDataToClient(db.addUser(requestArr[2], requestArr[3]))
                //place 2 is the username, place 3 is the password
                break;
            case /^POST\s[A-Za-z]+\/\d+\/[A-Za-z]+$/.test(requestStr):
                console.log("Server is looking for Data in DB")
                // sendServerDataToClient(db.addShoppingItem(requestArr[2]))
                sendServerDataToClient(db.addShoppingItem(requestArr[1], requestArr[2], requestArr[3]));
                //place 1 in the request is the array name, place 2 is the specific item id place 3 is the name of the item to remove
                break;
            default:
                console.log("Request not recognized.");
        }
    }
}


let server = new Server();
server.sendRequestToDb("POST Users elisheva isaacs");
server.sendRequestToDb("POST Users abigail shafran");
server.sendRequestToDb("POST Users shir shlomo");
server.sendRequestToDb("POST Users/0/oil");
server.sendRequestToDb("POST Users/0/milk");
server.sendRequestToDb("GET Users");
server.sendRequestToDb("GET Users/0");
// server.sendRequestToDb("DELETE Users/1");
// server.sendRequestToDb("DELETE Users/0/oil");
server.sendRequestToDb("GET Users/username/username");
console.clear();
class FakeAjax {
    constructor() {
        this.responseText = '';

    }
    open(type, route, body) {
        console.log(" Client opened Fajax ")
        this.responseText = `${type} ${route}${body ? " " + body : ""}`;
    }
    send() {
        console.log('Fajax is sending to Network');
        sendFAJAXToServer(this.responseText);

    }
}

function addItemPrompt() {
    let item = prompt("Which item would you like to add ?");
    if (item !== "") {
        const fajax = new FakeAjax();
        fajax.open("POST", "Users/" + getCurrUser().id + "/" + item);//////
        fajax.send();
        addItemToList(item);
    }
}
function addItemToList(item) {
    let listItem = document.createElement("li");
    listItem.id = item;
    listItem.textContent = item;
    document.getElementById("ul-list").appendChild(listItem);
    let icon = document.createElement("img");
    icon.src = "../img/remove-item.png";
    icon.class = "remove - item";
    listItem.appendChild(icon);
    icon.addEventListener("click", () => deleteItem(item));
}
function deleteItem(item) {
    const fajax = new FakeAjax();
    fajax.open("DELETE", "Users/" + getCurrUser().id + "/" + item);
    fajax.send();
    const parentElement = document.getElementById("ul-list");
    parentElement.removeChild(document.getElementById(item))
}

let currPage;
document.addEventListener('DOMContentLoaded', () => {
    changePage('log-in-template');
});

function checkIfUserIsValid(userNameInput, passwordInput) {
    const fajax = new FakeAjax();
    fajax.open("GET", "Users");
    fajax.send();
    const users = client.info;
    for (const user of users) {
        if (user.username === userNameInput && user.password === passwordInput) {
            user.connected = true;
            localStorage.setItem('Users', JSON.stringify(users));
            return true;
        }

    }
    return false;
}

function deleteMassage() {
    document.getElementById('mistake-alert').classList.add('hidden');
}

const showMistakeMessage = (message, time) => {
    const messageElement = document.getElementById('mistake-alert');
    messageElement.textContent = message;
    messageElement.classList.remove('hidden');
    setTimeout(deleteMassage, time);
}

function listenToActions() {
    if (currPage === 'log-in-template') {
        document.getElementById("log-in-btn").addEventListener('click', (e) => {
            e.preventDefault();
            tryConnection();
            const user = getCurrUser();
            if (user.shoppingList.items.length > 0) {
                for (const item of user.shoppingList.items) {
                    addItemToList(item);
                }
            }
            document.getElementById("user-greeting").textContent = `Hello ${getCurrUser().username}`;
        });
    } else if (currPage === 'shoping-list-template') {
        document.getElementById("log-out").addEventListener("click", logOut);
        document.getElementById("add-item").addEventListener("click", addItemPrompt)
    }
}

function tryConnection() {
    const userNameInput = document.getElementById('user-name').value;//going hete twich
    const passwordInput = document.getElementById('password').value;
    if (userNameInput === '' || passwordInput === '') {
        showMistakeMessage('Please put in the required fields', 3000);
    } else if (checkIfUserIsValid(userNameInput, passwordInput)) {
        changePage('shoping-list-template');
        document.getElementById("user-greeting").classList.remove("hidden");
        document.getElementById("log-out").classList.remove("hidden");
    } else {
        showMistakeMessage('Your username or password is incorrect', 5000);
    }
}

function changePage(newPageTemplateId) {
    document.getElementById('div-hold').innerHTML = '';
    let content = document.getElementById(newPageTemplateId).content;
    let contentCopy = content.cloneNode(true);
    document.getElementById('div-hold').appendChild(contentCopy);
    currPage = newPageTemplateId;
    listenToActions();
}

//Network
function sendFAJAXToServer(requestStr) {
    console.log('Network is sending Data To Server: ', requestStr)
    // setTimeout(server.sendRequestToDb(requestStr), 3000);
    server.sendRequestToDb(requestStr)
}

function sendServerDataToClient(data) {
    client.info = data;
    console.log('Network is sending Data To Client: ', data)
}

function getCurrUser() {
    const usersArr = db.getArrayOf("Users");
    for (const user of usersArr) {
        if (user.connected === true) {
            return user;
        }
    }

    return JSON.parse(localStorage.getItem('Users'))[0];
}

function logOut() {
    document.getElementById("log-out").classList.add("hidden");
    document.getElementById("user-greeting").classList.add("hidden");
    const fajax = new FakeAjax();
    fajax.open("GET", "Users");
    fajax.send();
    const users = client.info;
    let currUser = getCurrUser();
    for (const user of users) {
        if (user.id === currUser.id) {
            user.connected = false;
        }
    }
    localStorage.setItem('Users', JSON.stringify(users));
    changePage('log-in-template');
}

// function validPassword(password){
//  let passwordCheck=/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
//     if(password.test(passwordCheck)){

//     }
//     else if(password.length<8){
//         alert('password hasto be at least 8 characters')
//     }
//     else if(){

//     }
// }
// let json = JSON.stringify(user);
// localStorage.setItem(json);
