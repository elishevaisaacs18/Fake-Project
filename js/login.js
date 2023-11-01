localStorage.setItem("Users", JSON.stringify([{ name: "eli", password: "eli", id: 0, connected: true }]));
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

    deleteItem(objType, id, ) {
        const ARR = this.getArrayOf(objType);
        ARR[id] = {};
        localStorage.setItem(objType, JSON.stringify(ARR));
        return "success";
    }

    addUser(username, password) {
        let user = new User(username, password);
        this.users.push(user);
        localStorage.setItem("Users", JSON.stringify(this.users));
        return "success";
    }

    addShoppingItem(name) {
        let item = new ShoppingItem(name);
        const user = getCurrUser();
        const shoppingArr = Array.from(user.shoppingList);
        shoppingArr.push(item);
        user.shoppingList = shoppingArr;
        this.users[getCurrUser().id] = user;
        localStorage.setItem("Users", JSON.stringify(this.users));
        console.log('getCurrUser().shoppingList): ', getCurrUser().shoppingList)
        return "success";
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
        this.shoppingList = new ShoppingList();
        this.id = db.getArrayOf("Users").length - 1;
        this.connected = true;/////////////////////////////////////////////////////////////
    }
}

class ShoppingList {
    constructor() {
        this.items = [];
        this.userId = getCurrUser().id;
    }
}

class ShoppingItem {
    constructor(name) {
        this.name = name;
        this.deleted = false;
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
                sendServerDataToClient(db.getArrayOf(requestArr[1]));
                //place 1 in the requestStr is the array name
                break;
            case /^GET\s[A-Za-z]+\/\d+$/.test(requestStr):
                sendServerDataToClient(db.getObjById(requestArr[1], requestArr[2]));
                //place 1 in the requestStr is the array name, place 2 is the specific item id
                break;
            case /^DELETE\s[A-Za-z]+\/\d+$/.test(requestStr):
                sendServerDataToClient(db.deleteObj(requestArr[1], requestArr[2]));
                //place 1 in the requestStr is the array name, place 2 is the specific item id
                break;

            case /^DELETE\s[A-Za-z]+\/\d+\/[A-Za-z]+$/.test(requestStr):
                sendServerDataToClient(db.deleteObj(requestArr[1], requestArr[2]));
                //place 1 in the requestStr is the array name, place 2 is the specific item id
                break;

            case /^GET (\w+\/){2}\w+$/.test(requestStr):
                sendServerDataToClient(db.getFilterdArrayByAttribure(requestArr[1], requestArr[2], requestArr[3]))
                //place 1 in the requestStr is the array name, place 2 is the attribute, place 3 is the attribute value
                break;
            case /^POST(\s[A-Za-z]+){3}$/.test(requestStr):
                sendServerDataToClient(db.addUser(requestArr[2], requestArr[3]))
                //place 2 is the username, place 3 is the password
                break;
            case /^POST(\s[A-Za-z]+){2}$/.test(requestStr):
                sendServerDataToClient(db.addShoppingItem(requestArr[2]))
                //place 2 in the requestStr is the name 
                break;
            default:
                console.log("Request not recognized.");
        }
    }
    //validation unams pass
    //return value to client
}


let server = new Server();
server.sendRequestToDb("POST Users username elisheva");
server.sendRequestToDb("POST ShoppingItems oil");
server.sendRequestToDb("POST Users eliaaa aaaaaa");
server.sendRequestToDb("POST ShoppingItems aaa");
server.sendRequestToDb("GET Users");
server.sendRequestToDb("GET Users/0");
server.sendRequestToDb("DELETE Users/1");
server.sendRequestToDb("DELETE Users/1/oil");
server.sendRequestToDb("GET Users/username/username");

class FakeAjax {
    constructor() {
        this.responseText = '';

    }
    open(type, route, body) {
        console.log("open")
        this.responseText = `${type} ${route}${body ? " " + body : ""}`;
        //type + " " + route + body? +" " + body : "";
        console.log('this.responseText: ', this.responseText);
    }
    send() {
        server.sendRequestToDb(this.responseText);
        console.log('this.responseText: ', this.responseText)
        console.log('sent');
    }
}



