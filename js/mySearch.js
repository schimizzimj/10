$('.choice').click(
  function(event) {
    console.log(event.target.text)
    $('#dropdownTitle').text(event.target.text)
  }
)


$('#my-search').submit(
    function(event){
          event.preventDefault()
          console.log($('#dropdownMenu1').text().trim())
          console.log($('input[name=datefilter]').val())
          $.ajax({
              method: "POST",
              url: "localhost:3000",
              data:
                {
                  company: $('#dropdownMenu1').text().trim(),
                  daterange: $('input[name=datefilter]').val()
                }
          })
          .done(function( msg ) {
              // alert( "Data Saved: " + msg );
              $('#result').text(msg)





          });

    }
)
