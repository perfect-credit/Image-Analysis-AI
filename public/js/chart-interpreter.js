class ChartInterpreter {
    constructor() {
        this.dragDropZone = document.getElementById('dragDropZone');
        this.fileInput = document.getElementById('fileInput');
        this.previewContainer = document.getElementById('previewContainer');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.uploadForm = document.getElementById('uploadForm');
        this.submitButton = document.getElementById('submit');
        this.resultsContainer = document.getElementById('results');
        this.interpretationSummary = [];

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Drag and drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dragDropZone.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            this.dragDropZone.addEventListener(eventName, this.highlight.bind(this), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.dragDropZone.addEventListener(eventName, this.unhighlight.bind(this), false);
        });

        this.dragDropZone.addEventListener('drop', this.handleDrop.bind(this), false);
        this.fileInput.addEventListener('change', (e) => this.previewFiles(e.target.files));
        this.uploadForm.addEventListener('submit', this.handleUpload.bind(this));
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight() {
        this.dragDropZone.classList.add('border-primary');
    }

    unhighlight() {
        this.dragDropZone.classList.remove('border-primary');
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.fileInput.files = files;
        this.previewFiles(files);
    }

    previewFiles(files) {
        this.previewContainer.innerHTML = '';
        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => this.createPreviewElement(e.target.result, file, index);
            reader.readAsDataURL(file);
        });
    }

    createPreviewElement(src, file, index) {
        const preview = document.createElement('div');
        preview.className = 'preview-item';
        preview.innerHTML = `
            <img src="${src}" alt="Preview ${index + 1}">
            <button type="button" class="remove-button">
                <i class="fas fa-times"></i>
            </button>
            <p class="text-center mt-2">${file.name}</p>
        `;
        
        preview.querySelector('.remove-button').addEventListener('click', () => {
            this.removeFile(preview, index);
        });

        this.previewContainer.appendChild(preview);
    }

    removeFile(preview, index) {
        preview.remove();
        const dt = new DataTransfer();
        const { files } = this.fileInput;
        for (let i = 0; i < files.length; i++) {
            if (i !== index) dt.items.add(files[i]);
        }
        this.fileInput.files = dt.files;
    }

    async handleUpload(e) {
        e.preventDefault();
        const formData = new FormData(this.uploadForm);

        this.submitButton.disabled = true;
        this.loadingSpinner.style.display = 'block';
        this.resultsContainer.innerHTML = '';

        try {
            const data = await this.uploadFiles(formData);
            if (data && data.length > 0) {
                await this.processResults(data);
            }
        } catch (error) {
            console.error('Error:', error);
            this.showError();
        } finally {
            this.submitButton.disabled = false;
            this.loadingSpinner.style.display = 'none';
        }
    }

    async uploadFiles(formData) {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        return await response.json();
    }

    async processResults(data) {
        this.interpretationSummary = [];
        const interpretations = [];
        const chartData = []; // Store chart data including base64 images
        
        // Show loading state
        this.loadingSpinner.style.display = 'block';
        
        // Collect all interpretations first
        for (let [index, element] of data.entries()) {
            const interpretData = await this.interpretImage(element.base64);
            interpretations.push(interpretData.original.message);
            chartData.push({
                base64: element.base64,
                interpretation: interpretData.original.message
            });
        }
        
        // Get and display final summary
        const finalSummary = await this.getFinalSummary(interpretations);
        this.displaySummary(finalSummary, chartData);
    }

    async interpretImage(base64Data) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const response = await fetch('/interpreter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify(base64Data),
        });
        return await response.json();
    }

    displaySummary(aiSummary, chartData) {
        const summaryCard = document.createElement('div');
        summaryCard.className = 'result-card summary-card';
        
        let summaryHtml = `
            <div class="row">
                <div class="col-12">
                    <h3 class="mb-4"><i class="fas fa-robot me-2"></i>Summary</h3>
                    
                    <div class="ai-summary">
                        ${this.formatMessage(aiSummary)}
                    </div>

                    <div class="text-actions mt-3">
                        <button class="btn btn-sm btn-outline-secondary copy-summary-btn">
                            <i class="fas fa-copy me-1"></i>Copy Summary
                        </button>
                        <button class="btn btn-sm btn-outline-primary show-details-btn">
                            <i class="fas fa-list-ul me-1"></i>Show Individual Analyses
                        </button>
                    </div>

                    <div class="individual-analyses mt-4" style="display: none;">
                        <h4 class="mb-3">Individual Chart Analyses</h4>
                        <div class="summary-content">
                            ${chartData.map((chart, index) => `
                                <div class="summary-item mb-4">
                                    <h5>Chart ${index + 1}</h5>
                                    <div class="row">
                                        <div class="col-md-5">
                                            <div class="chart-image-container">
                                                <img src="data:image/png;base64,${chart.base64}" 
                                                     class="img-fluid rounded" 
                                                     alt="Chart ${index + 1}">
                                            </div>
                                            <div class="image-actions mt-2">
                                                <button class="btn btn-sm btn-outline-primary download-btn" data-index="${index}">
                                                    <i class="fas fa-download me-1"></i>Download
                                                </button>
                                            </div>
                                        </div>
                                        <div class="col-md-7">
                                            <div class="interpretation-content">
                                                ${this.formatMessage(chart.interpretation)}
                                            </div>
                                            <div class="text-actions mt-2">
                                                <button class="btn btn-sm btn-outline-secondary copy-btn" data-index="${index}">
                                                    <i class="fas fa-copy me-1"></i>Copy Text
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        summaryCard.innerHTML = summaryHtml;

        // Add event listeners
        this.addSummaryEventListeners(summaryCard, aiSummary, chartData);

        this.resultsContainer.appendChild(summaryCard);
    }

    addSummaryEventListeners(summaryCard, aiSummary, chartData) {
        const copyBtn = summaryCard.querySelector('.copy-summary-btn');
        const showDetailsBtn = summaryCard.querySelector('.show-details-btn');
        const individualAnalyses = summaryCard.querySelector('.individual-analyses');

        // Main summary copy button
        copyBtn.addEventListener('click', () => {
            this.copyToClipboard(copyBtn, aiSummary);
        });

        // Show/Hide details button
        showDetailsBtn.addEventListener('click', () => {
            const isHidden = individualAnalyses.style.display === 'none';
            individualAnalyses.style.display = isHidden ? 'block' : 'none';
            showDetailsBtn.innerHTML = isHidden ? 
                '<i class="fas fa-chevron-up me-1"></i>Hide Individual Analyses' :
                '<i class="fas fa-list-ul me-1"></i>Show Individual Analyses';
        });

        // Individual chart download buttons
        summaryCard.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.dataset.index;
                this.downloadImage(chartData[index].base64, `chart-${parseInt(index) + 1}.png`);
            });
        });

        // Individual chart copy buttons
        summaryCard.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.dataset.index;
                this.copyToClipboard(btn, chartData[index].interpretation);
            });
        });
    }

    downloadImage(base64, fileName) {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${base64}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    copyToClipboard(button, text) {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text:', err);
        });
    }

    async getFinalSummary(interpretations) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        
        try {
            const response = await fetch('/interpreter/summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    interpretations: interpretations
                }),
            });
            const data = await response.json();
            return data.summary;
        } catch (error) {
            console.error('Error getting final summary:', error);
            return null;
        }
    }

    formatMessage(message) {
        if (!message) return 'No analysis available';
        return message.split('\n')
            .filter(para => para.trim())
            .map(para => `<p class="mb-2">${para}</p>`)
            .join('');
    }

    showError() {
        this.resultsContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                An error occurred while processing your request. Please try again.
            </div>
        `;
    }
} 