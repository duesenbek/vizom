/**
 * ChartRecommender API Wrapper
 * Provides HTTP endpoints for chart type recommendations
 */

import { chartRecommender } from './ChartRecommender.js';

export class ChartRecommenderAPI {
  constructor() {
    this.endpoints = {
      recommend: '/api/recommend-chart',
      batch: '/api/recommend-batch',
      validate: '/api/validate-data'
    };
  }
  
  /**
   * Get chart recommendation for a single prompt
   */
  async recommend(prompt, data = null, options = {}) {
    try {
      const recommendation = chartRecommender.recommend(prompt, data);
      
      // Add metadata if requested
      if (options.includeMetadata) {
        recommendation.metadata = {
          prompt,
          dataPoints: data ? (Array.isArray(data) ? data.length : Object.keys(data).length) : 0,
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        };
      }
      
      return {
        success: true,
        data: recommendation
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: 'RECOMMENDATION_ERROR'
        }
      };
    }
  }
  
  /**
   * Get recommendations for multiple prompts
   */
  async batchRecommend(requests, options = {}) {
    try {
      const results = [];
      
      for (const request of requests) {
        const result = await this.recommend(
          request.prompt, 
          request.data, 
          options
        );
        
        results.push({
          id: request.id || results.length,
          ...result
        });
      }
      
      return {
        success: true,
        data: {
          results,
          total: results.length,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: 'BATCH_RECOMMENDATION_ERROR'
        }
      };
    }
  }
  
  /**
   * Validate data compatibility with chart type
   */
  async validateData(data, chartTypeId) {
    try {
      const { validateDataForChartType } = await import('./chart-types.js');
      const validation = validateDataForChartType(data, chartTypeId);
      
      return {
        success: true,
        data: {
          valid: validation.valid,
          errors: validation.errors,
          chartTypeId,
          dataPoints: Array.isArray(data) ? data.length : 0,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: 'VALIDATION_ERROR'
        }
      };
    }
  }
  
  /**
   * Express.js route handlers
   */
  getRoutes() {
    return {
      'POST /api/recommend-chart': async (req, res) => {
        try {
          const { prompt, data, options } = req.body;
          
          if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({
              success: false,
              error: { message: 'Prompt is required', code: 'INVALID_PROMPT' }
            });
          }
          
          const result = await this.recommend(prompt, data, options);
          
          if (result.success) {
            res.json(result);
          } else {
            res.status(500).json(result);
          }
        } catch (error) {
          res.status(500).json({
            success: false,
            error: { message: error.message, code: 'INTERNAL_ERROR' }
          });
        }
      },
      
      'POST /api/recommend-batch': async (req, res) => {
        try {
          const { requests, options } = req.body;
          
          if (!Array.isArray(requests)) {
            return res.status(400).json({
              success: false,
              error: { message: 'Requests array is required', code: 'INVALID_REQUESTS' }
            });
          }
          
          if (requests.length > 10) {
            return res.status(400).json({
              success: false,
              error: { message: 'Maximum 10 requests per batch', code: 'BATCH_TOO_LARGE' }
            });
          }
          
          const result = await this.batchRecommend(requests, options);
          
          if (result.success) {
            res.json(result);
          } else {
            res.status(500).json(result);
          }
        } catch (error) {
          res.status(500).json({
            success: false,
            error: { message: error.message, code: 'INTERNAL_ERROR' }
          });
        }
      },
      
      'POST /api/validate-data': async (req, res) => {
        try {
          const { data, chartTypeId } = req.body;
          
          if (!data || !chartTypeId) {
            return res.status(400).json({
              success: false,
              error: { message: 'Data and chartTypeId are required', code: 'INVALID_PARAMS' }
            });
          }
          
          const result = await this.validateData(data, chartTypeId);
          
          if (result.success) {
            res.json(result);
          } else {
            res.status(500).json(result);
          }
        } catch (error) {
          res.status(500).json({
            success: false,
            error: { message: error.message, code: 'INTERNAL_ERROR' }
          });
        }
      }
    };
  }
  
  /**
   * Setup Express routes
   */
  setupExpress(app) {
    const routes = this.getRoutes();
    
    Object.entries(routes).forEach(([route, handler]) => {
      const [method, path] = route.split(' ');
      
      switch (method) {
        case 'GET':
          app.get(path, handler);
          break;
        case 'POST':
          app.post(path, handler);
          break;
        case 'PUT':
          app.put(path, handler);
          break;
        case 'DELETE':
          app.delete(path, handler);
          break;
      }
    });
  }
}

// Export singleton instance
export const chartRecommenderAPI = new ChartRecommenderAPI();
