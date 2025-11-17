/**
 * Environment Configuration Manager
 * Handles all environment variables with validation and defaults
 */

// Environment variable validation schema
const envSchema = {
  // API Configuration
  DEEPSEEK_API_KEY: {
    required: true,
    type: 'string',
    description: 'DeepSeek API key for chart generation'
  },
  DEEPSEEK_BASE_URL: {
    required: false,
    type: 'string',
    default: 'https://api.deepseek.com/v1',
    description: 'DeepSeek API base URL'
  },
  DEEPSEEK_MODEL: {
    required: false,
    type: 'string',
    default: 'deepseek-chat',
    description: 'DeepSeek model to use'
  },
  DEEPSEEK_MAX_TOKENS: {
    required: false,
    type: 'number',
    default: 4000,
    description: 'Maximum tokens for API requests'
  },
  DEEPSEEK_TEMPERATURE: {
    required: false,
    type: 'number',
    default: 0.7,
    description: 'Temperature for API requests'
  },
  DEEPSEEK_TIMEOUT: {
    required: false,
    type: 'number',
    default: 30000,
    description: 'Timeout for API requests in milliseconds'
  },

  // Server Configuration
  PORT: {
    required: false,
    type: 'number',
    default: 3000,
    description: 'Server port'
  },
  NODE_ENV: {
    required: false,
    type: 'string',
    default: 'development',
    enum: ['development', 'production', 'test'],
    description: 'Node environment'
  },

  // CORS & Security
  CORS_ORIGIN: {
    required: false,
    type: 'string',
    default: 'http://localhost:5173',
    description: 'CORS allowed origins (comma-separated)'
  },
  RATE_LIMIT_WINDOW_MS: {
    required: false,
    type: 'number',
    default: 900000,
    description: 'Rate limit window in milliseconds'
  },
  RATE_LIMIT_MAX_REQUESTS: {
    required: false,
    type: 'number',
    default: 100,
    description: 'Maximum requests per window'
  },
  JWT_SECRET: {
    required: false,
    type: 'string',
    description: 'JWT secret for authentication'
  },

  // Database
  VITE_SUPABASE_URL: {
    required: false,
    type: 'string',
    description: 'Supabase project URL'
  },
  VITE_SUPABASE_ANON_KEY: {
    required: false,
    type: 'string',
    description: 'Supabase anonymous key'
  },
  SUPABASE_SERVICE_ROLE_KEY: {
    required: false,
    type: 'string',
    description: 'Supabase service role key'
  },

  // Authentication
  GOOGLE_OAUTH_CLIENT_ID: {
    required: false,
    type: 'string',
    description: 'Google OAuth client ID'
  },
  GOOGLE_OAUTH_CLIENT_SECRET: {
    required: false,
    type: 'string',
    description: 'Google OAuth client secret'
  },

  // Analytics
  GA_TRACKING_ID: {
    required: false,
    type: 'string',
    description: 'Google Analytics tracking ID'
  },
  PLAUSIBLE_DOMAIN: {
    required: false,
    type: 'string',
    description: 'Plausible analytics domain'
  },
  PLAUSIBLE_SCRIPT_URL: {
    required: false,
    type: 'string',
    default: 'https://plausible.io/js/script.js',
    description: 'Plausible script URL'
  },

  // Error Tracking
  SENTRY_DSN: {
    required: false,
    type: 'string',
    description: 'Sentry DSN for error tracking'
  },
  SENTRY_ENVIRONMENT: {
    required: false,
    type: 'string',
    default: 'production',
    description: 'Sentry environment'
  },
  SENTRY_RELEASE: {
    required: false,
    type: 'string',
    description: 'Sentry release version'
  },

  // Payment
  STRIPE_PUBLISHABLE_KEY: {
    required: false,
    type: 'string',
    description: 'Stripe publishable key'
  },
  STRIPE_SECRET_KEY: {
    required: false,
    type: 'string',
    description: 'Stripe secret key'
  },
  STRIPE_WEBHOOK_SECRET: {
    required: false,
    type: 'string',
    description: 'Stripe webhook secret'
  },

  // Email
  SENDGRID_API_KEY: {
    required: false,
    type: 'string',
    description: 'SendGrid API key'
  },
  FROM_EMAIL: {
    required: false,
    type: 'string',
    default: 'noreply@your-domain.com',
    description: 'From email address'
  },

  // Storage
  AWS_ACCESS_KEY_ID: {
    required: false,
    type: 'string',
    description: 'AWS access key ID'
  },
  AWS_SECRET_ACCESS_KEY: {
    required: false,
    type: 'string',
    description: 'AWS secret access key'
  },
  AWS_REGION: {
    required: false,
    type: 'string',
    default: 'us-east-1',
    description: 'AWS region'
  },
  AWS_S3_BUCKET: {
    required: false,
    type: 'string',
    description: 'AWS S3 bucket name'
  },

  // Feature Flags
  ENABLE_ANALYTICS: {
    required: false,
    type: 'boolean',
    default: true,
    description: 'Enable analytics tracking'
  },
  ENABLE_ERROR_TRACKING: {
    required: false,
    type: 'boolean',
    default: true,
    description: 'Enable error tracking'
  },
  ENABLE_PERFORMANCE_MONITORING: {
    required: false,
    type: 'boolean',
    default: true,
    description: 'Enable performance monitoring'
  },

  // Application
  APP_URL: {
    required: false,
    type: 'string',
    default: 'http://localhost:3000',
    description: 'Application URL'
  },
  SUPPORT_EMAIL: {
    required: false,
    type: 'string',
    default: 'support@your-domain.com',
    description: 'Support email address'
  },
  MAX_UPLOAD_SIZE: {
    required: false,
    type: 'number',
    default: 10,
    description: 'Maximum upload size in MB'
  },
  CACHE_DURATION: {
    required: false,
    type: 'number',
    default: 3600,
    description: 'Cache duration in seconds'
  },

  // Logging
  LOG_LEVEL: {
    required: false,
    type: 'string',
    default: 'info',
    enum: ['error', 'warn', 'info', 'debug'],
    description: 'Log level'
  },
  DEBUG: {
    required: false,
    type: 'boolean',
    default: false,
    description: 'Enable debug mode'
  }
};

