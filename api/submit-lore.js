exports.handler = async (event) => {
  // 1. Method Validation
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  try {
    // 2. Data Parsing
    const data = JSON.parse(event.body);

    // 3. Basic Validation
    if (!data.name || !data.email || !data.title || !data.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // 4. Success Response
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    // 5. Error Handling
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
      headers: { "Content-Type": "application/json" },
    };
  }
};

// NOTE: In production, we'd add:
// 1. Rate-limiting
// 2. Database persistence
// 3. Sanitization (e.g., prevent XSS)
