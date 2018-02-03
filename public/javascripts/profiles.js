/**
 * This javascript file populates the page with the current profiles stored in the database.
 *
 * @type {Array}
 */

// create empty array for the data
var profiles = [];
var start_stop;
var button;

// DOM Ready =============================================================
$(document).ready(function () {
    button = document.getElementById('simulator');

    // Populate the existing profile table on initial page load
    populateTable();
    checkSimulatorRunning() ? start_stop = 1 : start_stop = false;

    //Delete profile link click
    $("#body").on('click', 'td a.delete', deleteProfile);
    $("#body").on('click', 'td a.select', selectProfile);

});

function populateTable() {
    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON('/profile/all', function (data) {

        profiles = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function () {
            console.log("Populate table with " + this._id);
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="select" rel="' + this._id + '">select</a></td>';
            tableContent += '<td>' + this._id + '</td>';
            tableContent += '<td><a href="#" class="delete" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $("#body").html(tableContent);
    });
}

function checkSimulatorRunning() {
    return $.getJSON('/checkSimulator');
}

// Delete profile
function deleteProfile(event) {

    event.preventDefault();

    var confirmation = confirm('Are you sure you want to delete this profile?');

    if (confirmation === true) {
        // send post request with id as param to delete profile from database
        $.ajax({
            type: 'DELETE',
            url: '/profile/' + $(this).attr('rel')
        }).done(function (response) {
            alert(response.msg);
            populateTable();
        });
    }
    else {
        return false;
    }
}

// save profile for next simulator start
function selectProfile(event) {
    event.preventDefault();

    var confirmation = confirm('Are you sure you want to start simulator with selected profile?');

    if (confirmation === true) {

        var profile = getJSONById($(this).attr('rel'));
        profile = JSON.stringify(profile, null, 2);

        // send post request and save selected profile for next simulator start
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                alert(this.responseText);
            }
            if (xhr.status === 500) {
                alert("Error saving profile");
            }
        });

        xhr.open("POST", "/selectProfile");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(profile);
    }
    else {
        return false;
    }
}

function startStop() {
    if (start_stop) {
        start_stop = false;
        button.value = "Stop Simulator";
        button.className = "stop";
        startSimulator();
    } else {
        start_stop = true;
        button.value = "Start Simulator";
        button.className = "start";
        stopSimulator();
    }
}

function startSimulator() {
    var confirmation = confirm('Are you sure you want to start the simulator?');

    if (confirmation === true) {

        // send post request and save selected profile for next simulator start
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open("POST", "/startSimulator");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                alert(this.responseText);
            }
            if (xhr.status === 500) {
                alert("Error starting the simulator");
            }
        });
        xhr.send(JSON.stringify({"msg": "Start"}));
    }
    else {
        return false;
    }
}

function stopSimulator() {
    var confirmation = confirm('Are you sure you want to stop the simulator?');

    if (confirmation === true) {
        // send post request and save selected profile for next simulator start
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open("POST", "/startSimulator");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                alert(this.responseText);
            }
            if (xhr.status === 500) {
                alert("Error stopping the simulator");
            }
        });

        xhr.send(JSON.stringify({"msg": "Stop"}));
    }
    else {
        return false;
    }
}

function getJSONById(id) {
    for (var i = 0; i < profiles.length; i++) {
        if (profiles[i]._id === id) {
            return profiles[i];
        }
    }
}