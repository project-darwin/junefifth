// run all our queries here
// and display them in a nice format


// we can either create a whole separate app for google chrome extension
// or somehow find a way to link things together


var yoyoyoy = "hello"

chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);
    console.log($('span'));
alert($('span'));
        $('span').on('click', function(){
  alert('yo');
  console.log('wastups')
});

$('.srchAddToCart').on('click', function(){
  console.log('inside the initialize function')
  console.log(this.id);
});
  }
  }, 10);
});
