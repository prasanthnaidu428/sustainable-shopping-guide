document.addEventListener('DOMContentLoaded', function () {
    const scanButton = document.getElementById('scanPage');
    const ecoScoreElement = document.getElementById('ecoScore');
    const ecoMessageElement = document.getElementById('ecoMessage');
    const suggestionsList = document.getElementById('suggestionsList');
    const carbonFootprintEl = document.getElementById('carbonFootprint');
    const waterUsageEl = document.getElementById('waterUsage');
    const recyclabilityEl = document.getElementById('recyclability');
    const productTypeElement = document.getElementById('productType');
    const materialsList = document.getElementById('materialsList');
    const loadingElement = document.getElementById('loading');
    const contentElement = document.getElementById('content');

    const database = {
        productCategoryMap: {
            'laptop': { keywords: ['laptop', 'notebook', 'macbook', 'ultrabook', 'chromebook'], type: 'electronics' },
            'phone': { keywords: ['smartphone', 'iphone', 'galaxy', 'pixel'], type: 'electronics' },
            'tshirt': { keywords: ['t-shirt', 'tee', 'polo'], type: 'clothing' },
            'shoes': { keywords: ['shoes', 'sneakers', 'boots', 'sandals'], type: 'footwear' },
            'default': { keywords: [], type: 'general' }
        },
        suggestions: {
            packaging: 'Choose products with minimal or recyclable packaging.',
            materials: 'Look for products made with sustainable materials like recycled content or organic fibers.',
            local: 'Buy local to reduce transportation emissions.',
            energy: 'Choose energy-efficient products with certifications like Energy Star.',
            durability: 'Select durable products that last longer to reduce waste.',
        },
        analysisData: {
            'laptop': { score: 75, carbon: 35, water: 1500, recyclability: 60, materials: ['Recycled Aluminum', 'Recycled Plastic'] },
            'phone': { score: 80, carbon: 25, water: 1200, recyclability: 70, materials: ['Recycled Glass', 'Conflict-free minerals'] },
            'tshirt': { score: 85, carbon: 5, water: 2700, recyclability: 90, materials: ['Organic Cotton'] },
            'shoes': { score: 82, carbon: 8, water: 3000, recyclability: 50, materials: ['Recycled Polyester', 'Natural Rubber'] },
            'default': { score: 60, carbon: 15, water: 1000, recyclability: 40, materials: ['Mixed Materials'] }
        }
    };

    function getPageDetails() {
        return {
            title: document.title,
            url: window.location.href,
            description: document.querySelector('meta[name="description"]')?.content || ''
        };
    }

    function detectProductType(pageDetails) {
        const text = `${pageDetails.title} ${pageDetails.description}`.toLowerCase();
        for (const [category, data] of Object.entries(database.productCategoryMap)) {
            if (data.keywords.some(keyword => text.includes(keyword))) {
                return category;
            }
        }
        return 'default';
    }

    function analyzeAndDisplay(pageDetails) {
        const productType = detectProductType(pageDetails);
        const data = database.analysisData[productType];

        productTypeElement.textContent = productType.charAt(0).toUpperCase() + productType.slice(1);
        ecoScoreElement.textContent = data.score;
        ecoMessageElement.textContent = getEcoMessage(data.score);
        carbonFootprintEl.textContent = `${data.carbon} kg`;
        waterUsageEl.textContent = `${data.water} L`;
        recyclabilityEl.textContent = `${data.recyclability}%`;

        materialsList.innerHTML = '';
        data.materials.forEach(material => {
            const li = document.createElement('li');
            li.textContent = material;
            materialsList.appendChild(li);
        });

        suggestionsList.innerHTML = '';
        const tip = document.createElement('li');
        tip.textContent = database.suggestions.materials;
        suggestionsList.appendChild(tip);
    // Display certifications
    function showCertifications() {
        certificationsList.innerHTML = '';
        
        // Get 2-4 random certifications
        const randomCerts = [...certifications]
            .sort(() => 0.5 - Math.random())
            .slice(0, 2 + Math.floor(Math.random() * 3));
        
        randomCerts.forEach(cert => {
            const item = document.createElement('div');
            item.className = 'certification-item';
            item.innerHTML = `<i class="fas fa-${cert.icon}"></i> ${cert.name}`;
            certificationsList.appendChild(item);
        });
    }

    // Analyze the current page
    async function analyzePage() {
        showLoadingState(true);
        
        try {
            // Get the active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            console.log('Active tab:', tab);
            
            if (!tab.id) {
                throw new Error('No active tab found');
            }
            
            // Inject content script if not already injected
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['js/content.js']
                });
                console.log('Content script injected successfully');
            } catch (injectError) {
                console.warn('Content script already injected or error injecting:', injectError);
            }
            
            // Send message to content script to analyze the page
            console.log('Sending analyzePage message to content script');
            const response = await chrome.tabs.sendMessage(tab.id, { 
                action: 'analyzePage',
                timestamp: new Date().toISOString()
            });
            
            console.log('Received response from content script:', response);
            
            if (response && !response.error) {
                // Store the product info for recommendations
                Object.assign(sustainabilityData, {
                    ...response,
                    productInfo: response.productInfo || { type: 'default' }
                });
                
                // Update the UI with the data
                updateSustainabilityDisplay();
            } else {
                console.warn('No valid response from content script, using mock data');
                if (response?.error) {
                    console.error('Content script error:', response.error);
                }
                useMockData();
            }
        } catch (error) {
            console.error('Error analyzing page:', error);
            // Show error message to user
            ecoScoreElement.textContent = 'Error';
            ecoMessageElement.textContent = 'Could not analyze this page. Please try refreshing the page or try a different page.';
            ecoMessageElement.style.color = '#dc3545';
            useMockData();
        } finally {
            showLoadingState(false);
        }
    }
    

        try {
            const url = window.location.href.toLowerCase();
            const title = document.title.toLowerCase();
            
            // Check URL patterns for different product categories
            if (url.includes('/dp/') || url.includes('/gp/product/')) {
                // Check for electronics
                if (url.includes('/electronics/') || 
                    url.includes('/computers/') || 
                    /\b(phone|tablet|laptop|computer|tv|headphones|speaker|camera)\b/.test(title)) {
                    return 'electronics';
                }
                // Check for clothing
                else if (url.includes('/fashion/') || 
                         /\b(shirt|pants|jeans|dress|shoes|sneakers|jacket|hat|socks|underwear)\b/.test(title)) {
                    return 'clothing';
                }
                // Check for home & kitchen
                else if (url.includes('/home-') || 
                         url.includes('/kitchen') ||
                         /\b(utensil|pan|pot|knife|appliance|furniture|bedding|towel|blanket)\b/.test(title)) {
                    return 'home';
                }
            }
        } catch (e) {
            console.error('Error detecting Amazon product type:', e);
        }
        return 'default';
    }

    // Fallback to mock data if content script fails
    function useMockData() {
        // Detect product type from Amazon page
        const productType = getAmazonProductType();
        
        // Update sustainability data with mock values
        Object.assign(sustainabilityData, {
            score: Math.floor(Math.random() * 100), // Random score for demo
            carbonFootprint: (Math.random() * 15).toFixed(1),
            waterUsage: Math.floor(Math.random() * 2000),
            recyclability: Math.floor(Math.random() * 100),
            materials: ['Cotton', 'Polyester', 'Elastane'],
            certifications: ['GOTS', 'Fair Trade'],
            productInfo: { 
                type: productType,
                title: document.title.replace(/\s*\|.*$/, '')
            }
        });
        
        updateSustainabilityDisplay();
    }

    // Update the sustainability display
    function updateSustainabilityDisplay() {
        const { score, carbonFootprint, waterUsage, recyclability } = sustainabilityData;
        
        // Update score
        ecoScoreElement.textContent = score;
        
        // Update metrics
        carbonFootprintEl.textContent = `${carbonFootprint} kg CO₂e`;
        waterUsageEl.textContent = `${waterUsage} L`;
        recyclabilityEl.textContent = `${recyclability}%`;
        
        // Update colors based on values
        updateMetricColor(ecoScoreElement, 50, 30);
        updateMetricColor(carbonFootprintEl, 5, 10, true); // Lower is better
        updateMetricColor(waterUsageEl, 500, 1000, true); // Lower is better
        updateMetricColor(recyclabilityEl, 50, 30); // Higher is better
        
        // Update message based on score
        if (score < 30) {
            ecoScoreElement.className = 'score-low';
            ecoMessageElement.textContent = 'Low sustainability score. Consider more eco-friendly alternatives.';
            showAlternativeProducts();
        } else if (score < 70) {
            ecoScoreElement.className = 'score-medium';
            ecoMessageElement.textContent = 'Moderate sustainability. There is room for improvement.';
            showAlternativeProducts();
        } else {
            ecoScoreElement.className = 'score-high';
            ecoMessageElement.textContent = 'Great choice! This product has good sustainability credentials.';
            const recommendations = document.getElementById('recommendations');
            if (recommendations) recommendations.style.display = 'none';
        }
    }
    
    // Helper function to update metric colors
    function updateMetricColor(element, warningThreshold, dangerThreshold, higherIsBetter = false) {
        const value = parseFloat(element.textContent);
        element.classList.remove('score-high', 'score-medium', 'score-low');
        
        if (higherIsBetter) {
            if (value >= dangerThreshold) element.classList.add('score-high');
            else if (value >= warningThreshold) element.classList.add('score-medium');
            else element.classList.add('score-low');
        } else {
            if (value <= warningThreshold) element.classList.add('score-high');
            else if (value <= dangerThreshold) element.classList.add('score-medium');
            else element.classList.add('score-low');
        }
    }

    // Event Listeners
    scanButton.addEventListener('click', analyzePage);
    
    document.getElementById('settingsLink').addEventListener('click', function(e) {
        e.preventDefault();
        chrome.runtime.openOptionsPage();
    });

    // Initialize the popup
    init();
});
