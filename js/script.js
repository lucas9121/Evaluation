

///////////////////////////////////////// PAGE LOADS AFTER A FEW SECONDS DELAY ////////////////////////////////////

///////////////////////////// API ///////////////////////////

const Api = (() => {
    const baseURL = 'https://randomuser.me/api'

    async function getUser() {
        const res = await fetch(baseURL)
        const data = await res.json()
        // console.log(data.results)
        return await data.results
    }

    return {getUser}
})()



///////////////////////////// VIEW ///////////////////////////

const View =(() => {
    const domStr = {
        usersContainer: "#usersContainer"
    }
    const render = (ele, tmplt) => {
        ele.innerHTML = tmplt
    }

    const createTmplt = (arr) => {
        // console.log('create function')
        // console.log(arr)
        let tmplt = ''
        arr.forEach((users) => {
            // console.log(arr)
            for(let ele of users){
                tmplt += `
                <li>
                    <img src= " ${ele.picture.large}" alt="">
                    <div class="userInfo">
                        <span>name: ${ele.name.title}. ${ele.name.last}</span>
                        <span>email: ${ele.email}</span>
                        <span>phone: ${ele.cell}</span>
                        <button>Show Dob</button>
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
    // const init = () => {
    //     console.log('init')
    //     // let user = []
    //     // for(let i = 0; i < 20; i++){
    //         model.getUser().then((person) => {
    //             console.log(person[0])
    //             // user = [...user, person[0]]
    //             state.userList = [...userList, person[0]]
    //             // console.log(user)
    //             // console.log(state.userList)
    
    //         })
    //     // }
    //     // const getUser = model.getUser()
    //     // console.log('user array: ' + user.length)

    // }
    let user = {}
    async function init() {
        let users = []
        for(let i = 0; i < 20; i++){
            user = await model.getUser()
            users.push(user)
        }
        state.userList = users
        // console.log(users)
    }


    const run = () => {
        init()
    }

    return {run}
})(Model)

Controller.run()



///// button works but there is a delay

const refresh = document.querySelector('#refresh')
refresh.addEventListener('click', () =>{
    console.log('clicked')
    Controller.run()
})