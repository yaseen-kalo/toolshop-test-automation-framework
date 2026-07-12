Step 1 — EXPLORE
   └── Manual exploration via curl
       ├── Test all endpoints (GET, POST, PUT, PATCH, DELETE)
       ├── Test with and without token
       ├── Note response shapes
       ├── Note status codes (200, 201, 401, 403, 404, 409, 422)
       ├── Note bugs
       └── Map auth requirements

Step 2 — TYPES (`types/`)
   └── Create `module.types.ts`
       ├── Count {} levels → number of interfaces
       ├── Count [] → where to use Type[]
       ├── Model bottom up (deepest first)
       ├── Request interfaces (POST, PUT, PATCH payloads)
       ├── Response interfaces (GET, POST responses)
       ├── Shared/base interfaces
       └── Type aliases for arrays

Step 3 — SERVICE (`services/`)
   └── Create `module.service.ts`
       ├── Constructor with optional token
       ├── One method per endpoint
       ├── Token guard on protected methods
       ├── getHeaders() private helper
       ├── Error messages with status code
       └── Correct return types
       
       NOTE: No extra methods needed for negative tests
             Same methods handle both positive and negative
             Positive → returns data
             Negative → throws error

Step 4 — DATA (`data/`)
   └── Create `module.data.ts`
       ├── Valid payloads → for positive tests
       ├── Invalid payloads → for negative tests
       │   ├── Missing required fields
       │   ├── Invalid formats
       │   ├── Duplicate data
       │   └── Wrong types
       ├── Use Date.now() for unique values
       └── Import from types for type safety

Step 5 — TESTS (`tests/api/`)
   └── Create `module.api.spec.ts`
       │
       ├── beforeAll
       │   ├── Login → get token
       │   └── Setup shared data (ids etc)
       │
       ├── Step 5a — POSITIVE TESTS
       │   ├── Valid request → expected response
       │   ├── Assert response shape
       │   └── Assert key field values
       │
       └── Step 5b — NEGATIVE TESTS
           │
           ├── Auth failures
           │   ├── No token → rejects.toThrow('401')
           │   └── Wrong role → rejects.toThrow('403')
           │
           ├── Validation failures
           │   ├── Missing required field → rejects.toThrow('422')
           │   ├── Invalid format → rejects.toThrow('422')
           │   └── Too short/long → rejects.toThrow('422')
           │
           ├── Conflict failures
           │   └── Duplicate data → rejects.toThrow('409')
           │
           ├── Not found failures
           │   └── Invalid ID → rejects.toThrow('404')
           │
           └── Bugs
               └── test.skip with reason