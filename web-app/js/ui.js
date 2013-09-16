// function for preload some images on the page
jQuery.fn.preload = function() {
    if (!window.location.origin)
        window.location.origin = window.location.protocol+"//"+window.location.host;
    var host = window.location.origin;
    this.each(function(){
        jQuery('<img/>')[0].src = host + this;
        //console.log("src=" + host + this);
    });
}

// function for highlighting current page in navigation menu
jQuery.isTheSame = function(currentPage, link, rootNavItem) {
    if (link == currentPage) {
        rootNavItem.addClass('activeNav');
    };
}

// List for navigation icons should be preloaded.
var iconPath = 'uiblueicons';
if (themeSettings == 'dark') iconPath = 'uidarkicons';
var preloadImagesList = [
    '/images/'+iconPath+'/16/home.png',
    '/images/'+iconPath+'/16/image.png',
    '/images/'+iconPath+'/16/security.png',
    '/images/'+iconPath+'/16/keypairs.png',
    '/images/'+iconPath+'/16/instance.png',
    '/images/'+iconPath+'/16/flavors.png',
    '/images/'+iconPath+'/16/task.png',
    '/images/'+iconPath+'/16/volume.png',
    '/images/'+iconPath+'/16/snapshot.png',
    '/images/'+iconPath+'/16/quotas.png',
    '/images/'+iconPath+'/16/service.png',
    '/images/'+iconPath+'/16/tenants.png',
    '/images/'+iconPath+'/16/loadbalancing.png',
    '/images/'+iconPath+'/16/heat.png',
    '/images/'+iconPath+'/16/user.png',
    '/images/'+iconPath+'/16/quantum.png',
    '/images/'+iconPath+'/16/networks.png',
    '/images/'+iconPath+'/16/policies.png',
    '/images/'+iconPath+'/16/vip.png',
    '/images/'+iconPath+'/16/job.png',
    '/images/'+iconPath+'/16/router.png'
];
jQuery(preloadImagesList).preload();

function buttonInitialization() {
    jQuery( "input[type=submit], .buttons button, .buttons a" ).button();
}

jQuery(function() {
    // checkin browser version
    var browserWarning = true;
    if (jQuery.browser.name == "msie" && jQuery.layout.versionNumber > 8 ) {
        var browserWarning = false;
    } else if (jQuery.browser.name == "firefox" && parseInt(jQuery.layout.versionNumber) > 3) {
        var browserWarning = false;
    } else if (jQuery.browser.name == "safari" && parseInt(jQuery.layout.versionNumber) > 525) {
        var browserWarning = false;
    } else if (jQuery.browser.name == "chrome") {
        var browserWarning = false;
    } else if (jQuery.browser.name == "opera" && jQuery.browser.versionX >= 8) {
        var browserWarning = false;
    }

    if (browserWarning && !jQuery.cookie("oldBrowserAgreement")) jQuery("#browserAlert").show();
    /*
    // Highlighting current page in navigation menu
    */
    var currentPage = jQuery(location).attr('href').split('/')[3];
    //console.log(jQuery(location).attr('href'));
    // Set activeNav class to the current navigation item
    var rootNav = jQuery("#topNav").children('li');
    jQuery.each( rootNav, function(){
        var rootNavItem = jQuery(this);
        jQuery.isTheSame(currentPage, rootNavItem.children('a').attr("href").split('/')[1], rootNavItem);
        submenu = jQuery(this).find('li');
        jQuery.each( submenu, function(){
            jQuery.isTheSame(currentPage, jQuery(this).children('a').attr("href").split('/')[1], rootNavItem);
        })
    });

    if (jQuery.browser.name == "msie" && jQuery.layout.versionNumber < 9 ) { }
    else {
        // jQuery styles for button initialization
        buttonInitialization();
        // jQuery custom styles for select initialization
        jQuery( "select" ).combobox();
    }

    jQuery("#confirmationDialog").dialog({ modal: true, width: 400, autoOpen: false });



    var previousDataCenter;

    //get current datacenter name on dropdown list focus
    jQuery("#select_dataCenterName").focus(function(){
        previousDataCenter = jQuery("#dataCenterName").val();
        return false;
    });


    jQuery("#dataCenterName").change(function() {
        //check if datacenter is available
        if (jQuery(this).val()[0] != "?") {
            //if yes, submit
            jQuery(this).closest('form').submit();
        }
        else {
            //if not, show dialog window
            jQuery("#confirmationDialog").html("Sorry this datacenter is not available!");
            jQuery("#confirmationDialog").dialog({
                buttons: [{
                    id:"btn-ok",
                    text: "Ok",
                    click: function() {
                        //set back current datacenter after attempt of connection to unavailable
                        jQuery("#dataCenterName").val(previousDataCenter);
                        jQuery("#select_dataCenterName").val(previousDataCenter);
                        jQuery(this).dialog("close");
                    }
                }]
            });
            jQuery("#confirmationDialog").dialog("open");
        }
    });

    /*
    // Highlight required form field labels
    */
    if (requiredFieldsArray && !jQuery.isEmptyObject(requiredFieldsArray)) {
        var count = 0;
        for (var requiredField in requiredFieldsArray) {
            if (requiredFieldsArray.hasOwnProperty(requiredField)) {
                if (jQuery("form label[for='" + jQuery('[name='+requiredField+']').attr('id') + "']").html()) {
                    jQuery("form label[for='" + jQuery('[name='+requiredField+']').attr('id') + "']").addClass(requiredFieldsArray[requiredField]);
                } else {
                    if (jQuery("form label[for='" + requiredField + "']").html())
                        jQuery("form label[for='" + requiredField + "']").addClass(requiredFieldsArray[requiredField]);
                    else
                        console.log("lost required field for " + requiredField);
                }
                ++count;
            }
        }

    }

    // set cookie for old Browser Agreement
    jQuery('#oldBrowserAgreement').click(function() {
        jQuery.cookie("oldBrowserAgreement", "1", {expires:100, path: '/'});
    });

    // set cookie for themes switcher
    jQuery('#themeSwitcher, #blueSwitcher, #orangeSwitcher').click(function() {
        var themeSettings = jQuery.cookie("theme");
        if ((jQuery(this).attr('id') == 'blueSwitcher' && themeSettings == 'dark') || (jQuery(this).attr('id') == 'orangeSwitcher' && !themeSettings) || (jQuery(this).attr('id') == 'orangeSwitcher' && themeSettings == 'blue') ) {
            if (themeSettings == 'dark') jQuery.cookie("theme", "blue", {expires:300, path: '/'});
            else if (themeSettings == 'blue') jQuery.cookie("theme", "dark", {expires:300, path: '/'});
            else jQuery.cookie("theme", "dark", {expires:300, path: '/'});

            window.location.reload();

        };
    });

});


jQuery.formatConfirmationDialog = function(clickedButton, warning) {
    jQuery("#confirmationDialog").html(warning);
    jQuery("#confirmationDialog").dialog({
        buttons: [{
            id:"btn-confirm",
            text: "Confirm",
            click: function() {
                jQuery(this).dialog("close");
                clickedButton.closest("form").attr("action", clickedButton.closest("form").attr('action').replace('index', clickedButton.attr('name').substr(8)));
                clickedButton.closest("form").submit();
            }
        },
            {
                id:"btn-cancel",
                text: "Cancel",
                click: function() {
                    jQuery(this).dialog("close");
                }
            }]
    });
    jQuery("#confirmationDialog").dialog("open");
}