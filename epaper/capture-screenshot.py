from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

def capture_screenshot(url, output_file):
    # Set up Chrome options for headless mode
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    chrome_options.add_argument("--disable-gpu")  # Disable GPU rendering
    chrome_options.add_argument("--no-sandbox")  # Required for some environments
    chrome_options.add_argument("--window-size=600x448")  # Set the window size to match the e-paper screen

    # Set up the Chrome driver
    service = Service("/usr/bin/chromedriver")  # Path to ChromeDriver
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        # Open the React app URL
        driver.get(url)

        # Find the element by its CSS selector
        element = driver.find_element(By.ID, 'main-container')

        # Take a screenshot and save it to the specified file
        element.screenshot(output_file)
        print(f"Screenshot saved to {output_file}")
    finally:
        # Close the browser
        driver.quit()

if __name__ == "__main__":
    # URL of the React app
    react_app_url = "http://192.168.1.82:8080"  # Replace with your React app's URL

    # Output file for the screenshot
    output_image = "react_app_screenshot.png"

    # Capture the screenshot
    capture_screenshot(react_app_url, output_image)
    # Resize screenshot