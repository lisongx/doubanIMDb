BASE_URL = "http://imdbapi.notimportant.org"
IMG_URL = chrome.extension.getURL("images/")

getImageUrl = (type)->
    chrome.extension.getURL("images/#{type}.png")

class Application
  constructor: ->
    @imdb_id = $("#info span.pl:contains(IMDb)").next().text()

    @IMDB_URL = "#{BASE_URL}/imdb/#{@imdb_id}"

    @ROTTEN_URL = "#{BASE_URL}/rotten/#{@imdb_id}"
        
    @injectView() if @imdb_id  #inject view if there is a imdb_id

  injectView: ->
    chrome.extension.sendMessage "get-settings", (response) =>
      @injectImdb() if response.enableIMDb
      @injectRotten() if response.enableRotten

  injectImdb: ->
    $.getJSON @IMDB_URL, (data) ->
      $doubanRating = $("strong.rating_num")
      rating = data.rating ?= "" # get the raing, set to empty string if null
      return if rating is ""  # return if the rating is n/a
      
      rank = data.rank ?= ""
      
      IMDB_TEMPLATE = "<div id='imdb_score'><span>IMDb:#{rating}</span>" +
                      "<b>#{rank}</div>"
      $doubanRating.after(IMDB_TEMPLATE) # inject the html

      $imdbDiv = $('#imdb_score')

      $imdbDiv.css
        "font-size": "14px"
        "color": "green"
        "line-height": "18px"
        "clear": "left"

      $imdbDiv.find('b').css
        "margin-left": "4px"
        "color": "red"

  injectRotten: ->
    $.getJSON @ROTTEN_URL, (data)-> 
      score = data.score

      if score is -1
        color = "grey"
        type = "none"
        text = "N/A"
      else 
        text = "#{score}%"
        if score >= 60
          color = "red"
          type = "fresh"
        else 
          color = "green"
          type = "rotten"

      ROTTEN_TEMPLATE = "<span dir='ltr' id='rottentomato'>" +
                        "<img width='25px' src='#{getImageUrl type}' /><b>#{text}</b>" +
                        "</span>"
      $('span.year').after(ROTTEN_TEMPLATE)
      $rottenDiv = $('#rottentomato') 
      $rottenDiv.css
        "color": color
        "margin-left": "10px"
      $rottenDiv.find('b').css "margin-left": "2px"

app = new Application()


