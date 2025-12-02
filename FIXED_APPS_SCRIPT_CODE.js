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
    
    // Get current timestamp
    const timestamp = new Date();
    
    // Parse the incoming data (handles URL-encoded POST data)
    let data = {};
    
    // Debug: Log what we're receiving
    Logger.log('e.postData:', e.postData);
    Logger.log('e.parameter:', e.parameter);
    
    // Check if data is in postData.contents (URL-encoded string from XMLHttpRequest)
    if (e.postData && e.postData.contents) {
      const contents = e.postData.contents;
      Logger.log('Contents:', contents);
      
      // Try to parse as JSON first
      try {
        data = JSON.parse(contents);
        Logger.log('Parsed as JSON:', data);
      } catch (jsonError) {
        // If not JSON, parse as URL-encoded string
        // Format: "name=value&email=value&phone=value"
        Logger.log('Parsing as URL-encoded');
        const params = contents.split('&');
        for (let i = 0; i < params.length; i++) {
          const pair = params[i].split('=');
          if (pair.length === 2) {
            const key = decodeURIComponent(pair[0].replace(/\+/g, ' '));
            const value = decodeURIComponent(pair[1].replace(/\+/g, ' '));
            data[key] = value;
          }
        }
        Logger.log('Parsed URL-encoded data:', data);
      }
    } 
    // Check if data is in parameter (for form submissions or GET)
    else if (e.parameter) {
      data = e.parameter;
      Logger.log('Using e.parameter:', data);
    }
    
    // Safety check: Make sure data is an object
    if (!data || typeof data !== 'object') {
      throw new Error('Failed to parse request data. Data: ' + JSON.stringify(data));
    }
    
    // Prepare the row data with safe defaults
    const phoneValue = (data.phone || '').toString();
    const phoneString = String(phoneValue);
    
    const row = [
      timestamp,
      data.name || '',
      data.email || '',
      phoneString,
      data.service || '',
      data.message || ''
    ];
    
    Logger.log('Row to append:', row);
    
    // Append the row to the sheet
    sheet.appendRow(row);
    
    // Optional: Format the phone column as text to prevent number conversion
    const lastRow = sheet.getLastRow();
    const phoneCell = sheet.getRange(lastRow, 4); // Column D (phone)
    phoneCell.setNumberFormat('@'); // Set as text format
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Data saved successfully'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log the full error for debugging
    Logger.log('Error details:', error.toString());
    Logger.log('Error stack:', error.stack);
    
    // Return error response with details
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false, 
        error: error.toString(),
        message: 'An error occurred while processing your request. Please check the Apps Script execution log for details.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional - for testing)
function test() {
  // Test with URL-encoded data (like what XMLHttpRequest sends)
  const testEvent = {
    postData: {
      contents: 'name=Test+User&email=test%40example.com&phone=1234567890&service=IT+Infrastructure&message=Test+message'
    }
  };
  
  doPost(testEvent);
}
