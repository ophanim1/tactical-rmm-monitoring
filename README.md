# Tactical RMM Monitoring Dashboard

A proof-of-concept for a real-time web-based dashboard for monitoring Tactical RMM system metrics. This dashboard provides a clean and intuitive interface for viewing system status, resource usage, service health, and connection status.

## Features

- Real-time system metrics visualization
- Resource usage monitoring (Disk and Memory)
- Service status tracking
- Connection health monitoring
- Raw JSON data view
- Auto-refresh every 30 seconds

## Prerequisites

- Python 3.x
- Flask
- Access to a Tactical RMM instance ([How to create a Monitoring Endpoint API key](https://docs.tacticalrmm.com/tipsntricks/))

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ophanim1/tactical-rmm-monitoring
cd tactical-rmm-monitoring
```

2. Install required dependencies:
```bash
pip install -r requirements.txt
```

3. Create a configuration file:
```bash
cp config.example.json config.json
```

4. Configure your settings:
Edit `config.json` with your Tactical RMM instance details:
```json
{
    "api_url": "https://api.example.com/argument1/argument2",
    "headers": {
        "X-Mon-Token": "your-token-here"
    }
} 
```

5. Start the Flask application:
```bash
python app.py
```

The dashboard will be available at `http://localhost:5000`

## Security Considerations

⚠️ **Important: Before pushing to GitHub** ⚠️

1. Ensure `config.json` is in your `.gitignore` file
2. Never commit sensitive information such as:
   - API keys
   - Server URLs
   - Credentials
   - SSL certificates
   - Private IPs

3. Verify your `.gitignore` contains at least:
```
config.json
__pycache__/
*.pyc
.env
*.log
```

4. Use `config.example.json` as a template with dummy values for version control

## Configuration Template

Create a `config.example.json` file with the following structure:
```json
{
    "api_url": "https://api.example.com/argument1/argument2",
    "headers": {
        "X-Mon-Token": "your-token-here"
    }
} 
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your chosen license]

## Support

For issues and feature requests, please create an issue in the GitHub repository. 