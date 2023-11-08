// Select DOM elements
const passwordInput = document.querySelector("#password");
const copyButton = document.querySelector("#copy-btn");
const generateButton = document.querySelector("#generate-btn");
const passwordLengthSlider = document.querySelector("#slider");
const characterSetCheckboxes = document.querySelectorAll(".checklist");
const errorModal = document.querySelector(".modal");
let generatedPassword = "";

// Function to update the displayed password length
const updatePasswordLength = () => {
    passwordLengthSlider.oninput = () => {
        // Update the displayed character count based on the slider value
        document.querySelector("#character-count").textContent = passwordLengthSlider.value;
        // Adjust the width of the slider bar to represent the selected length
        passwordLengthSlider.style.setProperty('--slider-width', `${(passwordLengthSlider.value / 20) * 100}%`);
    };
};

// Function to toggle checkbox selection on field click
const toggleCheckboxSelection = () => {
    characterSetCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("click", () => {
            // Toggle the 'selected' class on the checkbox and checked icon
            checkbox.querySelector(".checkbox").classList.toggle("selected");
            checkbox.querySelector("img").classList.toggle("checked");
        });
    });
};

// Function to copy the generated password to clipboard
const copyToClipboard = () => {
    copyButton.addEventListener("click", async () => {
        if (passwordInput.value !== "") {
            try {
                // Copy the password to the clipboard
                await navigator.clipboard.writeText(passwordInput.value);
                // Display a success message in the modal
                showSuccessModal("Copied Successfully!");
            } catch (error) {
                // Display an error message in the modal in case of a clipboard error
                showErrorModal("Failed to copy password.");
            }
        }
    });
};

// Function to generate a password
const generatePassword = () => {
    const passwordLength = parseInt(document.querySelector("#character-count").textContent);
    const selectedCharacterSetCheckboxes = document.querySelectorAll(".checkbox.selected");
    generatedPassword = "";

    // Check for valid input
    if (selectedCharacterSetCheckboxes.length === 0 || passwordLength === 0) {
        // Display an error message in the modal for invalid input
        showErrorModal("Please select at least one option and a valid password length.");
        return;
    }

    const characterSets = {
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789",
        symbols: ".`-=~!@#$[]{}|;:'><?/%^&*()\"_+"
    };

    for (let i = 0; i < passwordLength; i++) {
        const randomCheckbox = selectedCharacterSetCheckboxes[Math.floor(Math.random() * selectedCharacterSetCheckboxes.length)];
        const characterSet = characterSets[randomCheckbox.parentElement.id];
        const randomCharacter = characterSet.charAt(Math.floor(Math.random() * characterSet.length));
        generatedPassword += randomCharacter;
    }
};

// Function to check password strength
const checkPasswordStrength = () => {
    if (passwordInput.value !== "") {
        const selectedCharacterSetCheckboxes = document.querySelectorAll(".checkbox.selected");
        const strengthLevels = document.querySelectorAll(".strength-level div");
        const levels = ["too weak", "weak", "medium", "strong"];

        strengthLevels.forEach((strengthLevel, index) => {
            if ((selectedCharacterSetCheckboxes.length == 1 && index == 0) ||
                (selectedCharacterSetCheckboxes.length == 2 && index <= 1) ||
                (selectedCharacterSetCheckboxes.length == 3 && index <= 2) ||
                (selectedCharacterSetCheckboxes.length == 4 && index <= 3)) {

                strengthLevel.style.backgroundColor = "var(--Strength-Color)";
                strengthLevel.style.border = "none";
                document.querySelector(".strength span").textContent = levels[selectedCharacterSetCheckboxes.length - 1];

            } else {
                strengthLevel.style.backgroundColor = "transparent";
                strengthLevel.style.border = " 2px solid var(--Text-Color)";
            }
        });
    }
};


// Function to show success modal
const showSuccessModal = (message) => {
    errorModal.style.top = "20%";
    errorModal.querySelector("p").innerHTML = message;
    errorModal.querySelector("button").style.display = "none";
    document.querySelector("section.fields").style.pointerEvents = "none";
    setTimeout(() => {
        hideModal();
    }, 2000);
};

// Function to show error modal
const showErrorModal = (message) => {
    errorModal.style.top = "50%";
    errorModal.querySelector("p").innerHTML = `<span>Oops!</span> ${message}`;
    errorModal.querySelector("button").innerHTML = `
    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
        <path fill="#24232C" d="m5.106 12 6-6-6-6-1.265 1.265 3.841 3.84H.001v1.79h7.681l-3.841 3.84z" />
    </svg>`;
    document.querySelector("section.fields").style.pointerEvents = "none";
};

// Function to hide the modal and re-enable field interaction
const hideModal = () => {
    errorModal.style.top = "-50%";
    errorModal.querySelector("button").style.display = "block";
    document.querySelector("section.fields").style.pointerEvents = "all";
};

// Initialize event listeners and functions
updatePasswordLength();
toggleCheckboxSelection();
generateButton.addEventListener("click", () => {
    generatePassword();
    passwordInput.value = generatedPassword;
    checkPasswordStrength();
});
copyToClipboard();
errorModal.querySelector("button").addEventListener("click", hideModal);