function addItemPrompt() {
    let item = prompt("Which item would you like to add ?");
    if (item !== "") {
        let listItem = document.createElement("li");
        listItem.textContent = item;
        document.getElementById("ul-list").appendChild(listItem);
        let icon = document.createElement("img");
        icon.src = "../img/remove-item.png";
        icon.class = "remove - item";
        listItem.appendChild(icon);
        console.log(icon);
        console.log('sendFAJAXToServer: ', sendFAJAXToServer)

        icon.addEventListener("click", () => deleteItem(item));
    }
}

function deleteItem(item) {
    console.log("deleted");
    console.log('route', "DELETE", "Users/" + getCurrUser().id + "/" + item)
    const fajax = new FakeAjax();
    fajax.open("DELETE", "Users/" + getCurrUser().id + "/" + item);
    fajax.send();
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


let currPage;
document.addEventListener('DOMContentLoaded', () => {
    changePage('log-in-template');
    listenToActions();
});


//  document.getElementById('sign-in-btn').addEventListener('click', accessAccount)

// //! i would like to go throgh this function with you
// function accessAccount() {
//     const userNameInput = document.getElementById('uname').value;
//     const passwordInput = document.getElementById('pass').value;
//     if (userNameInput === '' || passwordInput === '') {
//         showMistakeMessage('Please put in the required fields', 3000);
//     }
//     else if (localStorage.getItem(userNameInput) === null) {
//         showMistakeMessage('Your username or password is incorrect or you dont have have an account, creat one down below', 5000);
//     }
//     else {
//         let user = JSON.parse(localStorage.getItem(userNameInput));
//         console.log(user)
//         if (user.userName === userNameInput && user.password === passwordInput) {
//             user.conected = true;
//             localStorage.setItem(user.userName , JSON.stringify(user));
//             window.location.assign("gamePage.html");
//         }
//         else {
//         showMistakeMessage('Your username or password is incorrect or you dont have have an account, creat one down below', 5000);
//         }
//     }
// }

// function deleteMassage() {
//     document.getElementById('mistake-alert').classList.add('hidden');
// }

// const showMistakeMessage = (message, time) => {
//     const messageElement = document.getElementById('mistake-alert');
//     messageElement.textContent = message;
//     messageElement.classList.remove('hidden');
//     setTimeout(deleteMassage, time);
// }

function checkUserName(){
    let userExist=document.getElementById("user-name");
    const fajax = new FakeAjax();
    fajax.open("GET", "Users");
    fajax.send();
    console.log("shuihxusaxtrscydfvbggfcnuhhhhmff",fajax.responseText);

}
checkUserName();
function listenToActions() {
    if (currPage === 'log-in-template') {
        document.getElementById("log-in-btn").addEventListener('click', () => {
            //check if the uname and password are correct
            changePage('shoping-list-template');
        });
    } else if (currPage === 'shoping-list-template') {
        document.getElementById("log-out").addEventListener("click", logOut);
        document.getElementById("add-item").addEventListener("click", addItemPrompt)
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
    console.log('sendFAJAXToServer: ', sendFAJAXToServer)
    setTimeout(server.sendRequestToDb(requestStr), 30000);
}

function sendServerDataToClient(data) {
    console.log('data: ', data);
    client.info = data;
    console.log('client.info: ', client.info)
}

function getCurrUser() {
    const usersArr = db.getArrayOf("Users");
    for (const user of usersArr) {
        if (user.connected === true) {
            return user;
        }
    }
}
getCurrUser();
//  let user = JSON.parse(localStorage.getItem(key));


document.getElementById("user-greeting").textContent = `Hello ${getCurrUser().username}`;

function logOut(){
    let user = getCurrUser();
    user.connected = false;
    localStorage.setItem(user.username, JSON.stringify(user));
    changePage('log-in-template');

}