// Environment configuration class
class EnvConfig {
  constructor() {
    this.config = {};
    this.errors = [];
    this.load();
    this.validate();
  }

  load() {
    // Load all environment variables
    for (const [key, schema] of Object.entries(envSchema)) {
      const value = process.env[key];
      
      if (value !== undefined) {
        this.config[key] = this.parseValue(value, schema.type);
      } else if (schema.default !== undefined) {
        this.config[key] = schema.default;
      }
    }
  }

  parseValue(value, type) {
    switch (type) {
      case 'number':
        return Number(value);
      case 'boolean':
        return value.toLowerCase() === 'true';
      case 'string':
      default:
        return value;
    }
  }

  validate() {
    for (const [key, schema] of Object.entries(envSchema)) {
      const value = this.config[key];

      // Check required fields
      if (schema.required && (value === undefined || value === '')) {
        this.errors.push(`Missing required environment variable: ${key}`);
        continue;
      }

      // Skip validation if value is undefined
      if (value === undefined) continue;

      // Type validation
      if (schema.type && typeof value !== schema.type) {
        this.errors.push(`Invalid type for ${key}: expected ${schema.type}, got ${typeof value}`);
      }

      // Enum validation
      if (schema.enum && !schema.enum.includes(value)) {
        this.errors.push(`Invalid value for ${key}: must be one of ${schema.enum.join(', ')}`);
      }

      // Custom validation
      this.customValidation(key, value, schema);
    }
  }

  customValidation(key, value, schema) {
    switch (key) {
      case 'DEEPSEEK_API_KEY':
        if (value && !value.startsWith('sk-')) {
          this.errors.push('DEEPSEEK_API_KEY must start with "sk-"');
        }
        break;
      
      case 'JWT_SECRET':
        if (value && value.length < 32) {
          this.errors.push('JWT_SECRET must be at least 32 characters long');
        }
        break;
      
      case 'PORT':
        if (value && (value < 1 || value > 65535)) {
          this.errors.push('PORT must be between 1 and 65535');
        }
        break;
      
      case 'CORS_ORIGIN':
        if (value && typeof value === 'string') {
          const origins = value.split(',').map(o => o.trim());
          for (const origin of origins) {
            if (!origin.startsWith('http://') && !origin.startsWith('https://')) {
              this.errors.push(`Invalid CORS origin: ${origin}. Must start with http:// or https://`);
            }
          }
        }
        break;
    }
  }

