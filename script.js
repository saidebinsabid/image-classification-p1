// ======================================================================
// STEP 1: FIND HTML ELEMENTS
// We are finding the parts of our webpage (HTML) so we can control them with JavaScript.
// We save them in variables (like a storage box) so we can use them later.
// ======================================================================
const camera = document.getElementById("camera"); // The box where the webcam video will show
const result = document.getElementById("result"); // The box where the captured photo will show
const resultContainer = document.getElementById("result-container"); // The box that will show the final AI answer
const identifyBtn = document.getElementById("identify-btn"); // The "Identify Image" button
const modelStatus = document.getElementById("model-status"); // The text that says if the AI model is ready

// ======================================================================
// STEP 2: SETUP THE WEBCAM
// We use a tool called Webcam.js to easily turn on the user's camera.
// ======================================================================
Webcam.set({
    width: 350,          // How wide the camera video should be
    height: 280,         // How tall the camera video should be
    image_format: 'png', // Save the picture as a PNG image file
    png_quality: 90      // How clear the picture should be (0 is bad, 100 is best)
});

// Turn on the camera and connect it to the HTML element with id="camera"
Webcam.attach('#camera');

// ======================================================================
// STEP 3: FUNCTION TO TAKE A PICTURE
// This function runs when the user clicks the "Capture Image" button.
// ======================================================================
function take_snapshot() {
    Webcam.snap(function (data_uri) {
        // 'data_uri' is the picture we just took from the camera.
        // We create an HTML <img> tag using our new picture and put it on the screen.
        result.innerHTML = '<img id="selfie_image" src="' + data_uri + '"/>';
    });
}

// ======================================================================
// STEP 4: LOAD THE AI MODEL
// We use a tool called 'ml5.js' to load our AI model from Teachable Machine.
// ======================================================================
// It takes a little time to load, so we tell it to run the 'modelLoaded' function when it finishes.
let classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/v_sl95BzE/model.json', modelLoaded);

// This function runs automatically as soon as the AI model is fully loaded and ready to use.
function modelLoaded() {
    console.log('Model Loaded!'); // Print a message in the secret developer console

    identifyBtn.disabled = false; // The button was locked, now we unlock it so the user can click it

    // Change the text on the screen to show a checkmark and "Model Ready"
    modelStatus.innerHTML = '<i class="fa-solid fa-check-circle"></i> Model Ready';
    modelStatus.className = 'model-status success'; // Change the color to green (success)
}

// ======================================================================
// STEP 5: FUNCTION TO IDENTIFY THE PICTURE
// This function runs when the user clicks the "Identify Image" button.
// ======================================================================
function check() {
    // First, let's find the picture we just took
    const img = document.getElementById('selfie_image');

    // If we haven't taken a picture yet, 'img' will be empty.
    if (!img) {
        alert("Please capture an image first."); // Show a warning message
        return; // Stop doing anything else in this function
    }

    // We change the button text so the user knows the AI is "Thinking..."
    const originalBtnContent = identifyBtn.innerHTML; // Save the old text just in case
    identifyBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Analyzing...';
    identifyBtn.disabled = true; // Lock the button so they don't click it twice quickly

    // We ask the AI to classify (guess) what is in the picture.
    // When it finishes guessing, it will run the code inside function(error, results).
    classifier.classify(img, function (error, results) {

        // The AI is done! Let's put the button back to normal.
        identifyBtn.innerHTML = originalBtnContent;
        identifyBtn.disabled = false;

        // Send the AI's answer to our final function to show it on the screen
        gotResult(error, results);
    });
}

// ======================================================================
// STEP 6: FUNCTION TO SHOW THE AI'S ANSWER
// This function gets the final answer (results) or an error if something broke.
// ======================================================================
function gotResult(error, results) {
    // If the AI had a problem, 'error' will have some text.
    if (error) {
        console.error(error); // Print the error in the developer console
        alert("An error occurred during classification."); // Tell the user something went wrong
    }
    // If there is no error, it means the AI guessed successfully!
    else {
        console.log(results); // Print the full answer in the developer console to look at it

        // Show the result box on the screen (by removing the 'hidden' class)
        resultContainer.classList.remove('hidden');

        // This is a small trick to make the result box animate softly onto the screen
        resultContainer.style.animation = 'none';
        resultContainer.offsetHeight; // This makes the browser quickly refresh the box
        resultContainer.style.animation = null;
        resultContainer.classList.add('fade-in');

        // Find the HTML elements where we will write the Object Name and Accuracy
        const resultObjectName = document.getElementById("result_object_name");
        const resultObjectAccuracy = document.getElementById("result_object_accuracy");

        // The AI gives us a list of guesses. results[0] is the best guess.
        // Let's get the name of the object (like "dog", "phone").
        const rawLabel = results[0].label;

        // We want to make the first letter a capital letter (like "Dog" instead of "dog")
        const formattedLabel = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);

        // Write the name into our HTML element
        resultObjectName.innerText = formattedLabel;

        // The AI also tells us how confident it is, between 0.00 and 1.00.
        // We multiply by 100 to get a percentage (like 98.5%) and keep 1 decimal place.
        const accuracyPercent = (results[0].confidence * 100).toFixed(1);

        // Write the percentage into our HTML element
        resultObjectAccuracy.innerText = accuracyPercent;
    }
}