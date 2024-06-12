const axios = require("axios");
const fs = require("fs").promises;

// Function to upload a course
async function uploadCourse(courseName) {
  try {
    const response = await axios.post("http://localhost:3000/api/courses", {
      name: courseName,
    });
    return response.data._id;
  } catch (error) {
    console.error(
      `Error uploading course ${courseName}:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

// Function to upload a subject
async function uploadSubject(courseId, subjectName) {
  try {
    await axios.post("http://localhost:3000/api/subjects", {
      courseId: courseId,
      name: subjectName,
    });
  } catch (error) {
    console.error(
      `Error uploading subject ${subjectName}:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

// Main function to read JSON and upload data
async function main() {
  try {
    // Read the JSON file
    const data = await fs.readFile("output.json", "utf8");
    const courses = JSON.parse(data);

    // Iterate over each course
    for (const [courseName, courseInfo] of Object.entries(courses)) {
      // Upload the course
      let courseId = '';
      try {
        courseId = await uploadCourse(courseName);
        console.log(`Course ${courseName} uploaded successfully.`);
      } catch (error) {
        console.log(`Error uploading course ${courseName}: ${error.message}`);
        continue;
      }

      // Iterate over each class (subject) and upload it
      for (const subjectName of courseInfo.classes) {
        try {
          await uploadSubject(courseId, subjectName);
          console.log(`> Subject ${subjectName} uploaded successfully.`);
        } catch (error) {
          console.log(
            `> Error uploading subject ${subjectName}: ${error.message}`
          );
          continue;
        }
      }
    }
    console.log("All courses and subjects uploaded successfully.");
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

// Execute the main function
main();
