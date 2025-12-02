// Handle GET requests (when someone visits the URL directly)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'Google Apps Script is running. Use POST to submit form data.',
      status: 'active'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle POST requests (form submissions)
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const timestamp = new Date();
    
    // Initialize data object
    let data = {};
    
    // Method 1: Check postData.contents (URL-encoded string from XMLHttpRequest)
    if (e.postData && e.postData.contents) {
      const contents = e.postData.contents;
      
      // Try JSON first
      try {
        data = JSON.parse(contents);
      } catch (jsonError) {
        // Parse as URL-encoded string: "name=value&email=value&phone=value"
        if (contents && contents.length > 0) {
          const params = contents.split('&');
          for (let i = 0; i < params.length; i++) {
            if (params[i]) {
              const pair = params[i].split('=');
              if (pair.length >= 2) {
                const key = decodeURIComponent(pair[0].replace(/\+/g, ' '));
                const value = decodeURIComponent(pair.slice(1).join('=').replace(/\+/g, ' '));
                data[key] = value;
              }
            }
          }
        }
      }
    }
    
    // Method 2: Check e.parameter (for form submissions)
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      // Merge with existing data, parameter takes precedence
      data = Object.assign(data, e.parameter);
    }
    
    // Final safety check - ensure data is an object with at least some content
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      // Return detailed error for debugging
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'No data received',
          debug: {
            hasPostData: !!e.postData,
            hasContents: !!(e.postData && e.postData.contents),
            hasParameter: !!e.parameter,
            postDataContents: e.postData ? e.postData.contents : null
          }
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Extract values with safe defaults
    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const phone = String(data.phone || '').trim();
    const service = String(data.service || '').trim();
    const message = String(data.message || '').trim();
    
    // Prepare the row data
    const row = [
      timestamp,
      name,
      email,
      phone,
      service,
      message
    ];
    
    // Append the row to the sheet
    sheet.appendRow(row);
    
    // Format the phone column as text to prevent number conversion
    const lastRow = sheet.getLastRow();
    if (lastRow > 0) {
      const phoneCell = sheet.getRange(lastRow, 4); // Column D (phone)
      phoneCell.setNumberFormat('@'); // Set as text format
    }
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data saved successfully',
        saved: { name: name, email: email, phone: phone, service: service }
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return detailed error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        stack: error.stack,
        message: 'An error occurred while processing your request.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

