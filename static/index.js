document.addEventListener('DOMContentLoaded', function () {
    let signup = document.querySelector(".signup");
    let login = document.querySelector(".login");
    let slider = document.querySelector(".slider");
    let formSection = document.querySelector(".form-section");

    signup.addEventListener("click", () => {
        // Add classes to trigger sliding effect for signup
        slider.classList.add("moveslider");
        formSection.classList.add("form-section-move");
    });

    login.addEventListener("click", () => {
        // Remove classes to reset sliding effect for login
        slider.classList.remove("moveslider");
        formSection.classList.remove("form-section-move");
    });

    const hiddenFrame = document.getElementById('hiddenFrame');
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('error-container');
    document.querySelector('.signup-box').appendChild(errorContainer);

    hiddenFrame.addEventListener('load', function () {
        const responseText = hiddenFrame.contentDocument.body.textContent.trim();

        if (responseText === 'Signup successful') {
            console.log('Signup successful');
        } else if (responseText.startsWith('{"error":')) {
            handleValidationError(responseText);
        } else {
            console.error('Unexpected error during signup:', responseText);
        }
    });

    function handleValidationError(responseText) {
        const responseJson = JSON.parse(responseText);
        const errorMessages = [];

        if (responseJson.error === 'Username already exists') {
            errorMessages.push('Username already exists');
            updateFieldStyling('.name', 'red');
        } else if (responseJson.error === 'All fields are required') {
            errorMessages.push('All fields are required');
            updateFieldStyling('.ele', 'red');
        } else {
            errorMessages.push(responseJson.error);
        }

        displayErrorMessages(errorMessages);
    }

    function displayErrorMessages(messages) {
        errorContainer.innerHTML = '';

        if (messages.length > 0) {
            const errorList = document.createElement('ul');
            messages.forEach(message => {
                const listItem = document.createElement('li');
                listItem.textContent = message;
                errorList.appendChild(listItem);
            });
            errorContainer.appendChild(errorList);
        }
    }

    function updateFieldStyling(selector, borderColor) {
        document.querySelectorAll(selector).forEach(element => {
            element.style.borderColor = borderColor;
        });
    }

    $('#signupForm').on('submit', function(e) {
        e.preventDefault();
        validateAndSubmitForm(this);
    });

    function validateAndSubmitForm(form) {
        let isValid = true;
        const errorMessages = [];

        form.querySelectorAll('.ele').forEach(input => {
            if (input.value === '') {
                isValid = false;
                input.classList.add('error');
                errorMessages.push(`${input.name} is required`);
            } else {
                input.classList.remove('error');
            }
        });

        const password = $('input[name="password"]').val();
        const confirmPassword = $('input[name="confirm_password"]').val();

        if (password !== confirmPassword) {
            isValid = false;
            updateFieldStyling('input[name="password"], input[name="confirm_password"]', 'red');
            errorMessages.push('Passwords do not match');
        } else {
            updateFieldStyling('input[name="password"], input[name="confirm_password"]', '');
        }

        if (isValid) {
            form.submit();
        } else {
            displayErrorMessages(errorMessages);
        }
    }
});
