const Users = [];
const ShoppingItems = [];

function login(event) {
    event.preventDefault();
}
let username = document.getElementById("user-name");
let password = document.getElementById("password");
class User {
    constractor(username, password) {
        this.username = username;
        this.password = password;
        this.id = DB.getArrayOf("Users").length;
        this.connected = false;
    }
}

class ShoppingItem {
    constractor(name) {
        this.name = name;
        this.id = DB.getArrayOf("Shopping Items").length;
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
    constractor() {
        this.users = [];
        this.shoppingItems = [];
    }

    getArrayOf(objName) {
        return JSON.parse(localStorage.getItem(objName));
    }

    getObjById(id, objType) {
        JSON.parse(this.getArrayOf(objType))[id];
    }

    deleteObj(objType, id) {
        const ARR = getArrayOf(objType);
        ARR[id] = {};
        localStorage.setItem(objType, JSON.stringify(ARR));
    }

    addUser(username, password) {
        let user = new User(username, password);
        this.users.push(user);
        localStorage.setItem("Users", JSON.stringify(this.users));
    }

    addShoppingItem(name) {
        let item = new ShoppingItem(name);
        this.shoppingItems.push(item);
        localStorage.setItem("Shopping Items", JSON.stringify(this.shoppingItems));
    }

    getFilterdArrayByAttribure(arr, attribute, value) {
        arr.filter((element) => element[attribute] === value);
    }
}

class Server {
    constructor() {
        this.state = 0;
    }

    sendRequestToDb(request) {
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