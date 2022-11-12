const fetch = require('node-fetch')
const API_URL = process.env.API_URL

async function fromAPI(route) {
    try {
        const response = await fetch(`${API_URL}${route}`)
        if (!response.ok) {
            return false
        }
        const responseBody = await response.text()
        const result = JSON.parse(responseBody)
        return result
    } catch(err) {
        console.error(err)
        return false
    }
}

module.exports = { fromAPI }