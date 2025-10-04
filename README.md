# Xolak - AI-Powered OSS Project Recommender

<img width="900" height="440" alt="image" src="https://github.com/user-attachments/assets/98efdf7c-0c17-40cd-b1a6-e5a348f21111" />
<img width="900" height="440" alt="image" src="https://github.com/user-attachments/assets/6fcce2f9-f0eb-41e8-85af-01fcdf5dc3dd" />
<img width="600" height="440" alt="image" src="https://github.com/user-attachments/assets/da81e379-e474-4e59-979c-3ffabda87f0f" />




[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2025-orange.svg)](https://hacktoberfest.digitalocean.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8.svg)](https://golang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB.svg)](https://python.org/)

Xolak helps developers find open-source projects that match their skills and interests using AI-powered recommendations. Whether you're a beginner looking for your first contribution or an experienced developer seeking new challenges, Xolak makes project discovery simple and personalized.

## Features

**AI-Powered Recommendations** - Get project suggestions tailored to your programming skills and experience level

**Smart GitHub Integration** - Comprehensive project discovery through advanced GitHub API integration

**Interactive Chat Interface** - Refine your search and get better recommendations through conversation

**Modern Web Experience** - Clean, responsive interface built with React and TypeScript

**Fast Go Backend** - Efficient API server for quick GitHub data processing and filtering

**Machine Learning Models** - Powered by DigitalOcean Gradient for intelligent project matching

## Tech Stack

**Frontend**
- React 18+ with TypeScript
- reactbits.dev for UI components  
- React Router for navigation
- Axios for API communication

**Backend**
- Go 1.21+ with Fiber framework
- GitHub API integration
- RESTful API design

**AI/ML**
- Python 3.8+ with scikit-learn
- Flask for AI server
- DigitalOcean Gradient for model training
- Custom recommendation algorithms

**DevOps**
- Docker & Docker Compose
- GitHub Actions (planned)

## Getting Started

### Requirements
- Go 1.21 or higher
- Node.js 18 or higher  
- Python 3.8 or higher
- Docker (optional)

### Setup

Clone the repository:
```bash
git clone https://github.com/yourusername/xolak.git
cd xolak
```

Copy environment variables and add your GitHub token:
```bash
cp .env.example .env
```

Start the backend server:
```bash
cd backend
go mod tidy
go run main.go
```

Start the AI recommendation server:
```bash
cd ai  
pip install -r requirements.txt
python ai_server.py
```

Start the frontend application:
```bash
cd frontend
npm install
npm start
```

### Docker Setup

If you prefer using Docker:
```bash
docker-compose up --build
```

## Usage

Open the application in your browser and enter your programming skills or interests. The AI system will analyze your input and suggest relevant open-source projects. You can refine recommendations using the chat interface to find projects that better match what you're looking for.

## Contributing

This project welcomes contributions from developers at all experience levels. We're participating in Hacktoberfest 2025, making it a great opportunity to get involved in open source.

Check out our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

1. Fork the repository
2. Create a feature branch for your changes
3. Make your improvements  
4. Test your changes locally
5. Submit a pull request with a clear description

## Documentation

- [DigitalOcean Gradient Setup](docs/gradient.md)
- API Documentation (coming soon)
- Deployment Guide (coming soon)

## Project Structure

```
xolak/
├── backend/          # Go backend API
├── frontend/         # React TypeScript frontend  
├── ai/              # Python AI/ML server
├── docs/            # Documentation and demos
└── docker-compose.yml
```

## Development Roadmap

- [x] Project structure and documentation
- [ ] AI recommendation engine development
- [ ] Frontend UI implementation  
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
- [ ] Advanced filtering and search features
- [ ] User preference system
- [ ] Contribution tracking and analytics

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you find this project useful, consider giving it a star on GitHub to help others discover it.

## Getting Help

- Create an [Issue](https://github.com/yourusername/xolak/issues) for bug reports or feature requests
- Start a [Discussion](https://github.com/yourusername/xolak/discussions) for questions and ideas

Happy contributing!
