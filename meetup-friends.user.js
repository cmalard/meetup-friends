// ==UserScript==
// @name           Meetup-friends
// @namespace      valdun.net
// @description    Manage a friend list on meetup.com
// @include        http://www.meetup.com/*/events/*
// @include        https://www.meetup.com/*/events/*
// @version        1.1
// @grant          none
// @require        http://code.jquery.com/jquery-latest.min.js
// ==/UserScript==

/* eslint-env greasemonkey, jquery */

this.$ = this.jQuery = jQuery.noConflict(true);

const friends = [
  // 123456789, // ID of a friend
];

const colors = {
  list: '#0fd9a3',
  waitlist: '#353e48',
  no: '#ed1c40',
};

const displaySections = getDisplaySections();

displayWaitPosition();
displayWaitLength();

displayFriends();
autoUpdate();


/** **************************************************************************
 *  Functions
 */
function autoUpdate() {
  $('.nav-appendPager').click(() => {
    window.setTimeout(() => {
      displayFriends();
    }, 1000);
  });
}

function displayFriends() {
  Object.values(displaySections).forEach(($list) => {
    $list.empty().show();
  });

  friends.forEach((id) => {
    const $friend = $(`#rsvp_${id}`);
    if (!$friend.length) {
      return;
    }

    const friendStatus = $friend.parent().attr('id').replace(/.*-/, '');
    $friend.clone().appendTo(displaySections[`$${friendStatus}`]);
    $friend.css({
      'background-color': colors.list,
      'box-shadow': `10px 0 0 0 ${colors.list}, -10px 0 0 0 ${colors.list}`,
    });
  });

  Object.values(displaySections).forEach(($list) => {
    if (!$list.children().length) {
      $list.hide();
    }
  });
}

function displayWaitLength() {
  const waitLength = $('#rsvp-list-waitlist li').length;
  $('.event-attendees h3')
    .after(`<h4>${waitLength} waiting</h4>`);
}

function displayWaitPosition() {
  $('#rsvp-list-waitlist li').each((i) => {
    $('h5', this).prepend(`#${i + 1} - `);
  });
}

function get$firstAttendee() {
  let $attendee = $('#rsvp-list').children().first();
  if (!$attendee.hasClass('memberinfo-widget')) {
    $attendee = $attendee.next();
  }

  return $attendee;
}

function getDisplaySections() {
  const $firstAttendee = get$firstAttendee();
  const sections = {};

  for (let status in colors) {
    sections[`$${status}`] = $('<div/>')
      .css({
        'box-shadow': `0 0 0 10px ${colors[status]}`,
        'margin-bottom': '20px',
      })
      .insertBefore($firstAttendee);
  }

  return sections;
}
