<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>AI Vision Interpreter - Chart Analysis</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('css/chart-interpreter.css') }}">
</head>
<body>
    <div class="main-container">
        <div class="upload-section">
            <h1 class="text-center mb-4">Chart Image Interpreter</h1>
            <form id="uploadForm" enctype="multipart/form-data">
                @csrf
                <div class="drag-drop-zone" id="dragDropZone">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <h3>Drag and drop your charts here</h3>
                    <p>or</p>
                    <input type="file" id="fileInput" multiple name="images[]" accept="image/*,application/pdf" class="d-none">
                    <button type="button" class="btn btn-outline-primary" onclick="document.getElementById('fileInput').click()">
                        Browse Files
                    </button>
                </div>
                
                <div class="preview-container" id="previewContainer"></div>

                <div class="text-center mt-4">
                    <button type="submit" id="submit" class="interpret-button">
                        <i class="fas fa-magic me-2"></i>Interpret Charts
                    </button>
                </div>
            </form>
        </div>

        <div class="loading-spinner" id="loadingSpinner">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Analyzing your charts...</p>
        </div>

        <div class="results-container" id="results"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/chart-interpreter.js') }}"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            new ChartInterpreter();
        });
    </script>
</body>
</html>
