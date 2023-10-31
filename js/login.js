const Users = [];
function login(event) {
    event.preventDefault();
}
let username = document.getElementById("user-name");
let password = document.getElementById("password");
class User {
    constractor(username, password) {
        this.username = username;
        this.password = password;
        this.id = User.length;
        this.connected = false;

    }
}

let json = JSON.stringify(user);
localStorage.setItem(json);

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
