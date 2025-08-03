document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const scanButton = document.getElementById('scanPage');
    const ecoScoreElement = document.getElementById('ecoScore');
    const ecoMessageElement = document.getElementById('ecoMessage');
    const suggestionsList = document.getElementById('suggestionsList');
    const certificationsList = document.getElementById('certificationsList');
    const carbonFootprintEl = document.getElementById('carbonFootprint');
    const waterUsageEl = document.getElementById('waterUsage');
    const recyclabilityEl = document.getElementById('recyclability');

    // Sample data (in a real app, this would come from an API)
    const sustainabilityData = {
        score: 0,
        carbonFootprint: 0, // kg CO2e
        waterUsage: 0,      // liters
        recyclability: 0,   // %
        materials: [],
        certifications: []
    };


    // Default suggestions and tips
    const suggestions = {
        packaging: 'Choose products with minimal or recyclable packaging',
        materials: 'Look for products made with sustainable materials',
        local: 'Buy local to reduce transportation emissions',
        energy: 'Choose energy-efficient products',
        durability: 'Select durable products that last longer',
        repair: 'Consider repairability when purchasing',
        secondhand: 'Check for secondhand or refurbished options',
        water: 'Choose products with lower water footprint',
        organic: 'Look for organic or eco-certified products',
        vegan: 'Consider vegan/cruelty-free options'
    };

    const certifications = [
        { name: 'Energy Star', icon: 'bolt' },
        { name: 'USDA Organic', icon: 'leaf' },
        { name: 'Fair Trade', icon: 'hands-helping' },
        { name: 'FSC Certified', icon: 'tree' },
        { name: 'Cradle to Cradle', icon: 'recycle' },
        { name: 'EU Ecolabel', icon: 'star' }
    ];


                name: 'Organic Cotton T-Shirt',
                brand: 'Pact',
                score: 90,
                price: '$24.00',
                image: 'https://via.placeholder.com/80?text=T-Shirt',
                reason: 'GOTS certified organic cotton, fair trade',
                type: 'clothing',
                link: 'https://wearpact.com/'
            },
            {
                name: 'Recycled Cotton Tee',
                brand: 'Patagonia',
                score: 88,
                price: '$35.00',
                image: 'https://via.placeholder.com/80?text=Recycled+Tee',
                reason: 'Made with 100% recycled materials',
                type: 'clothing',
                link: 'https://www.patagonia.com/'
            }
        ],
        // Laptops
        'laptop': [
            {
                name: 'EcoBook Pro',
                brand: 'GreenTech',
                score: 88,
                price: '$899.99',
                image: 'https://via.placeholder.com/80?text=Laptop',
                reason: 'Energy Star certified, made with 30% recycled materials',
                type: 'electronics',
                link: '#'
            },
            {
                name: 'SolarBook Air',
                brand: 'EcoComputing',
                score: 92,
                price: '$1,199.99',
                image: 'https://via.placeholder.com/80?text=Laptop',
                reason: 'Solar-powered charging, fully recyclable aluminum body',
                type: 'electronics',
                link: '#'
            }
        ],
        // Phones
        'phone': [
            {
                name: 'FairPhone 4',
                brand: 'FairPhone',
                score: 90,
                price: '$699.99',
                image: 'https://via.placeholder.com/80?text=Phone',
                reason: 'Fair trade certified, conflict-free minerals',
                type: 'electronics',
                link: 'https://www.fairphone.com/'
            },
            {
                name: 'EcoPhone X',
                brand: 'GreenMobile',
                score: 85,
                price: '$649.99',
                image: 'https://via.placeholder.com/80?text=Phone',
                reason: 'Modular design for easy repair, made with recycled materials',
                type: 'electronics',
                link: '#'
            }
        ],
        // Shoes
        'shoes': [
            {
                name: 'Eco Runners',
                brand: 'Allbirds',
                score: 89,
                price: '$110.00',
                image: 'https://via.placeholder.com/80?text=Shoes',
                reason: 'Made with natural and recycled materials',
                type: 'footwear',
                link: 'https://www.allbirds.com/'
            },
            {
                name: 'Recycled Sneakers',
                brand: 'Veja',
                score: 91,
                price: '$150.00',
                image: 'https://via.placeholder.com/80?text=Sneakers',
                reason: 'Made with organic cotton and recycled plastic',
                type: 'footwear',
                link: 'https://www.veja-store.com/'
            }
        ],
        // Home & Kitchen
        'kitchen': [
            {
                name: 'Bamboo Utensil Set',
                brand: 'Simple Ecology',
                score: 95,
                price: '$24.99',
                image: 'https://via.placeholder.com/80?text=Utensils',
                reason: 'Compostable and biodegradable',
                type: 'home',
                link: '#'
            },
            {
                name: 'Glass Food Storage',
                brand: 'EcoJarz',
                score: 93,
                price: '$39.99',
                image: 'https://via.placeholder.com/80?text=Containers',
                reason: 'Reusable and plastic-free',
                type: 'home',
                link: '#'
            }
        ],
        // Default/fallback products
        'default': [
            {
                name: 'Organic Cotton T-Shirt',
                brand: 'Pact',
                score: 90,
                price: '$24.00',
                image: 'https://via.placeholder.com/80?text=T-Shirt',
                reason: 'GOTS certified organic cotton, fair trade',
                type: 'clothing',
                link: 'https://wearpact.com/'
            },
            {
                name: 'Bamboo Toothbrush',
                brand: 'Brush with Bamboo',
                score: 94,
                price: '$5.99',
                image: 'https://via.placeholder.com/80?text=Toothbrush',
                reason: 'Biodegradable bamboo handle',
                type: 'personal-care',
                link: '#'
            }
        ]
    };
    

        // Electronics
        'laptop': {
            keywords: ['laptop', 'notebook', 'macbook', 'ultrabook', 'chromebook', 'thinkpad'],
            type: 'electronics'
        },
        'phone': {
            keywords: ['smartphone', 'iphone', 'samsung galaxy', 'pixel', 'mobile phone', 'android phone'],
            type: 'electronics'
        },
        'tablet': {
            keywords: ['tablet', 'ipad', 'samsung tab', 'kindle', 'ereader'],
            type: 'electronics'
        },
        'headphones': {
            keywords: ['headphones', 'earbuds', 'earphones', 'airpods', 'wireless earbuds'],
            type: 'electronics'
        },
        'smartwatch': {
            keywords: ['smartwatch', 'apple watch', 'galaxy watch', 'fitbit', 'fitness tracker'],
            type: 'electronics'
        },
        
        // Clothing
        'tshirt': {
            keywords: ['t-shirt', 't shirt', 'tee', 'polo', 'tank top'],
            type: 'clothing'
        },
        'pants': {
            keywords: ['pants', 'jeans', 'trousers', 'leggings', 'chinos', 'khakis'],
            type: 'clothing'
        },
        'shoes': {
            keywords: ['shoes', 'sneakers', 'running shoes', 'boots', 'sandals', 'flip flops'],
            type: 'footwear'
        },
        
        // Default categories
        'default': {
            keywords: [],
            type: 'general'
        }
    };
    
    // Alternative products organized by type
    const alternativeProductsByType = {
        'laptop': [
            {
                name: 'Framework Laptop',
                brand: 'Framework',
                score: 92,
                price: '$999.00',
                image: 'https://via.placeholder.com/80?text=Framework',
                reason: 'Modular design for easy repair and upgrades, 50% recycled aluminum',
                type: 'electronics',
                link: 'https://frame.work/'
            },
            {
                name: 'Dell XPS 13',
                brand: 'Dell',
                score: 88,
                price: '$1,199.99',
                image: 'https://via.placeholder.com/80?text=Dell+XPS',
                reason: 'Eco-conscious design with recycled materials, energy efficient',
                type: 'electronics',
                link: 'https://www.dell.com/'
            }
        ],
        'phone': [
            {
                name: 'FairPhone 4',
                brand: 'FairPhone',
                score: 90,
                price: '$649.99',
                image: 'https://via.placeholder.com/80?text=FairPhone',
                reason: 'Modular design, fair trade materials, 5-year warranty',
                type: 'electronics',
                link: 'https://www.fairphone.com/'
            },
            {
                name: 'iPhone 14 (Refurbished)',
                brand: 'Apple',
                score: 85,
                price: '$599.00',
                image: 'https://via.placeholder.com/80?text=iPhone',
                reason: 'Refurbished to reduce e-waste, 100% recycled rare earth elements',
                type: 'electronics',
                link: 'https://www.apple.com/shop/refurbished'
            }
        ]
    };
    

        // Get page content for analysis
        const title = document.title.toLowerCase();
        const url = window.location.href.toLowerCase();
        const description = document.querySelector('meta[name="description"]')?.content?.toLowerCase() || '';
        const allText = `${title} ${description} ${url}`.toLowerCase();
        
        console.log('Analyzing page for product type...');
        console.log('Title:', title);
        console.log('URL:', url);
        
        // Track matches with their confidence scores
        const matches = [];
        
        // Check each product category
        for (const [category, data] of Object.entries(productCategoryMap)) {
            const keywords = data.keywords;
            let score = 0;
            
            // Check for exact matches in title (highest confidence)
            const titleMatch = keywords.some(keyword => 
                new RegExp(`\\b${keyword}\\b`, 'i').test(title)
            );
            
            // Check for exact matches in URL (high confidence)
            const urlMatch = keywords.some(keyword => 
                new RegExp(`\\b${keyword}\\b`, 'i').test(url)
            );
            
            // Check for partial matches (lower confidence)
            const partialMatch = keywords.some(keyword => 
                allText.includes(keyword)
            );
            
            // Calculate score
            if (titleMatch) score += 3;
            if (urlMatch) score += 2;
            if (partialMatch) score += 1;
            
            if (score > 0) {
                console.log(`Match found: ${category} (score: ${score})`);
                matches.push({ category, score, type: data.type });
            }
        }
        
        // Sort by score and return the best match
        if (matches.length > 0) {
            matches.sort((a, b) => b.score - a.score);
            const bestMatch = matches[0];
            console.log(`Best match: ${bestMatch.category} (${bestMatch.type}) with score ${bestMatch.score}`);
            return bestMatch.category; // Return the specific product type (e.g., 'laptop' not 'electronics')
        }
        
        console.log('No specific product type detected, using default');
        return 'default';
    }


        console.log('showAlternativeProducts called');
        const recommendationsContainer = document.getElementById('recommendations');
        if (!recommendationsContainer) {
            console.error('Recommendations container not found!');
            return;
        }
    
        // Always show recommendations for now (for testing)
        recommendationsContainer.style.display = 'block';
        const productsList = document.getElementById('alternativeProducts');
        if (!productsList) {
            console.error('Alternative products list not found!');
            return;
        }
        
        productsList.innerHTML = '';
        
        // Detect the current product type from the page
        const detectedType = detectProductType();
        console.log('Detected product type:', detectedType);
        
        // Get relevant products - first try exact match, then same category
        let relevantProducts = [];
        
        // Try to find exact match in alternativeProductsByType
        if (alternativeProductsByType[detectedType]) {
            relevantProducts = alternativeProductsByType[detectedType];
            console.log(`Found exact match for type: ${detectedType}`, relevantProducts);
        } 
        // If no exact match, try to find products of the same category
        else {
            const category = (productCategoryMap[detectedType] || {}).type || 'electronics';
            console.log(`No exact match, looking for products in category: ${category}`);
            
            // Find all products that match this category
            relevantProducts = Object.entries(alternativeProductsByType)
                .filter(([key, products]) => {
                    return products.some(p => p.type === category);
                })
                .flatMap(([key, products]) => products)
                .filter(p => p.type === category);
                
            console.log(`Found ${relevantProducts.length} products in category ${category}`, relevantProducts);
        }
        
        // If still no products, use default
        if (!relevantProducts || relevantProducts.length === 0) {
            console.log('No relevant products found, using default');
            relevantProducts = [
                {
                    name: 'Organic Cotton T-Shirt',
                    brand: 'Pact',
                    score: 90,
                    price: '$24.00',
                    image: 'https://via.placeholder.com/80?text=T-Shirt',
                    reason: 'GOTS certified organic cotton, fair trade',
                    type: 'clothing',
                    link: 'https://wearpact.com/'
                },
                {
                    name: 'Recycled Cotton Tee',
                    brand: 'Patagonia',
                    score: 88,
                    price: '$35.00',
                    image: 'https://via.placeholder.com/80?text=Recycled+Tee',
                    reason: 'Made with 100% recycled materials',
                    type: 'clothing',
                    link: 'https://www.patagonia.com/'
                }
            ];
        }
        
        // Show up to 3 relevant products
        relevantProducts.slice(0, 3).forEach(product => {
            const productEl = document.createElement('div');
            productEl.className = 'product-card';
            // Create a link element for the product
            const productLink = document.createElement('a');
            productLink.href = product.link || '#';
            productLink.target = '_blank';
            productLink.rel = 'noopener noreferrer';
            productLink.className = 'product-card';
            productLink.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="brand">${product.brand}</p>
                    <p class="reason">${product.reason}</p>
                    <div class="product-footer">
                        <span class="price">${product.price}</span>
                        <span class="score">Eco Score: ${product.score}</span>
                    </div>
                </div>
            `;
            productEl.appendChild(productLink);
            productsList.appendChild(productEl);
        });
        
        // Show the recommendations container
        if (recommendationsContainer) {
            recommendationsContainer.style.display = 'block';
        }
    }

    // Initialize the popup
    function init() {
        // Initialize with default data
        updateSustainabilityDisplay();
    }

    // Show loading state
    function showLoadingState(loading) {
        if (loading) {
            ecoScoreElement.textContent = '...';
            ecoScoreElement.classList.add('loading');
            ecoMessageElement.textContent = 'Analyzing product...';
        } else {
            ecoScoreElement.classList.remove('loading');
        }
    }

    // Display default suggestions
    function showDefaultSuggestions() {
        const suggestionsList = document.getElementById('suggestionsList');
        if (!suggestionsList) return;
        
        suggestionsList.innerHTML = '';
        const tips = [
            'Look for products with eco-certifications',
            'Consider the product\'s environmental impact',
            'Check for sustainable materials'
        ];
        
        tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            suggestionsList.appendChild(li);
        });
    }

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
