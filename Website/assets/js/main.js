$(document).ready(function() {
	pullTopStories();

	var $topStories;
  
	function pullTopStories() {
		$.ajax({
		  url: "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty",
		  dataType: 'JSON',
		  type: 'get',
		  success: topStoriesSuccessHandler,
		  error: function(response) {
		    console.log('an error happened while pulling top stories');
		  }
		});
	}

	function topStoriesSuccessHandler(response) {
		$topStories = $(response);
		$topStories.each(function() {
		  pullStory(this);
		});
	}

	function pullStory(id) {
		$.ajax({
		  url: "https://hacker-news.firebaseio.com/v0/item/" + id + ".json",
		  dataType: 'JSON',
		  type: 'get',
		  success: pullStorySuccessHandler,
		  error: function(response) {
		    console.log('an error happened while pulling top stories');
		  }
		});
	}

	function pullStorySuccessHandler(response) {
		buildCard(response);
	}

	function buildCard(story) {
		var html = '<div class="news-report ' + story.id + '"><article class="news-report-article">';
		if(story.text!=undefined) {
		    html += '<h3>' + story.title + '</h3>';
		    var timeStamp = new Date(story.time * 1000);
		    var humanTime = timeStamp.toUTCString();
		    html += '<div class="date-author">' + humanTime + ' by ' + story.by;
		    if(story.descendants!=undefined) {
		    	html += ' | <span class="comments-counter">' + story.descendants + ' comments</span>';
		    }
		    html += '</div>';
		    html += '<p>' + story.text + '</p>';
		    html += '</article>';
		    if(story.descendants!=undefined) {
		    	html += '<div class="comments-section">';
		    	html += '<div class="comments hide ' + story.id + '">';
		    	html += '</div>';
		    	if(story.descendants>=1) {
		    		html += '<div class="show-hide">Show Comments</div>';
		    	}
		    	else {
		    		html += '<div class="no-comments">No Comments</div>';
		    	}
		    	html += '</div>';
		    }
		    html += '</div>';
		    $(html).appendTo('.content');
			var $comments = $(story.kids);
			$comments.each(function() {
			    $(this).each(function() {
			  		$.ajax({
				      url: "https://hacker-news.firebaseio.com/v0/item/" + this + ".json",
				      dataType: 'JSON',
				      type: 'get',
				      success: pullCommentSuccessHandler,
				      error: function(response) {
				        console.log('an error happened while pulling comments');
				      }
					});
			    });
			});		    
		}
	}

	function pullCommentSuccessHandler(response) {
		buildComments(response);
	}

	function buildComments(kid) {
		var html = '<div class="comment">';
		if(kid!=undefined){
	  		var $parent = $('.comments.'+kid.parent);
	  		var timeStamp = new Date(kid.time * 1000);
			var humanTime = timeStamp.toUTCString();
		  	html += '<div class="date-author">' + kid.by + ' | ' + humanTime + '</div>';
		  	html += kid.text;
		  	html += '</div>';
		}
		if(kid.parent) {
		  	$(html).appendTo($parent);
		}
		$(".show-hide").on('click', function() {
			$(this).parent().find(".comments").toggleClass("hide");
			$(this).html($(this).html() == 'Show Comments' ? 'Hide Comments' : 'Show Comments');
		});
	}
	
});

