# Partial Documentation

## Setting Up

```bash
# Install dependencies
yarn install

# Seed database
yarn seed

# Run the project
yarn start
```

## Testing

```bash
yarn test
```

## Linting with ESLint

```bash
yarn lint
```

## Info

- The API responses follow the [JSend](https://github.com/omniti-labs/jsend) specification.
- The tests aren't optimal. For instance I'm just mocking the database in memory and calling the services, without mocking their dependencies. With enough time I'd mock everything in order to be able to test the services 100% isolatedly.

## Progress

- [x] Project Structure
- [x] Linter Configuration
- [x] API Implementations
- [x] JSDoc (partial, only for services)
- [x] Unit Tests for Services (partial, only for Job and Contract)
- [ ] Unit Tests for Controllers
- [ ] Integration Tests
- [ ] Swagger Documentation
- [ ] Update README
