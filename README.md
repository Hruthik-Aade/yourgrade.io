# 📊 Your Grade.io

> A smart student grade management platform powered by AI to help you track, analyze, and optimize your academic performance.

[![GitHub](https://img.shields.io/badge/GitHub-Hruthik--Aade%2Fyourgrade.io-blue?style=flat-square&logo=github)](https://github.com/Hruthik-Aade/yourgrade.io)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime-orange?style=flat-square&logo=firebase)](https://firebase.google.com)

## 🎯 Overview

**Your Grade.io** is a modern web application designed for students to effortlessly manage their academic grades, track GPA across multiple semesters, and get AI-powered insights into their academic progress. Whether you're planning your next semester or analyzing past performance, Your Grade.io makes academic tracking intuitive and intelligent.

## ✨ Key Features

### 📈 **GPA Calculator**
- Real-time GPA calculation with support for multiple grading scales
- Semester-wise breakdown and historical tracking
- Visual progress indicators and trend analysis
- What-if scenarios to plan future semesters

### 🎓 **Dashboard**
- Personalized academic dashboard with quick stats
- Manage multiple subjects per semester
- Grade entry and tracking interface
- Visual grade distribution charts and analytics

### 🤖 **AI-Powered Data Import**
- Automatically extract semester data from transcripts or course lists
- Powered by Google Genkit AI
- Intelligent parsing of academic records
- Batch import capabilities for faster data entry

### 💬 **Feedback System**
- Submit feedback on subjects and learning experiences
- Track instructor feedback and comments
- Export and review feedback history
- Improve learning experience through data-driven insights

### 👤 **User Authentication**
- Secure Firebase authentication
- Google and Email/Password login options
- Session management and logout
- User profile customization

### 🔐 **Privacy & Security**
- HTTPS encrypted connections
- Firestore security rules
- User data privacy control
- GDPR compliant data handling

## 🛠 Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **React Hook Form** - Efficient form handling

### Backend & Infrastructure
- **Firebase** - Authentication, Firestore Database, Hosting
- **Google Genkit** - AI-powered features
- **Next.js Server Actions** - Backend-less API routes

### Development Tools
- **ESLint** - Code quality
- **PostCSS** - CSS processing
- **TSConfig** - TypeScript configuration

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account
- Google Cloud credentials for Genkit

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hruthik-Aade/yourgrade.io.git
   cd yourgrade.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your Firebase config and API keys:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GOOGLE_GENKIT_API_KEY=your_genkit_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:9002`

5. **(Optional) Start Genkit AI services**
   ```bash
   npm run genkit:dev
   ```

## 🚀 Usage

### For Students
1. **Sign up** with email or Google account
2. **Add subjects** for current semester
3. **Enter grades** as you complete assignments/exams
4. **View GPA** - Real-time calculation across all semesters
5. **Use AI Import** - Paste transcript data for automatic processing
6. **Submit Feedback** - Share insights about your learning experience

### For Developers

#### Available Scripts
```bash
npm run dev              # Start development server (port 9002)
npm run genkit:dev      # Start Genkit AI in dev mode
npm run genkit:watch    # Watch mode for Genkit
npm run build           # Production build
npm start               # Start production server
npm run lint            # Run ESLint
npm run typecheck       # TypeScript type checking
```

#### Project Structure
```
src/
├── app/                 # Next.js app routes & pages
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard pages
│   ├── login/          # Authentication
│   └── actions/        # Server actions
├── components/         # Reusable React components
│   ├── ui/            # Base UI components
│   ├── dashboard/     # Dashboard-specific components
│   └── auth/          # Auth components
├── firebase/          # Firebase client setup
├── ai/                # AI/Genkit integrations
│   └── flows/        # Genkit AI flows
├── hooks/            # Custom React hooks
└── lib/              # Utilities & types
```

## 📚 API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/logout` - Sign out

### Academic Data
- `GET /api/subjects` - Fetch user subjects
- `POST /api/subjects` - Add new subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### AI Features
- `POST /api/ai/extract` - Extract semester data from transcript
- `POST /api/feedback/submit` - Submit feedback

## 🔐 Security Features

- **Firestore Security Rules** - Row-level access control
- **Firebase Auth** - Managed authentication
- **Environment Variables** - Sensitive data protection
- **HTTPS Only** - Encrypted communications
- **Input Validation** - Server-side validation
- **XSS Protection** - React built-in escaping

## 📊 Database Schema

### Collections
- **users** - User profiles and preferences
- **semesters** - Academic semesters
- **subjects** - Courses with grades
- **feedback** - Student feedback entries
- **analytics** - Usage analytics

## 🎨 UI Components

Built with Radix UI and customized Tailwind styling:
- Buttons, Forms, Inputs
- Dialogs, Alerts, Modals
- Cards, Tables, Charts
- Dropdowns, Select, Checkboxes
- Progress indicators, Tooltips
- Carousels, Accordions, Tabs

## 🚢 Deployment

### Deploy to Firebase Hosting
```bash
npm run build
firebase deploy
```

### Deploy to Vercel
```bash
vercel deploy
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

- 📧 Email: support@yourgrade.io
- 🐛 Issues: [GitHub Issues](https://github.com/Hruthik-Aade/yourgrade.io/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Hruthik-Aade/yourgrade.io/discussions)

## 📄 Additional Resources

- [Privacy Policy](src/app/privacy/page.tsx)
- [Terms of Service](src/app/terms/page.tsx)
- [Documentation](docs/blueprint.md)
- [Backend Schema](docs/backend.json)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org) & [Firebase](https://firebase.google.com)
- UI Components from [Radix UI](https://www.radix-ui.com)
- AI Features powered by [Google Genkit](https://genkit.dev)
- Styling with [Tailwind CSS](https://tailwindcss.com)

---

<div align="center">

**Made with ❤️ by Hruthik Chandra Aade**

[⬆ Back to top](#-yourgradeio)

</div>
