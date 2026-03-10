# VisionAI Framework - AI Image Recognition

## Project Description
VisionAI Framework is a web-based AI Image Recognition application that leverages machine learning to identify specific everyday objects through a live webcam feed. The application allows users to capture an image using their webcam and then uses a pre-trained AI model to classify the object in the image, providing the predicted object name along with its confidence level (accuracy percentage).

This project was built to recognize the following target objects with high accuracy:
- **Watch**
- **Spoon**
- **Mobile Phone**
- **Water Bottle**

## Technologies Used
- **Frontend Core:** HTML5, CSS3 (Custom CSS, no Bootstrap), JavaScript (ES6)
- **Webcam Access:** [Webcam.js (v1.0.26)](https://cdnjs.cloudflare.com/ajax/libs/webcamjs/1.0.26/webcam.min.js)
- **Machine Learning Library:** [ml5.js (v0.4.3)](https://unpkg.com/ml5@0.4.3/dist/ml5.min.js)
- **Pre-trained AI Model:** Google Teachable Machine
- **Typography & Icons:** Google Fonts (Poppins), FontAwesome (v6.4.0)

## Important Links
- **AI Model Link:** [Teachable Machine Model (`model.json`)](https://teachablemachine.withgoogle.com/models/v_sl95BzE/model.json)
- **ml5.js Library:** `https://unpkg.com/ml5@0.4.3/dist/ml5.min.js`
- **Webcam.js Library:** `https://cdnjs.cloudflare.com/ajax/libs/webcamjs/1.0.26/webcam.min.js`

## How It Works

1. **Webcam Initialization (`Webcam.js`)**
   When the application loads, `Webcam.js` requests access to the user's camera. It sets up a live video feed with specific dimensions (350x280) and attaches it to the `#camera` HTML element.

2. **Loading the AI Model (`ml5.js`)**
   Simultaneously, `ml5.js` loads the pre-trained image classification model from the Teachable Machine URL via `ml5.imageClassifier()`. While loading, the UI displays a "Loading AI Model..." status. Once fully loaded, the `modelLoaded` callback function enables the "Identify Image" button and updates the status to "Model Ready."

3. **Capturing an Image**
   The user clicks the **"Capture Image"** button, triggering the `take_snapshot()` function. `Webcam.snap()` securely captures the current frame from the live feed and generates a `data_uri` (a base64 representation of the image). This image is temporarily displayed in the snapshot preview area.

4. **Image Identification**
   With an image captured, the user clicks the **"Identify Image"** button, calling the `check()` function. The application locks the button to prevent multiple submissions and passes the captured image to the AI model using `classifier.classify(img, callback)`.

5. **Displaying Results**
   The model processes the image and returns an array of sequential predictions. The application's `gotResult()` function extracts the most accurate result (the highest confidence guess). It formats the object's name (capitalizing the first letter) and converts the confidence score into a readable percentage. Finally, it smoothly fades in the result box on the UI, displaying the detected object and its confidence level to the user.
