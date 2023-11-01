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