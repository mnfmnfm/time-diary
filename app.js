'use strict';

$('#lognow').on('submit', function(e) {
  e.preventDefault();
  console.log('submitted');
  console.log($(this).serialize());

  let now = Date.now();
  console.log(now);
});
