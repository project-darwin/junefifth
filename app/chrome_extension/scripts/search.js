// run all our queries here
// and display them in a nice format


// we can either create a whole separate app for google chrome extension
// or somehow find a way to link things together



// if the current link has https://www.sears.com/shc/s/OrderCenterView?
// then we make a call to our database to pull the collection of items

// if the current link is on a product page then we just attach listeners

// take away the add to cart button and then make it purchase, disable the popup.

// when pop

// use this url for demo day

/*

if(currentUrl.indexOf(orderURL) !== orderURL){
  // we attach listeners
  $('.srchAddToCart').on('click', function(){

    when a button is clicked on we need to make a request to the server
    the server will take the info and store it into our database
    specifically adding it to the users shopping cart
    var http = new XMLHttpRequest();

    http.open("GET", "http://localhost:3000/user?"+this.id, true);
    http.send();

    http.onreadystatechange = function(){
      console.log("hello")
      if(http.readyState == 4 && http.status == 200){
        alert(typeof JSON.parse(http.responseText));
        alert(http.responseText)
        chrome.runtime.sendMessage({message: http.responseText}, function(response){
          console.log(response);
        });
      }
    }
  });
} else{
  // since we're only going to one other part
  // of the website, we just append elements
  // the way you do that is to ping the server for the shopping cart of the user
  [1, 2, 3].forEach(function(element){
    $('#msOrderCenterListingProducts').append(insert);
  });
}

*/


var orderURL = 'https://www.sears.com/shc/s/OrderCenterView?';
var currentUrl = document.URL;
var postURL = 'https://pricewise.herokuapp.com/addtocart';
// var postURL = 'http://172.16.29.143:9999/addtocart';
var getURL = 'https://pricewise.herokuapp.com/data';
// var getURL = 'http://172.16.29.143:9999/data';
var http = new XMLHttpRequest();
var purchasePrice;
var imageUrl;
var asin;
var params;
var productUrl;
var purchaseDate;
var customerEmail;
var customerData;


var insert = function(p){
  return '<ul class="msOrderCenterRows" '+p.background+'><li class="msOrderNumber"><p><a href="#">'+p.asin+'</a></p></li><li class="msPurchaseDate"><p>June 08, 2014</p></li><li class="msImages"><p><span><img src="'+p.imageUrl+'"/></span><input type="hidden" name="imgdetails" value="https://c.shld.net/rpx/i/s/i/spin/image/spin_prod_927798912"/><input type="hidden" id="hfSywexclusiveOrder" value="false" name="hfSywexclusiveOrder"/></p></li><li class="msTotal"><p>$'+p.currentPrice+'</p></li><li class="msFullfillment"><input type="hidden" id="hfOrderId" value="685817205" /><input type="hidden" id="hfOrderSource" value="OMS" /><input type="hidden" id="hfOrdXRTranDate" value="2014-06-05 16:11:35.015" /><p><strong>Shipped</strong><br/><div id="bonusPointsLine" class="os_label"><aid="bonusPoints_1" class="xtremeRedeem sywrredeem">You have Earned 525Points</a></div><div id="bonusPointsLayer_1" class="bonusPointsLayer" style="display:none"><div class="sywrInfoLeft" style="width:315px"><div class="redeemDetailsWrap"><br><strong>Earned Points Details*</strong><div class="redeemDetailsWrap"><strong><br>Total Base Points : 105</strong></div><div class="redeemDetailsWrap"><strong>TotalBonus Points : 420</strong></div><br><div id="productDetails_1" class="productDetails"><h3 style="font-size: 9pt; float: left; padding-top: 4px; vertical-align: top; font-weight: 600; width: 100%; float: left; background: none repeat scroll 0 0 #EEEEEE; border-top: 5px solid #FFFFFF; padding: 0 -1px 5px 21px;"onclick="expandCollapseBonusPointsSummary(this); return false;"><spanclass="iconTotalSummary"style="float: left; font-size: 14pt; font-weight: bold; padding-right: 5px; width: 10px; padding-top: 7px;">+</span><a href="#">Outdoor Life Mens Socks Coolmax Grey- 525Points</a></h3></div><div class="ocDetailsContent" style="display:none"><div class="os_label">BasePoints Earned</div><div class="os_total">105</div><div class="os_label">BonusPoints Earned</div><div class="os_total">&nbsp;</div><div class="os_label earnPnts">Online offer</div><div class="os_total earnPnts">420</div></div></div></div><div class="os_label" style="padding-top: 13px;">* Points displayed are estimates only. Points earned vary based on purchase(s), offers, cancellations, or subsequent modifications to your order.</div></div><a class="typicalSearsBtn">View Order Details</a></p></li></ul>'
}

chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      if(currentUrl.indexOf(orderURL) === -1){
        console.log('if')
        // we attach listeners
        $('.srchAddToCart').text('Purchase Now')
        $('.srchAddToCart').on('click', function(e){
          $(this).parent().unbind();
          $(this).parent().removeAttr('href');
          e.preventDefault();
          // when a button is clicked on we need to make a request to the server
          // the server will take the info and store it into our database
          // specifically adding it to the users shopping cart
          // soldByAmazon: true, // hard code
          //  soldByPartsDirect: false, // hard code
          // purchaseDate
          customerEmail = 'wainetam@gmail.com';
          purchaseDate = new Date();
          asin = this.id.split('_')[1];
          productUrl = $(this).parents('.cardProdButtonCont').siblings('.cardProdTitle').find('a').attr('href');
          purchasePrice = $(this).parents('.cardProdButtonCont').siblings('.SubCatGalleryListView').find('.price_v2').text();
          purchasePrice = parseInt(purchasePrice.substring(1, purchasePrice.length+1), 10) * 1.2;
          imageUrl = $(this).parents('.cardProdButtonCont').siblings('.cardImgCont').find('img.prod').attr('src');
          params = 'asin='+asin+'&purchasePrice='+purchasePrice+'&imageUrl='+imageUrl+'&productUrl='+'http://www.sears.com'+productUrl+'&soldByAmazon=1&soldByPartsDirect=0&purchaseDate='+purchaseDate+'&customerEmail='+customerEmail;
          http.open('POST', postURL, true);
          http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
          http.send(params);
          $(this).css('background-color', '#9bffa5').text('Thank you!');
          return false;
        });
      } else{
        console.log("helllo")
        http.open('GET', getURL, true);
        http.send();
        http.onreadystatechange = function(){
          console.log("hello")
          var counter = 0;
          if(http.readyState == 4 && http.status == 200){
            customerData = JSON.parse(http.responseText).customerData;
            console.log(customerData);
            customerData.forEach(function(element){
              if(counter%2===1){
                element.background = 'style="background: rgb(245, 245, 245);"';
              } else{
                element.background = '';
              }
              $('#msOrderCenterListingProducts').append(insert(element));
              counter++;
            });
          }
        }
        // since we're only going to one other part
        // of the website, we just append elements
        
      }
    }
  }, 10);
});

// console.log('we are here');
//         chrome.runtime.sendMessage({getURL: getURL}, function(response) {
//           console.log(response.farewell);
//         });
//         // since we're only going to one other part
//         // of the website, we just append elements
//         [1, 2, 3].forEach(function(element){
//           $('#msOrderCenterListingProducts').append(insert);
//         });

// console.log($('span'));
//       $('span').on('click', function(){
//         console.log('wastups')
//       });

//       $('.srchAddToCart').on('click', function(){
//         console.log('inside the initialize function')
//         console.log(this.id);
//       });
//       $('#msOrderCenterListingProducts').append(insert);

// when i click on add to shopping srchAddToCart
// i need to send that item id over to the server
// once it hits the server, add it to the user's shopping shopingcart
// when i click on the chrome extension, then the angular should run initialize
// which will make a request to our server and get back the list of items in the shoppingcart

// parent id is msOrderCenterListingProducts
// class msOrderCenterRows

