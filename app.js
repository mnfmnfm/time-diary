'use strict';

// localstorage contains 2 important things:
// startTime: the Date.now() of the most recent button press
// entries: a JSON array of Entries

// on page load, load data out of localstorage
let $history = $('#historyContainer');
let entries = [];
$(document).ready(function() {

  let tempEntries = localStorage.getItem('entries');
  if(tempEntries) {
    entries = JSON.parse(tempEntries);
  }
  renderEntries();

  setStartEndTimes();
});

function setStartEndTimes() {
  // render default start/end times
  let $start = $('#starttime');
  $start.val(getValueDate(new Date(Number(localStorage.getItem('startTime')))));

  let $end = $('#endtime');
  $end.val(getValueDate(new Date()));
}
// constructor for Entry
function Entry(startTime, endTime, title, category) {
  this.startTime = startTime;
  this.endTime = endTime;
  this.title = title;
  this.category = category;
}

// main logic: what happens when we log
$('#lognow').on('submit', function(e) {
  e.preventDefault();
  console.log('submitted');
  console.log($(this).serialize());

  let now = Date.now();
  console.log(now);
  let startTime = 0;
  let endTime = now;
  if(this.set && this.set.checked) {
    // specified start & end times
    startTime = this.starttime.value;
    endTime = this.endtime.value;
  } else {
    // standard entry of the last while
    startTime = localStorage.getItem('startTime');
    if(startTime) {
      startTime = Number(startTime);
    } else {
      // let's just default to 10 minutes ago?
      startTime = now - (10 * 60 * 1000);
    }
    // store now as the next startTime
    localStorage.setItem('startTime', now);
  }

  let newEntry = new Entry(startTime, endTime, this.title.value, this.category.value);
  console.log(newEntry);

  // add to entries and save
  entries.push(newEntry);
  localStorage.setItem('entries', JSON.stringify(entries));

  // clear form
  this.reset();
  setStartEndTimes();

  // render entry
  renderEntry(newEntry);
});

// renders the contents of the entries array onto the page
function renderEntries() {
  console.log(entries);
  for(let entry of entries) {
    renderEntry(entry);
  }
}

function renderEntry(entry) {
  let startDate = new Date(entry.startTime);
  let endDate = new Date(entry.endTime);
  let contentString = `<div class="row"> <div class="entryHeader ${entry.category}">${entry.title || ('Misc ' + entry.category)}</div><div class="entryTime">${startDate.toLocaleTimeString('en-US')} to ${endDate.toLocaleTimeString('en-US')}</div></div>`;
  $history.prepend(contentString);
}

function getValueDate(date) {
  return new Date(date - date.getTimezoneOffset() * 60 * 1000).toISOString().slice(0, 19);
}
