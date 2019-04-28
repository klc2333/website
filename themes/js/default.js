
var slideIndex = 0;
var galleryTimer
var galleryImages = $(".gallery-image");

var ADML = {

	initPage: function(pageName) {
		$(function(){
			$.get("header.html", function(data) {
				$("body").prepend(data)
				$("#header-" + pageName).addClass('active')
			});
			$.get("footer.html", function(data) {
				$("body").append(data)
			});
		});
	},

	modalOpen: function(e) {
		// $('#modal').show();

		var jE = $(e)

		if (jE){
			var modalContent = jE.find('.modal-content')
			if (modalContent.length) {
				$('#modal').css('display', 'flex').find('.modal-content').replaceWith(modalContent.clone())
			}

			$(document).on("keypress", function(e) {

				if (e.keyCode == 27) {
					ADML.modalClose()
				}
			})
		}



	},

	galleryInit : function() {

	    galleryTimer = setTimeout(ADML.galleryUp, 5000); // Change image every 5 seconds
	},

	galleryUp : function() {
		slideIndex++;
	    if (slideIndex == galleryImages.length) {slideIndex = 0}
	    ADML.galleryChange()
	},

	galleryDown : function() {
		if (slideIndex == 0) {slideIndex = galleryImages.length}
		slideIndex--;
	    ADML.galleryChange()
	},

	galleryChange : function() {

	    galleryImages.removeClass('active')

		galleryImages.each(function(i, obj) {
		  if (i == slideIndex) {
		    $(this).addClass('active')
		  };
		});

		clearTimeout(galleryTimer)
		galleryTimer =setTimeout(ADML.galleryUp, 5000)
	},

	modalClose : function() {
		$('#modal').hide()
		$(document).off("keypress")
	},

	peopleInit : function() {

		$.ajax({
			dataType: "json",
			url: "themes/people_list_editable.json",
			error: function(error) {
				$('#people-section').html('<div class="placeholder-message">Problem loading people_list_editable.json</div>')
			},
			success: function(response) {

			    peopleDiv = ""

			    response['groups'].map( (group) => {

			    	if (group['members'].length == 0 ) return

					peopleDiv +=

					'<div class="content-section">'
	+					'<h1>' + group['group_name'] + '</h1>'

					group['members'].map( (member) => {

						peopleDiv +=

						'<div class="profile">'
	+						'<img class="profile-picture" onload="this.style.display=\'inline-block\'" src="themes/img/people/' + member['name'].toLowerCase().split(" ").join("_") + ".jpg" + '">'
	+						'<div class="profile-text">'
	+							'<div class="profile-title">'
	+								'<div class="profile-name">' + ((member['name'] && member['name'] != "") ? member['name'] : "") + '</div>'
	+								'<div class="profile-type">' + ((member['type'] && member['type'] != "") ? member['type'] : "") + '</div>'
	+							'</div>'
	+							'<div class="profile-description">' + ((member['description'] && member['description'] != "") ? member['description'] : "") + '</div>'
	+						'</div>'
	+						'<div class="profile-contact-info">'
	+							((member['linkedin'] && member['linkedin'] != "") ? ('<div class="profile-contact"><a href="' + member['linkedin'] + '"><img src="themes/img/misc/linkedin.png"></a></div>') : "")
	+							((member['email'] && member['email'] != "") ? ('<div class="profile-contact"><a href="mailto:' + member['email'] + '"><img src="themes/img/misc/email.png"></a></div>') : "")
	+						'</div>'
	+					'</div>'

					})

					if (group['members'].length > 1 && group['members'].length % 2) {
						peopleDiv += '<div class="equalizer"></div>'
					}

					peopleDiv += '</div>'

				})

			    $('#people-section').html(peopleDiv)
			}
		});
	},

	init: function() {
		// kick things off

	}

};
