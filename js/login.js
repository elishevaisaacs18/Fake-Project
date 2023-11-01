localStorage.setItem("Users", JSON.stringify([{ name: "eli", password: "eli", id: 0, connected: true }]));

function login(event) {
    event.preventDefault();
}
let username = document.getElementById("user-name");
let password = document.getElementById("password");
class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.shoppingList = new ShoppingList();
        this.id = db.getArrayOf("Users").length - 1;
        this.connected = true;
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

function addItemPrompt() {
    let item = prompt("Which item would you like to add ?");
    if (item !== "") {
        let listItem = document.createElement("li");
        listItem.textContent = item;
        // listItem.id=listItem;
        let parentElement = document.getElementById("ul-list");
        parentElement.appendChild(listItem);
        let icon = document.createElement("img");
        icon.src = "../img/remove-item.png";
        icon.id = "remove - item";
        parentElement.appendChild(icon);
        icon.addEventListener('click', console.log("faja"));
    }

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
function listenToActions() {
    if (currPage === 'log-in-template') {
        document.getElementById("log-in-btn").addEventListener('click', () => {
            changePage('shoping-list-template');
        });
    } else if (currPage === 'shoping-list-template') {
        // document.getElementById("sign-up-btn").addEventListener('click', () => {
        //     changePage('sign-in-template');
        // });
        let addItemIcon = document.getElementById("add-item").addEventListener("click", addItemPrompt)

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
server.sendRequestToDb("GET Users/username/username");

//Network
function sendFAJAXToServer(requestStr) {
    setTimeout(Server.sendRequestToDb(requestStr), 30000);
}

function sendServerDataToClient(data) {
    console.log('data: ', data)
    //setTimeout(Server.translateRequest(requestStr), 30000);
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


document.getElementById("user-greeting").textContent = `Hello ${getCurrUser().userName}`;

const logOut = () => {
    let user = getCurrUser();
    user.connected = false;
    localStorage.setItem(user.userName, JSON.stringify(user));
}

document.getElementById("log-out").addEventListener("click", logOut);