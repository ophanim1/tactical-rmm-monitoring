from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
import requests

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

def load_config():
    """Load configuration from file or create from template if it doesn't exist."""
    if not os.path.exists('config.json'):
        if not os.path.exists('config.template.json'):
            raise FileNotFoundError("Neither config.json nor config.template.json found!")
        
        print("Warning: config.json not found. Creating from template...")
        with open('config.template.json', 'r') as template_file:
            with open('config.json', 'w') as config_file:
                config_file.write(template_file.read())
        print("Created config.json from template. Please update it with your actual configuration.")
    
    with open('config.json', 'r') as f:
        return json.load(f)

# Load configuration
config = load_config()

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/api/status')
def get_status():
    try:
        response = requests.get(
            config['api_url'],
            headers=config['headers'],
            timeout=10
        )
        response.raise_for_status()  # Raise an exception for bad status codes
        return jsonify(response.json())
    except requests.RequestException as e:
        return jsonify({
            'error': 'Failed to fetch data from API',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0') 