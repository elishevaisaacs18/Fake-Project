const Users=[];
function login(event){
event.preventDefault();
}
let username=document.getElementById("user-name");
let password=document.getElementById("password");
 class User{
    constractor(username,password){
    this.username=username;
    this.password=password;
    this.id=User.length;
    this.connected=false;
    
    }
}
 let json=JSON.stringify(user);
 localStorage.setItem(json);