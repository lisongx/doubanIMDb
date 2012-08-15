BASE_URL = "http://imdbapi.notimportant.org"
IMG_URL = "http://getimdb.sinaapp.com/"

class Application
  constructor: ->
    @imdb_id = $("#info span.pl:contains(IMDb)").next().text()

    @IMDB_URL = "#{BASE_URL}/imdb/#{@imdb_id}"

    @ROTTEN_URL = "#{BASE_URL}/rotten/#{@imdb_id}"

    @injectView() if @imdb_id  #inject view if there is a imdb_id

  injectView: ->
    @injectImdb()
    @injectRotten()

  injectImdb: ->
    $.getJSON @IMDB_URL, (data) ->
      $doubanRating = $("strong.rating_num")
      rating = data.rating ?= "" # get the raing, set to empty string if null
      return if rating is ""  # return if the rating is n/a
      
      rank = data.rank ?= ""
      
      IMDB_TEMPLATE = "<div id='imdb_score'><span>IMDb:#{rating}</span>" +
                      "<b>#{rank}</div>"
      $doubanRating.after(IMDB_TEMPLATE) # inject the html

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
                        "<img src='#{IMG_URL}#{type}.png' /><b>#{text}</b>" +
                        "</span>"
      $('span.year').after(ROTTEN_TEMPLATE)
      $('#rottentomato').css "color", color

app = new Application()


