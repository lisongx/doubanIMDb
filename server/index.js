const express = require('express')
const PORT = process.env.PORT || 5000
const { JSDOM } = require('jsdom')
const wdk = require('wikidata-sdk')
const request = require('request-promise')

const trimDomString = (val) => {
    return val.replace(/(\r\n|\n|\r)/gm, "").trim()
}

const setResponseHeaders = (res) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=216000'
    });
}

const getRottenIdByimdbId = (imdbId) => {
    const sparql = `
        SELECT ?rottenId
        WHERE
        {
            ?item wdt:P345 "${imdbId}".
            ?item wdt:P1258 ?rottenId
        }
    `
    const uri = wdk.sparqlQuery(sparql)
    const options = {
        uri: uri,
        headers: {
            "Accept": "application/sparql-results+json",
            "User-Agent": "doubanIMDb/0.01",
        },
        json: true
    };

    return request(options).then(
        wdk.simplify.sparqlResults
    ).then((results) => {
        if (results.length > 0) {
            return results[0].rottenId
        }
    })
}


const imdbView = (req, res) => {
    const imdbId = req.params.imdbId
    if (!imdbId) {
        res.status(400)
        return res.json({ "error": "you need give me an imdb id" })
    }

    const pageUrl = `http://www.imdb.com/title/${imdbId}`
    return request(pageUrl).then(body => {
        const dom = new JSDOM(body)
        const document = dom.window.document
        const ratingElement = document.querySelector("span[itemprop=ratingValue]")
        const rating = ratingElement ? ratingElement.textContent : ""
        const rankElement = document.querySelector("#titleAwardsRanks strong")
        const rank = rankElement ? trimDomString(rankElement.textContent) : ""
        setResponseHeaders(res)
        return res.json({ rating, rank })
    }).catch((e) => {
        console.log('error', e);
        res.status(500)
        return res.json({ "error": "my bad" })
    })
}

const rottenView = (req, res) => {
    const imdbId = req.params.imdbId
    if (!imdbId) {
        res.status(400)
        return res.json({ "error": "you need give me an imdb id" })
    }

    return getRottenIdByimdbId(imdbId).then(rottenId => {
        const uri = `https://www.rottentomatoes.com/${rottenId}`;
        const options = {
            uri,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36",
            }
        }
        return request(options)
    }).then(body => {
        const dom = new JSDOM(body)
        const document = dom.window.document
        const meterElement = document.querySelector('#tomato_meter_link')
        const score = meterElement ? parseInt(trimDomString(meterElement.textContent)) : ""
        res.set({
            'content-type': 'application/json',
        });
        setResponseHeaders(res)
        return res.json({ score })
    }).catch((e) => {
        console.log('error', e);
        res.status(500)
        return res.json({ "error": "my bad" })
    })
}

express()
    .get('/imdb/:imdbId', imdbView)
    .get('/rotten/:imdbId', rottenView)
    .listen(PORT, () => console.log(`Listening on ${PORT}`))
