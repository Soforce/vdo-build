var paymentonetimecost = 0;
        var paymentmonthlycost = 31.00;
        var bundlemonthlycost = 17.50;

        $( document ).ready(function() {
          
        	//Phone image scrolling
            $(window.parent).scroll(function(){
                if($(window.parent).scrollTop() > 445){
                	$('.phoneimage').addClass('phoneimagefixed');
                	if($(window.parent).scrollTop() < 1370){
                	    $('.phoneimage').css('top', $(window.parent).scrollTop()-220);
                	}
                }else{
                	$('.phoneimage').removeClass('phoneimagefixed');
                }
            })

        	//Select a bundle
        	$('.bundleoption').on('click', function (event) {

            	$('.bundleoption').removeClass('selectedbundle');
            	$target = $(event.target);
                $target.addClass('selectedbundle');
                bundlemonthlycost = $('.selectedbundle > p:first-child').attr('monthly');
                $('#bundlemonthly').html('$ ' + bundlemonthlycost);
                $('#bundletitle').html($('.selectedbundle > p:first-child').html());
                calculatetotals();
            });
        	//Select a colour
            $('.colouroption').on('click', function (event) {
              $('.phonemockup').hide();
              $('.colouroption').removeClass('selectedcolour');
              $('.colourtext').html('' + event.target.getAttribute('name'));
              $('.phonemockup.' + event.target.id).show();
              $target = $(event.target);
              $target.addClass('selectedcolour');
            });

            //Select a year
            $('.yearoption').on('click', function (event) {
            	$('.yearoption').removeClass('selectedyear');
            	$target = $(event.target);
              $target.addClass('selectedyear');
  		        if(event.target.id == 'year2'){
              	$('#payment1').html('<p onetime="0.00" monthly="31.00">$ 0.00<span>One-time payment</span></p><p>$ 31.00 / month</p>');
              	$('#payment2').html('<p onetime="228.00" monthly="21.50">$ 228.00<span>One-time payment</span></p><p>$ 21.50 / month</p>');
              	$('#payment3').html('<p onetime="999.00" monthly="0.00">$ 999.00<span>One-time payment</span></p><p>$ 0.00 / month</p>');
              	$('#paymentchosen').html('<p onetime="0.00" monthly="31">$ 0.00<span>One-time payment</span></p><p>$ 31.00 / month</p>');
              	$('#bundle1').html('<p monthly="0.00">Existing Family Plan</p><p>$ 0.00 / month</p>');
              	$('#bundle2').html('<p monthly="10.50">5 GB + Unlimited Calls</p><p>$ 10.50 / month</p><div class="points-highlight">Earn 75 Points</div>');
              	$('#bundle3').html('<p monthly="16.50">10 GB + Unlimited Calls + Data Free Netflix</p><p>$ 16.50 / month</p><div class="points-highlight">Earn 100 Points</div>');
              	$('#bundle4').html('<p monthly="24.50">Unlimited Data, Minutes, Texts</p><p>$ 24.50 / month</p><div class="points-highlight">Earn 125 Points</div>');
              	$('#bundle5').html('<p monthly="32.00">Unlimited Data, Minutes, Texts + Roaming</p><p>$ 32.00 / month</p><div class="points-highlight">Earn 150 Points</div>');
              	$('#yeardiscount').html('<p><span class="greenhighlight">24 month discount</span></p><p><span class="greenhighlight">- $ 10.00</span></p>');
              	$('#bundle1').click();
              	$('#payment1').click();
                $('.yearchosen').html('Contract Duration: 2 Years');
                $('.shoppinglineyear').html('Duration 2 Years');
              }
              else{
              	$('#payment1').html('<p onetime="372.00" monthly="31.00">$ 372.00<span>One-time payment</span></p><p>$ 31.00 / month</p>');
              	$('#payment2').html('<p onetime="486.00" monthly="21.50">$ 486.00<span>One-time payment</span></p><p>$ 21.50 / month</p>');
              	$('#payment3').html('<p onetime="999.00" monthly="0.00">$ 999.00<span>One-time payment</span></p><p>$ 0.00 / month</p>');
              	$('#paymentchosen').html('<p onetime="372.00" monthly="31.00">$ 372.00<span>One-time payment</span></p><p>$ 31.00 / month</p>');
              	$('#bundle1').html('<p monthly="0.00">Existing Family Plan</p><p>$ 0.00 / month</p>');
              	$('#bundle2').html('<p monthly="12.50">5 GB + Unlimited Calls</p><p>$ 12.50 / month</p><div class="points-highlight">Earn 75 Points</div>');
              	$('#bundle3').html('<p monthly="18.50">10 GB + Unlimited Calls + Data Free Netflix</p><p>$ 18.50 / month</p><div class="points-highlight">Earn 100 Points</div>');
              	$('#bundle4').html('<p monthly="26.50">Unlimited Data, Minutes, Texts</p><p>$ 26.50 / month</p><div class="points-highlight">Earn 125 Points</div>');
              	$('#bundle5').html('<p monthly="35.00">Unlimited Data, Minutes, Texts + Roaming</p><p>$ 35.00 / month</p><div class="points-highlight">Earn 150 Points</div>');
              	$('#yeardiscount').html('<p><span class="greenhighlight">12 month discount</span></p><p><span class="greenhighlight">- $ 10.00</span></p>');
              	$('#bundle1').click();
              	$('#payment1').click();
                $('.yearchosen').html('Contract Duration: 1 Year');
                $('.shoppinglineyear').html('Duration 1 Year');
              }
            });

            //Select a payment plan
            $('.paymentoption').on('click', function (event) {
            	if(event.target.id != 'paymentchosen'){
        	    	$('.paymentoption').removeClass('selectedpayment');
        	    	$target = $(event.target);
        	        $target.addClass('selectedpayment');
                	$('#paymentchosen').html(($target).html());
        	        $('.paymentoptions').removeClass('expandpayments');
        	        paymentonetimecost = $('#paymentchosen > p:first-child').attr('onetime');
        	        paymentmonthlycost = $('#paymentchosen > p:first-child').attr('monthly');
        	        $('#paymentplanmonthly').html('$ ' + paymentmonthlycost);
        	        $('#paymentplanonetime').html('$ ' + paymentonetimecost);
        	        calculatetotals();
        	    }
            });

            //Expand the payment plans
            $('.paymentchosen').on('click', function (event) {
            	$('.paymentoptions').toggleClass('expandpayments');
            });

            //Calculate total monthly and onetime
            function calculatetotals(){
            	var totalmonthly = (parseFloat(paymentmonthlycost) + parseFloat(bundlemonthlycost) - 10).toFixed(2);
            	var totalonetime = parseFloat(paymentonetimecost) + 24.24;
            	$('.totalbaronetime').html('$ ' + totalonetime);
            	$('.totalbarmonthly').html('$ ' + totalmonthly);
            }

        });