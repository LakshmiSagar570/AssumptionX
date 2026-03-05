# 🎯 AssumptionX - Blind Spot Detector

> **Remove the idea assumptions you have**  
> Ruthless AI analysis of your ideas, plans, and decisions.

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Clerk Auth](https://img.shields.io/badge/Clerk-7.0.1-6C63FF?style=flat-square&logo=clerk)](https://clerk.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[🚀 Live Demo](https://assumption-x.vercel.app) • [📖 Documentation](#documentation) • [🛠️ Setup](#getting-started) • [👤 Author](https://github.com/LakshmiSagar570)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Development](#development)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Usage Guide](#usage-guide)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## 🎯 Overview

**AssumptionX** is an AI-powered web application that helps you identify, challenge, and eliminate hidden assumptions from your ideas, business plans, and decisions. By analyzing your concept through four distinct perspectives (Investor, Devil's Advocate, Psychologist, and Lawyer), the platform provides ruthless, data-driven feedback to strengthen your thinking.

Whether you're:
- 💡 Developing a startup idea
- 🚀 Planning a major business decision
- 📊 Seeking investment validation
- 🧠 Testing the robustness of your strategy
- ⚖️ Identifying potential risks and pitfalls

AssumptionX provides comprehensive analysis from multiple angles to help you think more critically and strategically.

### The Problem

Most entrepreneurs and decision-makers fall victim to **cognitive biases** and **hidden assumptions**:
- Confirmation bias (only seeking supporting evidence)
- Overconfidence bias (overestimating success probability)
- False consensus effect (assuming others think like you)
- Sunk cost fallacy (commitment to failing ideas)

AssumptionX cuts through these biases by providing objective, multi-perspectival analysis.

---

## ✨ Key Features

### 🔍 **Four Analytical Perspectives**

1. **💰 Skeptical Investor**
   - Analyzes financial viability
   - Evaluates market size and demand
   - Assesses revenue models and unit economics
   - Reviews CAC/LTV metrics
   - Identifies scalability challenges

2. **👿 Devil's Advocate**
   - Attacks logical assumptions
   - Identifies false premises
   - Uncovers circular reasoning
   - Highlights competitive threats
   - Tests the robustness of your logic

3. **🧠 Forensic Psychologist**
   - Detects cognitive biases (overconfidence, anchoring, etc.)
   - Identifies emotional blindspots
   - Reveals wishful thinking
   - Exposes sunk cost fallacies
   - Recognizes confirmation bias

4. **⚖️ Corporate Lawyer**
   - Identifies legal risks and liabilities
   - Flags regulatory concerns
   - Reviews edge case vulnerabilities
   - Assesses worst-case scenarios
   - Highlights compliance issues

### 📊 **Analysis Output**

Each analysis includes:
- **Risk Level**: High, Medium, or Low (fairly calibrated)
- **Blind Spots**: 3-5 detailed observations per perspective
- **Severity Rating**: Critical, Moderate, or Minor
- **Actionable Fixes**: Concrete steps to address each issue
- **Overall Verdict**: Balanced summary acknowledging strengths and weaknesses
- **Fatal Flaws**: Critical showstoppers (if any)

### 💾 **Analysis History**

- **Persistent Storage**: All analyses are saved and timestamped
- **Easy Retrieval**: Browse previous analyses with one click
- **Expandable Results**: Click to expand and review detailed feedback
- **Risk Level Indicators**: Color-coded risk visualization

### 👤 **User Management**

- **Secure Authentication**: Powered by Clerk
- **Per-User Tracking**: Individual analysis history
- **Daily Usage Limits**: 10 analyses per day per user
- **User-Specific Results**: Private, personalized analysis storage

### 🎨 **Modern UI/UX**

- **Dark Theme**: Eye-friendly dark interface
- **Responsive Design**: Works seamlessly on desktop, tablet, mobile
- **Real-time Progress**: Step-by-step analysis visualization
- **Color-Coded Risk**: Intuitive visual risk indicators
  - 🔴 **Red (#e63946)**: High risk/critical
  - 🟠 **Amber (#f4a026)**: Medium risk/moderate
  - 🟢 **Green (#57cc99)**: Low risk/minor
- **Custom Typography**: Bebas Neue (headers), IBM Plex Sans (body), IBM Plex Mono (code)

---

## 🔄 How It Works

### Step 1: Submit Your Idea
Enter a detailed description of your idea, business plan, or decision you want analyzed. The more specific you are, the more accurate the analysis.

### Step 2: Select Analysis Perspective
Choose which angle you want to explore:
- Quick analysis (single perspective)
- Full analysis (all four perspectives)

### Step 3: AI Analysis
The app sends your idea to an advanced LLM (Large Language Model) that:
1. Analyzes the idea from the selected perspective
2. Identifies 3-5 blind spots with specific details
3. Rates severity (high/medium/low)
4. Provides actionable fixes
5. Compiles overall verdict and risk assessment

### Step 4: Review Results
Explore the analysis:
- View each perspective's findings
- Understand severity ratings
- Read detailed explanations
- Follow actionable recommendations
- Review overall risk assessment

### Step 5: Iterate & Improve
Use the feedback to:
- Refine your idea
- Validate assumptions
- Mitigate identified risks
- Strengthen your strategy
- Prepare for criticism

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.1.6](https://nextjs.org/) - React metaframework with App Router
- **Language**: [TypeScript 5.0](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: Custom React components with inline styles
- **State Management**: React Hooks (useState, useEffect, useRef)
- **HTTP Client**: Fetch API (native browser)

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **API Framework**: Next.js App Router API Routes
- **Authentication**: [Clerk 7.0.1](https://clerk.com/) - Complete user authentication solution
- **Database**: Supabase (PostgreSQL) - For analysis persistence
- **AI/LLM**: OpenRouter - Multi-model LLM API
  - Meta Llama 3.3 70B (primary)
  - Meta Llama 3.1 8B
  - Mistral 7B
  - Google Gemma 3 4B

### Deployment
- **Hosting**: [Vercel](https://vercel.com/) - Optimized for Next.js
- **Domain**: Custom domain (assumption-x.vercel.app)
- **CI/CD**: Vercel automatic deployments
- **Environment**: Production-ready with staging support

### Development Tools
- **Package Manager**: npm / yarn
- **Linting**: ESLint 9.x
- **Build Tool**: Next.js built-in (webpack)
- **Fonts**: Google Fonts
  - Bebas Neue (Display)
  - IBM Plex Sans (Body)
  - IBM Plex Mono (Code)

---

## 📁 Project Structure

```
AssumptionX/
├── clerk-nextjs/                    # Main application directory
│   ├── app/                         # Next.js App Router
│   │   ├── page.tsx                 # Home page - main analysis interface
│   │   ├── layout.tsx               # Root layout with metadata
│   │   ├── globals.css              # Global styles and Tailwind imports
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx         # Clerk sign-in page
│   │   ├── history/
│   │   │   └── page.tsx             # Analysis history page
│   │   └── api/
│   │       ├── analyze/
│   │       │   └── route.ts         # POST /api/analyze - Main AI analysis endpoint
│   │       └── history/
│   │           └── route.ts         # GET /api/history - Fetch user analysis history
│   ├── package.json                 # Project dependencies
│   ├── tsconfig.json                # TypeScript configuration
│   └── next.config.js               # Next.js configuration
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main UI component - handles idea submission, AI call, results display |
| `app/layout.tsx` | Root layout - Clerk provider, metadata, fonts setup |
| `app/api/analyze/route.ts` | Backend AI analysis endpoint - calls OpenRouter LLM |
| `app/api/history/route.ts` | Fetches saved analyses from Supabase |
| `app/history/page.tsx` | User analysis history page with expandable results |
| `app/sign-in/...page.tsx` | Clerk-hosted sign-in page |
| `app/globals.css` | Tailwind imports and global theme setup |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher recommended)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`
  
- **npm** or **yarn** (comes with Node.js)
  - npm: `npm --version`
  - yarn: `yarn --version`

- **Git** (for cloning the repository)
  - Download from [git-scm.com](https://git-scm.com/)

### Required Accounts & API Keys

Before running the project, you'll need to set up:

1. **Clerk** (Authentication)
   - Sign up at [clerk.com](https://clerk.com/)
   - Create a new application
   - Get your API keys from the Clerk dashboard
   - Keys needed: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

2. **Supabase** (Database) - Optional but recommended
   - Sign up at [supabase.com](https://supabase.com/)
   - Create a new project
   - Create an `analyses` table with schema:
     ```sql
     CREATE TABLE analyses (
       id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id text NOT NULL,
       idea text NOT NULL,
       result jsonb NOT NULL,
       risk_level text,
       created_at timestamp DEFAULT now()
     );
     ```
   - Get your API URL and anon key
   - Keys needed: `SUPABASE_URL`, `SUPABASE_ANON_KEY`

3. **OpenRouter** (LLM API)
   - Sign up at [openrouter.ai](https://openrouter.ai/)
   - Get your API key
   - Key needed: `OPENROUTER_API_KEY`

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/LakshmiSagar570/AssumptionX.git
cd AssumptionX
cd clerk-nextjs
```

### 2. Install Dependencies

```bash
npm install
```

Or with yarn:

```bash
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the `clerk-nextjs/` directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase (Optional but recommended)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenRouter LLM API
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

**Note**: 
- Keys starting with `NEXT_PUBLIC_` are exposed to the browser (safe for public keys)
- Other keys are server-side only (keep secret)
- The app can run without Supabase (analyses won't persist), but it's recommended

### 4. Verify Installation

Test that everything is set up correctly:

```bash
npm run build
```

If there are no errors, you're ready to go!

---

## 🔧 Development

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Development Workflow

1. **Edit code** in `app/` directory
2. **Save** - Hot reload automatically refreshes browser
3. **Check console** for TypeScript errors
4. **Test functionality** in browser
5. **Commit** changes when satisfied

### Hot Module Replacement (HMR)

Next.js automatically reloads the page when you:
- Modify `.tsx` or `.ts` files
- Update `.css` files
- Change `next.config.js`

No manual refresh needed!

---

## ⚙️ Configuration

### TypeScript Configuration

The project uses strict TypeScript settings (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "strict": true,           // Strict type checking
    "noEmit": true,           // Don't emit JS files
    "jsx": "react-jsx",       // React 17+ JSX
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./*"]          // Path alias for imports
    }
  }
}
```

### Tailwind CSS Configuration

Uses Tailwind CSS 4 with PostCSS:

```css
@import "tailwindcss";
```

Dark theme is default, with automatic color scheme support.

### Clerk Configuration

Authenticated routes are automatically protected:
- `/` - Protected (requires sign-in)
- `/history` - Protected (requires sign-in)
- `/sign-in` - Public (for new/returning users)

### API Limits

- **Daily Limit**: 10 analyses per user per day
- **Rate Limiting**: Enforced via Supabase counts
- **Model Fallback**: Automatically tries alternate free models if one fails

---

## 📡 API Reference

### POST /api/analyze

**Analyzes an idea from four perspectives**

#### Request

```typescript
POST /api/analyze
Content-Type: application/json
Authorization: Bearer [Clerk JWT Token]

{
  "idea": "Your idea description here"
}
```

#### Response (Success - 200)

```typescript
{
  "investor": [
    {
      "title": "No clear revenue model",
      "severity": "high",
      "explanation": "The business model doesn't generate revenue. Most successful startups...",
      "fix": "Define a revenue stream. Consider subscription, freemium, or B2B models."
    }
    // ... more blind spots
  ],
  "devils_advocate": [...],
  "psychologist": [...],
  "lawyer": [...],
  "overall_verdict": "The idea has potential but lacks specific details...",
  "risk_level": "medium",
  "fatal_flaws": ["No technical co-founder"],
  "_model": "meta-llama/llama-3.3-70b-instruct:free"
}
```

#### Response (Daily Limit Exceeded - 429)

```typescript
{
  "error": "Daily limit reached. You have 0 remaining analyses for today."
}
```

#### Response (Not Authenticated - 401)

```typescript
{
  "error": "Unauthorized"
}
```

---

### GET /api/history

**Fetches user's analysis history**

#### Request

```typescript
GET /api/history?userId=user_123
```

#### Response (200)

```typescript
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "idea": "Create an AI-powered project management tool",
    "risk_level": "medium",
    "created_at": "2026-03-05T10:44:55Z",
    "result": { /* full analysis object */ }
  },
  // ... more analyses
]
```

#### Response (Empty)

```typescript
[]
```

---

## 📚 Usage Guide

### Basic Workflow

#### 1. Sign In
- Click "Sign In" button
- Create a Clerk account or log in
- Accept permissions (user profile access)

#### 2. Submit Your Idea
```
Example submission:
"I want to create a mobile app that helps remote workers find the best coffee shops in their area for working. The app would show WiFi quality, noise level, and availability. Revenue would come from premium features and sponsored listings."
```

**Tips for better analysis:**
- Be specific and detailed
- Include business model details
- Mention target market
- Describe unique value proposition
- Add relevant constraints (budget, timeline, etc.)

#### 3. View Analysis Results
The app displays analysis in real-time:
1. Shows progress through each perspective
2. Displays blind spots as they're analyzed
3. Shows overall verdict and risk level
4. Color-codes severity (red/amber/green)

#### 4. Expand Details
- Click "+" next to each blind spot to expand
- Read detailed explanation
- Review actionable fix recommendations

#### 5. Save Results
- Results auto-save to your history
- Visit `/history` page to review past analyses
- Click to expand and re-read analysis anytime

#### 6. Iterate
- Use feedback to improve idea
- Submit revised idea for re-analysis
- Compare with previous analysis results

### Understanding Results

#### Risk Levels

| Level | Meaning | Color | When This Appears |
|-------|---------|-------|------------------|
| **High** | Fundamental flaws likely to cause failure | 🔴 Red | Illegal ideas, no market, zero capital, completely unrealistic |
| **Medium** | Real challenges but viable with right approach | 🟠 Amber | Most solid business ideas, requires mitigation |
| **Low** | Well-thought-out with manageable risks | 🟢 Green | Rare, only very solid plans |

#### Severity Ratings

Each blind spot is rated:
- 🔴 **CRITICAL** - Must address before proceeding
- 🟠 **MODERATE** - Important to consider and mitigate
- 🟢 **MINOR** - Nice to address but not blocking

#### Fatal Flaws

Only included if genuinely fatal (would cause complete failure):
- Missing legal compliance
- Completely unrealistic assumptions
- Fundamental market gaps
- Impossible technical requirements

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

AssumptionX is optimized for Vercel deployment.

#### Option 1: GitHub Integration (Recommended)

1. **Fork the repository** to your GitHub account
2. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
3. **Click "Add New" → "Project"**
4. **Select your forked repository**
5. **Add Environment Variables**:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `OPENROUTER_API_KEY`
6. **Click "Deploy"**

Vercel will automatically redeploy on every git push!

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd clerk-nextjs
vercel

# For production
vercel --prod
```

#### Environment Variables in Vercel

1. Go to **Project Settings** → **Environment Variables**
2. Add all required keys (see [Configuration](#configuration))
3. Redeploy to apply changes

### Deploy to Other Platforms

#### Docker Deployment

Create `Dockerfile` in `clerk-nextjs/`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t assumption-x .
docker run -p 3000:3000 -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=... assumption-x
```

#### Railway.app Deployment

1. Connect GitHub repository to Railway
2. Add environment variables in Dashboard
3. Railway automatically deploys

#### Netlify Deployment

⚠️ **Not recommended** - Netlify works better with static sites. Vercel is optimized for Next.js.

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set"

**Solution:**
1. Create `.env.local` in `clerk-nextjs/` directory
2. Add: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key`
3. Restart dev server: `npm run dev`

#### Issue: "Unauthorized" when submitting analysis

**Solution:**
1. Check if you're signed in (profile button visible?)
2. Verify Clerk is working: Check browser DevTools > Application > Cookies
3. Check `.env.local` has correct Clerk keys
4. Sign out and sign back in

#### Issue: "Daily limit reached" but haven't submitted 10

**Solution:**
1. Check Supabase database - may have test data from development
2. Clear Supabase `analyses` table if testing
3. Wait until next day (limit resets daily at 00:00 UTC)

#### Issue: Analyses not saving to history

**Solution:**
1. Check if Supabase is configured: `SUPABASE_URL` and `SUPABASE_ANON_KEY` set?
2. Verify Supabase `analyses` table exists (see [Installation](#3-environment-configuration))
3. Check Supabase connection: Try querying table directly in Supabase dashboard
4. If not configured, app works fine but doesn't persist data

#### Issue: AI analysis is slow

**Solution:**
- This is normal - LLM inference takes 10-30 seconds
- Try smaller/more specific idea description
- Different models have different speeds (Llama 70B is slower but better quality)

#### Issue: "TypeError: fetch is not defined"

**Solution:**
- This shouldn't happen in Node.js 18+
- Verify Node.js version: `node --version`
- If older, update: `nvm install 18` or [download latest](https://nodejs.org/)

#### Issue: Port 3000 already in use

**Solution:**
```bash
# Use different port
npm run dev -- -p 3001

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

#### Issue: TypeScript errors after modification

**Solution:**
1. Errors are caught at compile time (not runtime)
2. Fix the error in your code
3. Dev server auto-reloads when errors are fixed
4. Check terminal output for specific error message

---

## 🤝 Contributing

Contributions are welcome! Help improve AssumptionX.

### How to Contribute

1. **Fork the repository**
   ```bash
   Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/AssumptionX.git
   cd AssumptionX/clerk-nextjs
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**
   - Follow existing code style
   - Write clear commit messages
   - Add comments for complex logic

5. **Test thoroughly**
   ```bash
   npm run build
   npm run lint
   ```

6. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature: detailed description'
   ```

7. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

8. **Open a Pull Request**
   - Go to original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes
   - Submit PR

### Contribution Guidelines

- ✅ Write TypeScript (no JavaScript)
- ✅ Follow existing code style
- ✅ Add comments for non-obvious code
- ✅ Test your changes before submitting
- ✅ Keep PRs focused on single feature
- ✅ Update README if adding new features
- ❌ Don't commit `.env.local` or sensitive data
- ❌ Don't modify package.json unless necessary

### Ideas for Contributions

- [ ] Add email notifications for analyses
- [ ] Export analysis as PDF
- [ ] Add comparison view for multiple analyses
- [ ] Implement collaborative analysis (team feature)
- [ ] Add more analytical perspectives
- [ ] Improve UI/UX design
- [ ] Add data visualization charts
- [ ] Implement caching for faster results
- [ ] Add support for voice input
- [ ] Create mobile app

---

## 📄 License

This project is open source and available under the **MIT License**.

See [LICENSE](LICENSE) file for details.

### MIT License Summary

You are free to:
- ✅ Use commercially
- ✅ Modify the code
- ✅ Distribute
- ✅ Sublicense

With conditions:
- ⚠️ Include license and copyright notice
- ⚠️ State changes made

---

## 📞 Support

### Getting Help

#### Documentation
- 📖 Read the full [README](#)
- 💻 Check [API Reference](#api-reference)
- 🛠️ See [Troubleshooting](#troubleshooting)

#### Issue Tracker
- 🐛 [Report a bug](https://github.com/LakshmiSagar570/AssumptionX/issues/new?template=bug_report.md)
- 💡 [Request a feature](https://github.com/LakshmiSagar570/AssumptionX/issues/new?template=feature_request.md)
- 💬 [Start a discussion](https://github.com/LakshmiSagar570/AssumptionX/discussions)

#### Contact
- **Author**: [LakshmiSagar570](https://github.com/LakshmiSagar570)
- **Email**: [Check GitHub profile](https://github.com/LakshmiSagar570)
- **Twitter/X**: [Check GitHub profile](https://github.com/LakshmiSagar570)

---

## 🎉 Acknowledgments

AssumptionX is built with:

- **[Next.js](https://nextjs.org/)** - Amazing React framework
- **[Clerk](https://clerk.com/)** - Effortless authentication
- **[Supabase](https://supabase.com/)** - Open-source Firebase alternative
- **[OpenRouter](https://openrouter.ai/)** - Multi-model LLM API
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Vercel](https://vercel.com/)** - Modern deployment platform

Special thanks to everyone who has contributed ideas and feedback!

---

## 📊 Stats

- **Created**: 2026-03-05
- **Latest Update**: 2026-03-05
- **TypeScript**: 100%
- **Language**: TypeScript + React
- **License**: MIT
- **Status**: Active Development ✅

---

<div align="center">

### Made with ❤️ by [LakshmiSagar570](https://github.com/LakshmiSagar570)

[⭐ Star this repo](https://github.com/LakshmiSagar570/AssumptionX) if you found it helpful!

[🚀 Try it live](https://assumption-x.vercel.app)

</div>
