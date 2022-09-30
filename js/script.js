console.log('testing JS')

///////////////////////////// API ///////////////////////////

const Api = (() => {
    const baseURL = 'https://randomuser.me/api'

    async function getUser() {
        const res = await fetch(baseURL)
        const data = await res.json()
        console.log(data.results)
        return await data.results
    }

    return {getUser}
})()

console.log(fetch(baseURL))
console.log(Api.getUser())


///////////////////////////// VIEW ///////////////////////////

const View =(() => {
    return {}
})()

///////////////////////////// MODEL ///////////////////////////

const Model = ((api) => {
    const {getUser} = api

    return {getUser}

})(Api)