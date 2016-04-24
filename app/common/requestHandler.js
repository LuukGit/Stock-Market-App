var Poll = require("../models/poll.js");
var User = require("../models/users.js");

module.exports =  {

  newPoll(req, res) {
        var newPoll = new Poll();
        var results = [];
        for (var i = 0; i < req.body.options.length; i++) {
          var result = {};
          result["option"] = req.body.options[i];
          result["votes"] = 0;
          results.push(result);
        }

        newPoll.title = req.body.title;
        newPoll.options = req.body.options;
        newPoll.owner = req.user.github.id;
        newPoll.results = results;
        newPoll.voters = [];

        newPoll.save(function(err) {
          if (err) { throw err; }
          console.log("Saved new Poll:\n" + newPoll);
        });

        // Add the new poll to the current users polls.
        req.user.polls.push(newPoll);
        req.user.save(function(err) {
          if (err) { throw err; }
          console.log("Added poll to MyPolls");
          res.json(newPoll._id);
        });
  },

  getPoll(req, res) {
    Poll.findOne({_id: req.params.id}, function(err, poll) {
      if (err) { throw err; }
      if (poll) {
        res.json(poll);
      }
      else {
        res.send("no poll");
      }
    })
  },

  deletePoll(req, res) {
    Poll.remove({_id: req.params.id}, function(err) {
      if (err) { throw err; }
      else {
        // Remove the  poll from the current users polls.
        var polls = req.user.polls;
        for (var i = 0; i < polls.length; i++) {
          if (("" + polls[i]._id) === ("" + req.params.id)) {
            polls.splice(i, 1);
          }
        }
        var conditions = {displayName: req.user.displayName}
          , update = { $set: {polls: polls} }
          , options = { multi: false };

        User.update(conditions, update, options, function(err) {
          if (err) { throw err; }
          console.log("Poll succesfully removed!");
          res.json("success");
        });
      }
    })
  },

  addVoteToPoll(req, res) {
    var user = req.body.user;
    var vote = req.body.vote;
    var poll = req.body.poll;
    poll.voters.push(user.github.id);

    // Check if option already exists
    var index = -1;
    var duplicate = false;

    for (var i = 0; i < poll.options.length; i++) {
      var str1 = "" + vote;
      str1 = str1.toLowerCase();
      var str2 = "" + poll.options[i];
      str2 = str2.toLowerCase();
      // Duplicate new option
      if (str1 === str2 && poll.options[i] !== vote) {
        duplicate = true;
        res.send("duplicate");
        break;
      }
      // Existing option
      else if (str1 === str2) {
        index = i;
      }
    }

    if (!duplicate) {
      // If choice is a new option
      if(index === -1) {
        var result = {};
        result["option"] = vote;
        result["votes"] = 1;
        poll.results.push(result);
        poll.options.push(vote);
      }
      // If choice already existed.
      else {
        for (var i = 0; i < poll.results.length; i++) {
          if (poll.results[i].option === vote) {
             poll.results[i].votes += 1;
          }
        }
      }

      // Update poll
      var conditions = {_id: poll._id}
        , update = { $set: {results: poll.results, options: poll.options, voters: poll.voters} }
        , options = { multi: false };

      Poll.update(conditions, update, options, function(err) {
        if (err) { throw err; }
        console.log("Vote succesfully added!");
        res.json(poll);
      });
    }
  }
};
