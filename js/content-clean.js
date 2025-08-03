// EcoSmart - Minimal Content Script
(function() {
    'use strict';

    // Message listener for popup communication
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'analyzePage') {
            analyzePage().then(sendResponse).catch(console.error);
            return true;
        }
        return false;
    });

    // Enhanced sustainability keywords with impact scores
    const KEYWORDS = {
        // Strong positive (sustainable materials and practices)
        'fsc certified': 15, 'organic': 12, 'recycled': 12, 'biodegradable': 12,
        'sustainably sourced': 12, 'eco-friendly': 10, 'bamboo': 10, 
        'compostable': 10, 'vegan': 8, 'fair trade': 12, 'upcycled': 10,
        'reclaimed': 10, 'repurposed': 10, 'carbon neutral': 12,
        
        // Materials with positive impact
        'organic cotton': 10, 'hemp': 10, 'linen': 9, 'cork': 10,
        'wool': 8, 'silk': 7, 'leather': 6, 'wood': 8, 'bamboo': 10,
        'jute': 9, 'seagrass': 9, 'rattan': 8,
        
        // Negative impact (materials and practices)
        'plastic': -8, 'pvc': -10, 'synthetic': -7, 'single-use': -12,
        'polyester': -6, 'nylon': -6, 'acrylic': -7, 'rayon': -5,
        'fast fashion': -10, 'disposable': -10, 'non-recyclable': -10,
        
        // Product type specific
        'solid wood': 10, 'hardwood': 9, 'softwood': 8, 'plywood': 4,
        'mdf': -3, 'particle board': -5, 'veneer': 2, 'engineered wood': 3
    };

    // Enhanced material database with categories
    const MATERIALS = {
        // Sustainable natural materials
        natural: [
            'organic cotton', 'cotton', 'wool', 'silk', 'bamboo', 'hemp',
            'linen', 'leather', 'jute', 'cork', 'seagrass', 'rattan',
            'wood', 'hardwood', 'softwood', 'oak', 'maple', 'teak',
            'bamboo', 'coconut', 'cork', 'straw', 'sisal', 'ramie'
        ],
        
        // Recycled materials
        recycled: [
            'recycled polyester', 'recycled nylon', 'recycled cotton',
            'recycled plastic', 'recycled wood', 'recycled metal',
            'recycled glass', 'upcycled', 'reclaimed'
        ],
        
        // Synthetic materials (negative impact)
        synthetic: [
            'polyester', 'nylon', 'spandex', 'elastane', 'rayon',
            'viscose', 'acrylic', 'polyurethane', 'pvc', 'pleather',
            'faux leather', 'vinyl', 'polyethylene', 'polypropylene'
        ],
        
        // Wood products with different sustainability levels
        wood: [
            {name: 'solid wood', score: 10}, 
            {name: 'hardwood', score: 9}, 
            {name: 'softwood', score: 8},
            {name: 'plywood', score: 4}, 
            {name: 'mdf', score: -3}, 
            {name: 'particle board', score: -5},
            {name: 'engineered wood', score: 3}
        ]
    };

    // Enhanced product type detection
    function detectProductType(text) {
        const url = window.location.href.toLowerCase();
        const title = document.title.toLowerCase();
        
        // Check for wooden products first
        const woodKeywords = ['wood', 'oak', 'teak', 'maple', 'pine', 'cedar', 'walnut', 'cherry', 'mahogany', 'bamboo'];
        const isWoodenProduct = woodKeywords.some(kw => url.includes(kw) || title.includes(kw) || text.includes(kw));
        
        if (isWoodenProduct) {
            // Further categorize wood products
            if (text.includes('solid wood') || text.includes('hardwood')) return 'wood_furniture';
            if (text.includes('plywood') || text.includes('mdf') || text.includes('particle board')) return 'engineered_wood';
            return 'wood_product';
        }
        
        // Other product categories
        if (url.includes('furniture') || title.includes('furniture')) return 'furniture';
        if (url.includes('electronic') || title.includes('electronic')) return 'electronics';
        if (url.includes('cloth') || title.includes('shirt') || title.includes('pant')) return 'clothing';
        if (url.includes('shoe') || title.includes('shoe')) return 'footwear';
        
        return 'other';
    }
    
    // Enhanced material detection with scoring
    function findAndScoreMaterials(text) {
        const foundMaterials = [];
        let materialScore = 0;
        
        // Check for wood materials first
        MATERIALS.wood.forEach(wood => {
            if (text.includes(wood.name)) {
                foundMaterials.push({
                    name: wood.name,
                    type: 'wood',
                    score: wood.score,
                    isSustainable: wood.score >= 5
                });
                materialScore += wood.score;
            }
        });
        
        // Check for other materials if no wood found
        if (foundMaterials.length === 0) {
            // Check natural materials
            MATERIALS.natural.forEach(mat => {
                if (text.includes(mat) && !foundMaterials.some(m => m.name === mat)) {
                    foundMaterials.push({
                        name: mat,
                        type: 'natural',
                        score: 8,
                        isSustainable: true
                    });
                    materialScore += 8;
                }
            });
            
            // Check recycled materials
            MATERIALS.recycled.forEach(mat => {
                if (text.includes(mat) && !foundMaterials.some(m => m.name === mat)) {
                    foundMaterials.push({
                        name: mat,
                        type: 'recycled',
                        score: 10,
                        isSustainable: true
                    });
                    materialScore += 10;
                }
            });
            
            // Check synthetic materials
            MATERIALS.synthetic.forEach(mat => {
                if (text.includes(mat) && !foundMaterials.some(m => m.name === mat)) {
                    foundMaterials.push({
                        name: mat,
                        type: 'synthetic',
                        score: -7,
                        isSustainable: false
                    });
                    materialScore -= 7;
                }
            });
        }
        
        return { materials: foundMaterials, materialScore };
    }
    
    // Main analysis function
    async function analyzePage() {
        try {
            const text = getPageText().toLowerCase();
            const productType = detectProductType(text);
            const { materials, materialScore } = findAndScoreMaterials(text);
            const keywordScore = calculateKeywordScore(text);
            
            // Calculate base score (50% materials, 30% keywords, 20% product type)
            let score = 50; // Base score
            score += (materialScore * 0.5);
            score += (keywordScore * 0.3);
            
            // Adjust based on product type
            const typeAdjustments = {
                'wood_furniture': 15,    // Highest for solid wood furniture
                'wood_product': 10,      // Other wood products
                'furniture': 5,          // Non-wood furniture
                'electronics': -10,       // Generally less sustainable
                'clothing': 0,
                'footwear': -5,
                'engineered_wood': -5,   // Lower score for MDF/particle board
                'other': 0
            };
            
            score += typeAdjustments[productType] || 0;
            
            // Ensure score is within bounds
            score = Math.max(0, Math.min(100, Math.round(score)));
            
            // Prepare response
            const response = {
                score: score,
                carbonFootprint: calculateCarbonFootprint(materials, score, productType),
                waterUsage: calculateWaterUsage(materials, score, productType),
                recyclability: calculateRecyclability(materials, score, productType),
                materials: materials.map(m => m.name),
                productInfo: {
                    title: (document.title || '').replace(/\s*[\|\-\:].*$/, '').trim(),
                    url: window.location.href,
                    type: productType.replace('_', ' ')
                }
            };
            
            console.log('Analysis complete:', response);
            return response;
            
        } catch (error) {
            console.error('Error in analyzePage:', error);
            return {
                score: 0,
                carbonFootprint: 'N/A',
                waterUsage: 'N/A',
                recyclability: 'N/A',
                materials: [],
                productInfo: {
                    title: 'Error',
                    url: window.location.href,
                    type: 'error'
                },
                error: error.message
            };
        }
    }


    // Helper functions
    function getPageText() {
        const desc = document.querySelector('[id*="description"], [class*="description"]');
        return (desc?.innerText || document.body.innerText).toLowerCase();
    }

    function calculateKeywordScore(text) {
        let score = 0;
        
        // Check for positive and negative keywords
        Object.entries(KEYWORDS).forEach(([keyword, points]) => {
            if (text.includes(keyword)) {
                // For wood products, give more weight to wood-specific terms
                if (keyword.includes('wood') || keyword.includes('oak') || keyword.includes('teak') || 
                    keyword.includes('maple') || keyword.includes('bamboo')) {
                    score += points * 1.5;
                } else {
                    score += points;
                }
            }
        });
        
        // Check for certifications and standards
        const certifications = [
            'fsc certified', 'pefc', 'greenguard', 'cradle to cradle',
            'energy star', 'usda organic', 'gots', 'bluesign', 'oeko-tex'
        ];
        
        certifications.forEach(cert => {
            if (text.includes(cert)) score += 10;
        });
        
        return score;
    }

    function detectProductType() {
        const url = window.location.href.toLowerCase();
        const title = document.title.toLowerCase();
        
        if (url.includes('shirt') || title.includes('shirt')) return 'clothing';
        if (url.includes('pant') || title.includes('pant')) return 'clothing';
        if (url.includes('shoe') || title.includes('shoe')) return 'footwear';
        if (url.includes('electronic') || title.includes('electronic')) return 'electronics';
        
        return 'product';
    }

    function findMaterials(text) {
        return MATERIALS.filter(mat => text.includes(mat));
    }

    function calculateCarbonFootprint(materials, score, productType) {
        // Base carbon footprint by product type (kg CO2e)
        const baseFootprints = {
            'furniture': 50,
            'electronics': 100,
            'clothing': 15,
            'footwear': 20,
            'home': 30,
            'accessories': 10,
            'other': 25
        };
        
        let footprint = baseFootprints[productType] || 25;
        
        // Adjust based on materials
        materials.forEach(material => {
            if (material.type === 'recycled') footprint *= 0.7; // 30% reduction for recycled
            if (material.type === 'synthetic') footprint *= 1.3; // 30% increase for synthetic
            if (material.name.includes('bamboo')) footprint *= 0.6; // 40% reduction for bamboo
            if (material.name.includes('solid wood')) footprint *= 0.8; // 20% reduction for solid wood
        });
        
        // Adjust based on score (better score = lower footprint)
        const scoreFactor = 1 - (score / 200); // 50% reduction at score 100
        footprint = Math.max(1, Math.round(footprint * scoreFactor));
        
        return `${Math.round(footprint)} kg CO2e`;
    }

    function calculateWaterUsage(materials, score, productType) {
        // Base water usage by product type (liters)
        const baseWaterUsage = {
            'furniture': 500,
            'electronics': 1000, // For manufacturing
            'clothing': 2500,
            'footwear': 2000,
            'home': 1500,
            'accessories': 500,
            'other': 1000
        };
        
        let water = baseWaterUsage[productType] || 1000;
        
        // Adjust based on materials
        materials.forEach(material => {
            if (material.name.includes('cotton') && !material.name.includes('organic')) water += 2000;
            if (material.name.includes('organic cotton')) water += 1000;
            if (material.name.includes('bamboo')) water *= 0.2; // 80% less water than cotton
            if (material.name.includes('linen') || material.name.includes('hemp')) water *= 0.3;
            if (material.type === 'synthetic') water *= 0.1; // Synthetics use much less water
        });
        
        // Adjust based on score (better score = lower water usage)
        const scoreFactor = 1 - (score / 200); // 50% reduction at score 100
        water = Math.max(10, Math.round(water * scoreFactor));
        
        // Format based on magnitude
        if (water >= 1000) {
            return `${(water / 1000).toFixed(1)}k L`;
        }
        return `${water} L`;
    }

    function calculateRecyclability(materials, score, productType) {
        // Base recyclability by product type (%)
        const baseRecyclability = {
            'furniture': 40,
            'electronics': 20, // Lower due to complex materials
            'clothing': 15,
            'footwear': 10,
            'home': 30,
            'accessories': 25,
            'other': 20
        };
        
        let recyclability = baseRecyclability[productType] || 30;
        
        // Adjust based on materials
        materials.forEach(material => {
            if (material.type === 'recycled') recyclability += 20;
            if (material.type === 'natural') recyclability += 10;
            if (material.type === 'synthetic') recyclability -= 15;
            if (material.name.includes('bamboo') || material.name.includes('wood')) recyclability += 15;
            if (material.name.includes('mixed') || material.name.includes('blend')) recyclability -= 10;
        });
        
        // Adjust based on score (better score = higher recyclability)
        const scoreFactor = score / 100;
        recyclability = Math.max(5, Math.min(95, Math.round(recyclability * (0.7 + scoreFactor * 0.3))));
        
        return `${recyclability}%`;
    }

    console.log('EcoSmart loaded');
})();
