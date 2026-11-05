
async function testApplication() {
  const response = await fetch("http://127.0.0.1:3000/api/applications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      internship_id: 1,
      applicant_name: "Test Student",
      email: "teststudent@example.com",
      phone: "9876543210",
      resume_url: "https://example.com/resume.pdf",
      cover_letter: "I am interested in this frontend developer internship."
    })
  });

  const result = await response.json();

  console.log("HTTP Status:", response.status);
  console.log("API Response:");
  console.log(JSON.stringify(result, null, 2));
}

testApplication().catch(error => {
  console.error("Request failed:", error.message);
});
