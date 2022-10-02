

///////////////////////////////////////// PAGE LOADS AFTER A FEW SECONDS DELAY ////////////////////////////////////


const generateRandomId = () => {
    const reuse = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz"
    const length = 12;
    let id = ''
    for (let i = 0; i < length; i++){
        const index = Math.floor(Math.random() * reuse.length)
        id +=reuse[index]
    }
    return id
}

///////////////////////////// API ///////////////////////////

const Api = (() => {
    const baseURL = 'https://randomuser.me/api'

    async function getUser() {
        const res = await fetch(baseURL)
        const data = await res.json()
        return await data.results
    }

    return {getUser}
})()



///////////////////////////// VIEW ///////////////////////////

const View =(() => {
    const domStr = {
        usersContainer: "#usersContainer",
        dobDiv: '.dobDiv'
    }
    const render = (ele, tmplt) => {
        ele.innerHTML = tmplt
    }

    const createTmplt = (arr) => {
        let tmplt = ''
        arr.forEach((users) => {
            // console.log(arr)
            for(let ele of users){
                ele.id = generateRandomId()
                tmplt += `
                <li>
                    <img src= " ${ele.picture.large}" alt="">
                    <div class="userInfo">
                        <span>name: ${ele.name.title}. ${ele.name.last}</span>
                        <span>email: ${ele.email}</span>
                        <span>phone: ${ele.cell}</span>
                        <span id="${ele.id}" style="display: none">phone: ${ele.dob.date}</span>
                        <div id="${ele.id}" class="dobDiv">
                        <button>Show Dob</button>
                        </div>
                    </div>
                </li>
                `
            }
        })
        return tmplt
    }

    return {render, createTmplt, domStr}
})()

///////////////////////////// MODEL ///////////////////////////

const Model = ((api, view) => {
    const {getUser} = api

    class State {
        #userList = []

        get userList() {
            // console.log('get part')
            return this.#userList
        }

        set userList(newUserList) {
            this.#userList = newUserList
            const usersContainer = document.querySelector(view.domStr.usersContainer)
            let tmplt = []
                tmplt += view.createTmplt(this.#userList)
            View.render(usersContainer, tmplt)
        }
    }


    return {getUser, State}

})(Api, View)


///////////////////////////// CONTROLLER ///////////////////////////

const Controller = ((model, view) => {
    const state = new model.State()
    let user = {}
    async function init() {
        let users = []
        for(let i = 0; i < 20; i++){
            user = await model.getUser()
            users.push(user)
        }
        state.userList = users
    }

    const showFn = () => {
        const dobDiv = document.querySelectorAll(view.domStr.dobDiv)
        for(let div of dobDiv){
            div.addEventListener("click", (evt) => {
                let span = document.querySelector(`span#${div.id}`)
                if(div.innerHTML !== span.innerHTML){
                    div.innerHTML = span.innerHTML
                } else{
                    div.innerHTML = '<button>Show Dob</button>'
                }
            })
        }
    }


    async function run () {
        await init()
        await showFn()
    }

    return {run}
})(Model, View)

Controller.run()




///// button works but there is a delay

const refresh = document.querySelector('#refresh > button')
const timer = document.querySelector('#refresh > span')
refresh.addEventListener('click', () =>{
    timer.innerHTML = 3
    for (let i = 1; i < 3; i++) {
        setTimeout(() => timer.innerHTML = i, (3 - i) * 1000);
    }
    setTimeout(() => {timer.innerHTML = ''}, 3000)
    Controller.run()
})