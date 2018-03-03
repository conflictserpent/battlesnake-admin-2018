import express = require('express')
import { Router } from 'express'
import { ensureAuthenticated } from '../passport-auth'
import * as _ from 'lodash'

export const router = Router()

router.get('/', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
    const snakes = _.range(0, 11).map(i => {
        return {
            name: `Training Snake ${i}`,
            url: `https://battlesnake-training-snakes.herokuapp.com/snake_${i}`
        }
    })

    snakes.push({
        name: "DSnek",
        url: "https://dsnek.herokuapp.com"
    })

    snakes.push({
        name: "Accio Bounty Snake",
        url: "http://52.40.184.186:9001"
    })

    snakes.push({
        name: "AppColony Bounty Snake",
        url: "http://appcolony-battlesnake.herokuapp.com/"
    })

    snakes.push({
        name: "Redbrick Bounty Snake",
        url: "http://bountysnake2018.rdbrck.com/"
    })

    snakes.push({
        name: "Checkfront Bounty Snake #1",
        url: "http://battlesnake.checkfront.net:81/"
    })

    snakes.push({
        name: "Checkfront Bounty Snake #2",
        url: "http://battlesnake.checkfront.net:82/"
    })

    snakes.push({
        name: "Giftbit Bounty Snake #1",
        url: "http://bountysnake.lightraildev.net/ronda"
    })

    snakes.push({
        name: "Giftbit Bounty Snake #2",
        url: "http://bountysnake.lightraildev.net/rabble"
    })

    snakes.push({
        name: "Semaphore Bounty Snake",
        url: "https://salty-reef-19426.herokuapp.com/CCCCCC/10-100-0-0-0-0-0-0-0/agg-coo/"
    })

    snakes.push({
        name: "Workday Bounty Snake #1",
        url: "https://wd-battlesnake-bounty-2018-1.herokuapp.com/"
    })

    snakes.push({
        name: "Workday Bounty Snake #2",
        url: "https://wd-battlesnake-bounty-2018-2.herokuapp.com/"
    })

    snakes.push({
        name: "Rooof Bounty Snake #1",
        url: " http://adam.snake.rooof.com:7878"
    })

    snakes.push({
        name: "Rooof Bounty Snake #2",
        url: "http://catlin.snake.rooof.com"
    })

    snakes.push({
        name: "Bambora Bountyt Snake #1",
        url: "http://battlesnake.na.bambora.com/sean"
    })

    snakes.push({
        name: "Bambora Bountyt Snake #2",
        url: "http://battlesnake.na.bambora.com/derrick"
    })

    snakes.push({
        name: "Bambora Bountyt Snake #3",
        url: "http://battlesnake.na.bambora.com/george"
    })

    snakes.push({
        name: "Sendwithus Bounty Snake #1",
        url: "http://35.185.235.22"
    })

    snakes.push({
        name: "Sendwithus Bounty Snake #2",
        url: "https://cubanboa.herokuapp.com/partyjem/"
    })

    res.send(snakes)
})