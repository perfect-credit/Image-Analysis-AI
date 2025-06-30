# Image-Analysis-AI

A sophisticated web application that processes performance graph images using AI to generate comprehensive site performance reports. Built with PHP/Laravel and integrated with Large Language Models (LLM) for intelligent analysis.

## 🎯 Project Overview

The system enables users to:
- Upload multiple performance graph images simultaneously
- Process and analyze performance metrics from uploaded images
- Generate comprehensive performance reports using AI
- View and download detailed analysis results

## ✨ Key Features

### Upload Management
- Multi-file upload interface with drag-and-drop support
- Real-time upload progress indication
- Supported formats: PNG, JPG
- Batch processing capabilities
- File validation and security checks

### Performance Analysis
- Automated graph data extraction
- Performance metrics calculation
- Trend identification and analysis
- Comprehensive report generation

### AI-Powered Insights
- LLM integration for natural language processing
- Intelligent interpretation of performance trends
- Context-aware performance analysis
- Human-readable performance summaries

### User Interface
- Clean, intuitive design
- Real-time processing feedback
- Mobile-responsive layout
- Clear error handling and user guidance

## 🛠 Technical Stack

### Frontend
- HTML5/CSS3
- JavaScript (ES6+)
- Bootstrap 5
- AJAX for asynchronous uploads

### Backend
- PHP 8.1+
- Laravel Framework
- RESTful API architecture
- Secure file handling system

### AI/LLM Integration
- Advanced language model integration
- Image processing pipeline
- Performance metric extraction
- Natural language report generation

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/performance-analysis-system.git

# Navigate to project directory
cd performance-analysis-system

# Install PHP dependencies
composer install

# Install frontend dependencies
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Set up storage symlink
php artisan storage:link

# Start the development server
php artisan serve
```

## Docker Setup

### Prerequisites
- Docker installed on your system

### Running with Docker

1. Build the Docker image:

```bash
docker build -t laravel-app .
```

2. Run the container:

```bash
docker run -p 8001:8001 laravel-app
```

The application will be available at `http://localhost:8001`

### Environment Configuration

Before running the container, make sure to:
1. Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration settings

### Development Tips

- To run in development mode with volume mounting (so your changes are reflected immediately):

```bash
docker run -p 8001:8001 -v $(pwd):/var/www/html laravel-app
```

- To access the container's shell:

```bash
docker exec -it [container_id] bash
```

### Troubleshooting

If you encounter permission issues:
1. Make sure storage and cache directories are writable
2. If needed, run these commands locally before building:

```bash
chmod -R 755 storage bootstrap/cache
```

## 🚀 Usage Guide

1. Access the application through your web browser
2. Click the upload button or drag-and-drop performance graph images
3. Wait for the processing to complete
4. View the generated performance report
5. Download or export results as needed


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
