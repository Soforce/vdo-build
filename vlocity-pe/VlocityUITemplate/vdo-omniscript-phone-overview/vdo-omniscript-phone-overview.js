$( document ).ready(function() {

  $('#lefttextbutton').mouseover(function (event) {
      $('.overviewleft .overviewdescription').addClass('showdescription');
  });

  $('#righttextbutton').mouseover(function (event) {
      $('.overviewright .overviewdescription').addClass('showdescription');
  });

  $('#lefttextbutton').mouseout(function (event) {
      $('.overviewleft .overviewdescription').removeClass('showdescription');
  });

  $('#righttextbutton').mouseout(function (event) {
      $('.overviewright .overviewdescription').removeClass('showdescription');
  });

  $('#leftvideobutton').mouseover(function (event) {
      $('.overviewvideo').show();
      $('.overviewvideo').html('<iframe width="700" height="394" src="https://www.youtube.com/embed/cJZoTqtwGzY?v=cJZoTqtwGzY?controls=0&amp;showinfo=0&amp;autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
      $('.overviewimage').addClass('selectedvideo');
  });

  $('#leftvideobutton').mouseout(function (event) {
      $('.overviewvideo').hide();
      $('.overviewvideo').html('');
      $('.overviewimage').removeClass('selectedvideo');
  });

  $('#rightvideobutton').mouseover(function (event) {
      $('.overviewvideo').show();
      $('.overviewvideo').html('<iframe width="700" height="394" src="https://www.youtube.com/embed/L5FIAniosZU?controls=0&amp;showinfo=0&amp;autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
      $('.overviewimage').addClass('selectedvideo');
  });

  $('#rightvideobutton').mouseout(function (event) {
      $('.overviewvideo').hide();
      $('.overviewvideo').html('');
      $('.overviewimage').removeClass('selectedvideo');
  });

  $('#leftimagebutton').mouseover(function (event) {
      $('.overviewleft .splash').css('opacity', '0');
      $('.overviewleft .alt').css('opacity', '1');
  });

  $('#leftimagebutton').mouseout(function (event) {
      $('.overviewleft .splash').css('opacity', '1');
      $('.overviewleft .alt').css('opacity', '0');
  });
  
  $('#rightimagebutton').mouseover(function (event) {
      $('.overviewright .splash').css('opacity', '0');
      $('.overviewright .alt').css('opacity', '1');
  });

  $('#rightimagebutton').mouseout(function (event) {
      $('.overviewright .splash').css('opacity', '1');
      $('.overviewright .alt').css('opacity', '0');
  });

});