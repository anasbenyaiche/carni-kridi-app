# Integration Examples

This document shows how to use the new service-controller architecture.

## Backend Usage

### Using Services in Controllers

```javascript
// Before (in routes file):
router.get('/', auth, async (req, res) => {
  try {
    const clients = await Client.find({ storeId: req.user.storeId })
      .sort({ lastTransaction: -1, name: 1 })
      .limit(20);
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get clients' });
  }
});

// After (in controller):
async getClients(req, res) {
  try {
    const { page, limit } = this.extractPaginationParams(req.query);
    const { search } = this.extractSearchParams(req.query);
    const storeId = req.user.storeId;

    const result = await clientService.getClientsByStore(storeId, { page, limit, search });
    this.handleSuccess(res, result);
  } catch (error) {
    this.handleError(res, error);
  }
}
```

### Using Services Directly

```javascript
const clientService = require('./services/clientService');

// Get all clients for a store
const clients = await clientService.getClientsByStore(storeId, { page: 1, limit: 20 });

// Create a new client
const newClient = await clientService.createClient({
  name: 'John Doe',
  phone: '123456789',
  email: 'john@example.com'
}, storeId);

// Get client with balance information
const clientWithBalance = await clientService.getClientWithBalance(clientId, storeId);
```

## Frontend Usage

### Using Services in Components

```typescript
import { clientService, authService, storeService } from '../services';

// Authentication
const loginUser = async (email: string, password: string) => {
  try {
    const result = await authService.login({ email, password });
    console.log('Logged in:', result.user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Client management
const loadClients = async () => {
  try {
    const result = await clientService.getClients(1, 20, '');
    setClients(result.clients);
  } catch (error) {
    console.error('Failed to load clients:', error);
  }
};

// Store management
const updateStore = async (storeData) => {
  try {
    const updated = await storeService.updateStore(storeData);
    console.log('Store updated:', updated);
  } catch (error) {
    console.error('Failed to update store:', error);
  }
};
```

### Type Safety

```typescript
import type { Client, CreateStoreData, User } from '../services';

// Full type safety for API responses
const client: Client = await clientService.getClient('client-id');

// Type-safe store creation
const storeData: CreateStoreData = {
  name: 'My Store',
  address: '123 Main St',
  phone: '555-0123',
  settings: {
    currency: 'TND',
    language: 'ar',
    maxCreditLimit: 1000
  }
};

const newStore = await storeService.createStore(storeData);
```

## Architecture Benefits

### 1. Separation of Concerns
- **Routes**: Handle HTTP routing and middleware
- **Controllers**: Handle request/response and validation
- **Services**: Handle business logic and data operations
- **Models**: Define data structure and validation

### 2. Reusability
- Services can be used across different controllers
- Common operations are centralized in BaseService
- Frontend services provide consistent API access

### 3. Testability
- Services can be tested independently
- Controllers can be tested with mocked services
- Clear boundaries make unit testing easier

### 4. Maintainability
- Business logic is centralized in services
- API changes only require service updates
- Type safety catches errors at compile time

### 5. Consistency
- Standardized error handling across all controllers
- Consistent API response formats
- Common patterns reduce learning curve

## Migration from Old Architecture

### Before
```javascript
// All logic mixed in routes
router.post('/', auth, async (req, res) => {
  // Validation logic
  // Business logic
  // Database operations
  // Error handling
  // Response formatting
});
```

### After
```javascript
// Route - just routing
router.post('/', auth, [validation], controller.createClient.bind(controller));

// Controller - HTTP concerns
async createClient(req, res) {
  try {
    const client = await clientService.createClient(req.body, req.user.storeId);
    this.handleSuccess(res, client, 201);
  } catch (error) {
    this.handleError(res, error);
  }
}

// Service - Business logic
async createClient(clientData, storeId) {
  // Check for existing client
  // Create client with store ID
  // Return created client
}
```

This architecture provides a solid foundation for scaling the application while maintaining code quality and developer experience.