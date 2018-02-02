import request = require('request')
import _ = require('lodash')

export function createGame(snakes: String[], cb: Function) {
    let formData = {
        "game_form[width]": 20,
        "game_form[height]": 20,
        "game_form[delay]": 10,
        "game_form[recv_timeout]": 200,
        "game_form[max_food]": 10,
        "game_form[snake_start_length]": 3,
        "game_form[dec_health_points]": 1,
        "game_form[game_mode]": "multiplayer"
    }
    let count = 0
    snakes.forEach(element => {
        let key = `game_form[snakes][${count}][url]`
        formData[key] = element
        count++
    });
    request.post({ url: process.env.BATTLESNAKE_SERVER_HOST, formData: formData }, (err, res, body) => {
        let game_id = _.get(res.headers['location'].split('/'), 1)
        if (cb)
            cb(game_id)
    })
}