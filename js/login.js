const Users = [];
const ShoppingItems = [];

function login(event) {
    event.preventDefault();
}
let username = document.getElementById("user-name");
let password = document.getElementById("password");
class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.id = db.getArrayOf("Users").length;
        this.connected = false;
    }
}

class ShoppingItem {
    constructor(name) {
        this.name = name;
        this.id = db.getArrayOf("ShoppingItems").length;
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
        this.shoppingItems = [];
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
    }

    addUser(username, password) {
        let user = new User(username, password);
        this.users.push(user);
        console.log('usersssssss', this.users)
        localStorage.setItem("Users", JSON.stringify(this.users));
    }

    addShoppingItem(name) {
        let item = new ShoppingItem(name);
        this.shoppingItems.push(item);
        localStorage.setItem("ShoppingItems", JSON.stringify(this.shoppingItems));
    }

    getFilterdArrayByAttribure(arr, attribute, value) {
        this.getArrayOf(arr).filter((element) => element[attribute] === value);
    }
}

class Server {
    constructor() {
        this.state = 0;
    }

    sendRequestToDb(requestStr) {
        const requestArr = requestStr.split(/\s|\/|\b/).filter(Boolean);
        //[requestStr.split(" ").length - 1]
        console.log('requestArr[1]: ', requestArr[1])
        console.log('requestArr[2]: ', requestArr[2])
        switch (true) {
            case /^GET\s[A-Za-z]+$/.test(requestStr):
                console.log("regex for get users");
                console.log(db.getArrayOf(requestArr[1]));
                //place 1 in the requestStr is the array name
                break;
            case /^GET\s[A-Za-z]+\/\d+$/.test(requestStr):
                console.log("regex for get users/1, get shoppingItem/1");
                console.log(db.getObjById(requestArr[1], requestArr[2]));
                //place 1 in the requestStr is the array name, place 2 is the specific item id
                break;
            case /^DELETE\s[A-Za-z]+\/\d+$/.test(requestStr):
                console.log("regex for DELETE users/0, DELETE shoppingItem/1");
                console.log(db.deleteObj(requestArr[1], requestArr[2]));
                //place 1 in the requestStr is the array name, place 2 is the specific item id
                break;
            case /^GET (\w+\/){2}\w+$/.test(requestStr):
                console.log("regex for get users/userName/elisheva");
                console.log(db.getFilterdArrayByAttribure(requestArr[1], requestArr[2], requestArr[3]))
                //place 1 in the requestStr is the array name, place 2 is the attribute, place 3 is the attribute value
                break;
            case /^POST(\s[A-Za-z]+){3}$/.test(requestStr):
                console.log("regex for POST users username elisheva ");
                console.log(db.addUser(requestArr[2], requestArr[3]))
                //place 2 is the username, place 3 is the password
                break;
            case /^POST(\s[A-Za-z]+){2}$/.test(requestStr):
                console.log("regex for POST ShoppingItem oil");
                console.log(db.addShoppingItem(requestArr[2]))
                //place 2 in the requestStr is the name 
                break;
            default:
                console.log("Request not recognized.");
        }

        // Example usage:


        // regex for get users       /^GET\s\/[A-Za-z]/$/
        // regex for get users/1, get shoppingItem/1      /^GET\s\/[A-Za-z]/\/\d+$/
        // regex for DELETE users/0, DELETE shoppingItem/1      /^DELETE\s\/[A-Za-z]/\/\d+$/
        // regex for get users/userName/elisheva         /^GET (\w+\/){2}\w+$/
        // regex for POST users username elisheva       /^POST(\s[A-Za-z]+){3}$/
    }

    //validation unams pass
    //url to a db function
    //return value to client
}

let server = new Server();
server.sendRequestToDb("GET Users");
server.sendRequestToDb("GET Users/1");
server.sendRequestToDb("DELETE Users/1");
server.sendRequestToDb("GET Users/name/elisheva");
server.sendRequestToDb("POST Users username elisheva");
server.sendRequestToDb("POST ShoppingItems oil");
server.sendRequestToDb("POST Users eliaaa aaaaaa");
server.sendRequestToDb("POST ShoppingItems aaa");




function sendFAJAXToServer(requestStr) {
    setTimeout(Server.sendRequestToDb(requestStr), 30000);
}

function sendServerDataToClient(dava) {
    //setTimeout(Server.translateRequest(requestStr), 30000);
}