  get(key) {
    return this.config[key];
  }

  getAll() {
    return { ...this.config };
  }

  getErrors() {
    return [...this.errors];
  }

  isValid() {
    return this.errors.length === 0;
  }

  getClientConfig() {
    // Return only client-safe environment variables
    const clientKeys = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'GOOGLE_OAUTH_CLIENT_ID',
      'GA_TRACKING_ID',
      'PLAUSIBLE_DOMAIN',
      'PLAUSIBLE_SCRIPT_URL',
      'ENABLE_ANALYTICS',
      'APP_URL',
      'STRIPE_PUBLISHABLE_KEY'
    ];

    const clientConfig = {};
    for (const key of clientKeys) {
      if (this.config[key] !== undefined) {
        clientConfig[key] = this.config[key];
      }
    }

    return clientConfig;
  }

  getServerConfig() {
    // Return only server-safe environment variables
    const serverKeys = [
      'DEEPSEEK_API_KEY',
      'DEEPSEEK_BASE_URL',
      'DEEPSEEK_MODEL',
      'DEEPSEEK_MAX_TOKENS',
      'DEEPSEEK_TEMPERATURE',
      'DEEPSEEK_TIMEOUT',
      'PORT',
      'NODE_ENV',
      'CORS_ORIGIN',
      'RATE_LIMIT_WINDOW_MS',
      'RATE_LIMIT_MAX_REQUESTS',
      'JWT_SECRET',
      'SUPABASE_SERVICE_ROLE_KEY',
      'GOOGLE_OAUTH_CLIENT_SECRET',
      'SENTRY_DSN',
      'SENTRY_ENVIRONMENT',
      'SENTRY_RELEASE',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'SENDGRID_API_KEY',
      'FROM_EMAIL',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'AWS_REGION',
      'AWS_S3_BUCKET',
      'ENABLE_ERROR_TRACKING',
      'ENABLE_PERFORMANCE_MONITORING',
      'SUPPORT_EMAIL',
      'MAX_UPLOAD_SIZE',
      'CACHE_DURATION',
      'LOG_LEVEL',
      'DEBUG'
    ];

    const serverConfig = {};
    for (const key of serverKeys) {
      if (this.config[key] !== undefined) {
        serverConfig[key] = this.config[key];
      }
    }

    return serverConfig;
  }

  printConfig() {
        console.log('Environment Configuration:');
    console.log('================================');
    
    for (const [key, schema] of Object.entries(envSchema)) {
      const value = this.config[key];
            const status = value !== undefined ? '[OK]' : schema.required ? '[FAIL]' : '[OPTIONAL]';
      const displayValue = this.shouldMaskValue(key) ? '***MASKED***' : value;
      
      console.log(`${status} ${key}: ${displayValue} (${schema.description})`);
    }

    if (this.errors.length > 0) {
            console.log('\nConfiguration Errors:');
      console.log('========================');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }
  }

  shouldMaskValue(key) {
    const maskKeys = [
      'DEEPSEEK_API_KEY',
      'JWT_SECRET',
      'SUPABASE_SERVICE_ROLE_KEY',
      'GOOGLE_OAUTH_CLIENT_SECRET',
      'SENTRY_DSN',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'SENDGRID_API_KEY',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY'
    ];
    
    return maskKeys.includes(key);
  }
}

// Create and export singleton instance
export const envConfig = new EnvConfig();

// Validate configuration on startup
if (!envConfig.isValid()) {
    console.error('Environment configuration validation failed:');
  envConfig.getErrors().forEach(error => console.error(`  - ${error}`));
  process.exit(1);
}

// Export configuration getters
export const getEnv = (key) => envConfig.get(key);
export const getClientEnv = () => envConfig.getClientConfig();
export const getServerEnv = () => envConfig.getServerConfig();
export const getAllEnv = () => envConfig.getAll();
