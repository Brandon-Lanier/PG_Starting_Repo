$(document).ready(onReady);

function onReady() {
    getSongs();
    $('#add').on('click', postSong);
    $('#songsTableBody').on('click', '.btn-delete', deleteSong)
}

// get artist data from the server
function getSongs() {
    $("#songsTableBody").empty();
    // let songId = 108;
    $.ajax({
        type: 'GET',
        // url: `/songs/${songId}`
        url: `/songs`
    }).then(function (response) {
        console.log("GET /songs response", response);
        // append data to the DOM
        for (let i = 0; i < response.length; i++) {
            $('#songsTableBody').append(`
                <tr>
                    <td>${response[i].artist}</td>
                    <td>${response[i].track}</td>
                    <td>${response[i].rank}</td>
                    <td>${response[i].published}</td>
                    <td><button class="btn-delete" data-id=${response[i].id}>Delete</button></td>
                </tr>
            `);
        }
    });
}

function postSong() {
    let payloadObject = {
        artist: $('#artist').val(),
        track: $('#track').val(),
        rank: $('#rank').val(),
        published: $('#published').val()
    }
    $.ajax({
        type: 'POST',
        url: '/songs',
        data: payloadObject
    }).then( function (response) {
        $('#artist').val(''),
        $('#track').val(''),
        $('#rank').val(''),
        $('#published').val('')
        getSongs();
    });
}

function deleteSong() {
    let songId = $(this).data().id;
    $.ajax({
        method: 'DELETE',
        url: `songs/${songId}`
    }).then(function(response) {
        console.log('Deleted it!');
        getSongs();
    }).catch(function(err) {
        console.log('Error deleting!', err); 
    })
}