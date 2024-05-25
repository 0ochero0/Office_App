$(document).ready(function () {
    // Word count limit
    //  const wordLimit = 50;

    $('input[name="office-area"]').on('change', function () {
        // Declare a const to save the selected office area
        const selectedOfficeArea = $('input[name="office-area"]:checked').val();
        document.getElementById('displayOfficeArea').textContent = selectedOfficeArea || 'Not selected';
        $('#facility-section').show();
        $('#readback').show();
        document.getElementById('facility-section').scrollIntoView({ behavior: 'smooth' });
    });

    // Show next segment, fade out earlier, move to view
    $('input[name="facility"]').on('change', function () {
        const selectedFacility = $('input[name="facility"]:checked').val();
        document.getElementById('displayFacility').textContent = selectedFacility || 'Not selected';
        $('#office-area-section').animate({ opacity: 0.5 });
        $('#comment-section').show();
        document.getElementById('comment-section').scrollIntoView({ behavior: 'smooth' });
    });

    /* Restrict word count in comments
    $('#comments').on('input', function () {
        let words = $(this).val().split(/\s+/);
        if (words.length > wordLimit) {
            $(this).val(words.slice(0, wordLimit).join(' '));
            $('#word-count-warning').text(`You can only enter up to ${wordLimit} words.`);
        } else {
            $('#word-count-warning').text(`Word count: ${words.length}/${wordLimit}`);
        }
    });
    */

    // Handle form submission
    $('#issue-form').on('submit', function (event) {
        event.preventDefault();
        // Gather input data
        const officeArea = $('input[name="office-area"]:checked').val();
        const facility = $('input[name="facility"]:checked').val();
        const comments = $('#comments').val();
        const email = $('#email').val();
        // Send data to the server (this will be implemented in the backend)
        $.post('/report-issue', {
            officeArea: officeArea,
            facility: facility,
            comments: comments,
            email: email
        }, function (response) {
            // Handle response from the server (e.g., display a success message, clear form)
            console.log('Server response:', response);
            alert('Thank you for helping to improve our office environment!');
            $('#issue-form')[0].reset();
            $('#facility-section').hide();
            $('#comment-section').hide();
            //$('#word-count-warning').text('');
            // Optionally, display reported issues (this will be implemented in the backend)
            loadReportedIssues(officeArea);
            $('#office-area-section').hide()
        });
    });

    // Function to load reported issues (this will be implemented in the backend)
    function loadReportedIssues(selectedOfficeArea) {
        $.get('/get-reported-issues', { officeArea: selectedOfficeArea }, function (issues) {
            $('#reported-issues').show();
            $('#issue-list').empty();
            
            if (issues.length > 0) {
               $('#reported-issues h2').html(`Thank you for your feedback! <br> We are also working on the following issues reported to us in the same area.`);
               
               issues.forEach(issue => {
                const formattedDate = formatDate(issue.createdAt);
                $('#issue-list').append(`<li class="list-group-item">${issue.officeArea} - ${issue.facility} <small style="color: blue;">${formattedDate}</small> <br> <i> ${issue.comments}</i> </li>`);
                });
            } else {
                $('#reported-issues h2').text('Thank you for your feedback! There are no other issues reported in this area.');
            }
            console.log('Reported issues loaded:', issues);
        });
    }

    // function to convert date format 
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }



    
});


