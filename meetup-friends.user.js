// ==UserScript==
// @name           Meetup-friends
// @namespace      valdun.net
// @description    Manage a friend list on meetup.com
// @include        http://www.meetup.com/*/events/*
// @version        1
// @grant          none
// @require        http://code.jquery.com/jquery-latest.min.js
// ==/UserScript==

var friends = [
  123456789, // ID of a friend
  123456789, // ID of a second friend, and so on...
];

// Display position in wait list
$('#rsvp-list-waitlist li').each(function (i, elt) {
  $('h5', this).prepend('#' + (i + 1) + ' - ');
});

// Display wait list length
$('.event-attendees h3').after('<h4>' + $('#rsvp-list-waitlist li').length + ' waiting</h4>');

// Highlight friends
var $my_profile = $('#rsvp-list').children().first(),
    friends_list = {},
    colors = {
      no: 'red',
      waitlist: 'grey',
      list: 'green'
    };

function createLists() {
  for (var status in colors) {
    friends_list['$' + status] = $('<div/>').css({'box-shadow': '0 0 0 10px ' + colors[status], 'margin-bottom': '20px'}).insertAfter($my_profile);
  }
}

function updateFriendsList() {
  for each ($list in friends_list) {
    $list.empty().show();
  }

  $.each(friends, function(i, id) {
    var $friend = $('#rsvp_' + id);
    if (!$friend.length) {
      return;
    }

    var friend_status = $friend.parent().attr('id').replace(/.*-/, '');
    $friend.clone().appendTo(friends_list['$' + friend_status]);
    $friend.css({
      'background-color': '#E0393E',
      'box-shadow': '0 0 0 10px #E0393E'
    });
  });

  for each ($list in friends_list) {
    if (!$list.children().length) {
      $list.hide();
    }
  }
}

createLists();
updateFriendsList();

$('.nav-appendPager').click(function() {
  window.setTimeout(function() {
    updateFriendsList();
  }, 1000);
});
