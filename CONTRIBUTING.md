# Contributing to Xolak

Thank you for your interest in contributing to Xolak! We appreciate developers who want to help make open-source project discovery more accessible and effective.

## Hacktoberfest 2025

Xolak is participating in Hacktoberfest 2025. We welcome contributions from developers at any experience level. Look for issues labeled `hacktoberfest`, `good first issue`, or `help wanted` to get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)  
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Development Guidelines](#development-guidelines)
- [Testing](#testing)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). All participants are expected to adhere to these community standards.

## Getting Started

### Requirements

Before contributing, make sure you have these tools installed:
- Go 1.21+ for backend development
- Node.js 18+ and npm for frontend development  
- Python 3.8+ for AI/ML components
- Git for version control
- Docker (optional, for containerized development)

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/xolak.git
   cd xolak
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your GitHub token and other configuration values.

4. Install dependencies:

   Backend (Go):
   ```bash
   cd backend
   go mod tidy
   ```

   Frontend (React/TypeScript):
   ```bash
   cd frontend
   npm install
   ```

   AI Server (Python):
   ```bash
   cd ai
   pip install -r requirements.txt
   ```

5. Start the development servers in separate terminals:
   
   Backend:
   ```bash
   cd backend && go run main.go
   ```

   AI Server:
   ```bash
   cd ai && python ai_server.py
   ```

   Frontend:
   ```bash
   cd frontend && npm start
   ```

6. Open `http://localhost:3000` to verify everything is working.

## How to Contribute

### Types of Contributions

We welcome different kinds of contributions:

- Bug fixes and issue resolution
- New features and enhancements  
- Documentation improvements
- UI/UX improvements
- Tests and test coverage
- DevOps and tooling improvements
- Translations (planned for future)

### Finding Issues to Work On

1. Browse the [Issues](https://github.com/yourusername/xolak/issues) page
2. Look for these helpful labels:
   - `good first issue` - Great for newcomers
   - `hacktoberfest` - Hacktoberfest-eligible issues
   - `help wanted` - Issues we need assistance with
   - `bug` - Bug reports needing fixes
   - `enhancement` - New feature requests

3. Comment on an issue before starting work to avoid duplication

## Pull Request Process

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes:
   - Write clean, readable code
   - Follow existing code style and conventions  
   - Add tests if applicable
   - Update documentation when needed

3. Test your changes:
   - Run existing tests: `npm test` (frontend), `go test ./...` (backend)
   - Test the application manually
   - Make sure all components work together

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```
   
   Follow conventional commit format:
   - `feat:` for new features
   - `fix:` for bug fixes  
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request:
   - Write a clear, descriptive title
   - Fill out the PR template completely
   - Link related issues using `Closes #issue_number`
   - Include screenshots for UI changes

### Pull Request Requirements

- Code follows project style guidelines
- Self-review completed  
- Tests pass (when applicable)
- Documentation updated (when applicable)
- No merge conflicts
- PR description is clear and complete

## Issue Guidelines

### Reporting Bugs

When reporting bugs, include:

- Clear title and description
- Steps to reproduce the issue  
- Expected vs actual behavior
- Environment details (OS, browser, versions)
- Screenshots or error logs (when helpful)

### Suggesting Features

For feature requests, provide:

- Clear description of the feature
- Use case and motivation
- Implementation ideas (if you have any)
- Mockups or examples (when applicable)

## Development Guidelines

### Code Style

**Go (Backend)**:
- Follow standard Go formatting (`go fmt`)
- Use clear variable and function names
- Comment exported functions and complex logic
- Handle errors properly

**TypeScript/React (Frontend)**:
- Use TypeScript strict mode
- Follow React best practices with hooks
- Use descriptive component and variable names  
- Prefer functional components
- Use consistent styling approach

**Python (AI)**:
- Follow PEP 8 style guide
- Use type hints when helpful
- Add docstrings for functions and classes
- Use descriptive variable names

### File Organization

- Keep files focused and reasonably sized
- Use consistent naming conventions
- Place shared utilities in `/utils` directories
- Group related files together logically

### Git Workflow

- Make focused, atomic commits
- Write clear commit messages
- Rebase feature branches before merging
- Squash related commits when needed

## Testing

### Running Tests

Frontend:
```bash
cd frontend
npm test
```

Backend:
```bash
cd backend
go test ./...
```

AI Server:
```bash
cd ai
python -m pytest
```

### Writing Tests

- Write unit tests for new functions and components
- Add integration tests for API endpoints
- Include edge cases and error scenarios  
- Aim for good test coverage

## Recognition

Contributors are recognized in:
- GitHub contributors list
- Project README
- Release notes (for significant contributions)

## Getting Help

If you need assistance:

1. Check existing [Issues](https://github.com/yourusername/xolak/issues) and [Discussions](https://github.com/yourusername/xolak/discussions)
2. Create a [Discussion](https://github.com/yourusername/xolak/discussions) for questions
3. Comment on issues for specific problems

## Thank You

Every contribution helps make Xolak better. We appreciate your time and effort in improving this project for the community.

Happy coding!