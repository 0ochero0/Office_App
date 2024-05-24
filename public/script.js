$(document).ready(function () {
    // Word count limit
    const wordLimit = 50;

    $('input[name="office-area"]').on('change', function () {
        // Declare a const to save the selected office area
        const selectedOfficeArea = $('input[name="office-area"]:checked').val();
        document.getElementById('displayOfficeArea').textContent = selectedOfficeArea || 'Not selected';
        // Show the facility section
        $('#facility-section').show();
        $('#readback').show();


    });

    // Show comment section when a facility is selected
    $('input[name="facility"]').on('change', function () {
        const selectedFacility = $('input[name="facility"]:checked').val();
        document.getElementById('displayFacility').textContent = selectedFacility || 'Not selected';
        $('#office-area-section').animate({ opacity: 0.5 });
        $('#comment-section').show();
        console.log('Facility selected:', $('input[name="facility"]:checked').val());
    });

    // Restrict word count in comments
    $('#comments').on('input', function () {
        let words = $(this).val().split(/\s+/);
        if (words.length > wordLimit) {
            $(this).val(words.slice(0, wordLimit).join(' '));
            $('#word-count-warning').text(`You can only enter up to ${wordLimit} words.`);
        } else {
            $('#word-count-warning').text(`Word count: ${words.length}/${wordLimit}`);
        }
    });

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
            $('#word-count-warning').text('');

            // Optionally, display reported issues (this will be implemented in the backend)
            loadReportedIssues();
        });
    });

    // Function to load reported issues (this will be implemented in the backend)
    function loadReportedIssues() {
        $.get('/get-reported-issues', function (issues) {
            $('#reported-issues').show();
            $('#issue-list').empty();
            issues.forEach(issue => {
                $('#issue-list').append(`<li class="list-group-item">${issue.officeArea} - ${issue.facility} <br> <i> ${issue.comments}</i> </li>`);
            });
            console.log('Reported issues loaded:', issues);
        });
    }
});
