# TypeArena - Competitive Typing Platform 🚀⌨️

A modern, feature-rich typing practice and competition platform built with React and Firebase.

![TypeArena](https://img.shields.io/badge/version-1.0.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-integrated-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

- ✅ **50+ Comprehensive Lessons** - From typing fundamentals to advanced programming
- 🔐 **Google Authentication** - Secure sign-in with Firebase Auth
- 📊 **User Profiles** - Detailed statistics, match history, and progress tracking
- 🏆 **Global Leaderboards** - Compete with typists worldwide
- 🎯 **Tournament System** - Create and join public typing tournaments
- 👥 **Real-time Multiplayer** - WebSocket-powered multiplayer typing battles
- 📈 **Progress Analytics** - Track your WPM, accuracy, and improvement over time
- 🎨 **Modern UI** - Beautiful glassmorphic design with smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS v4** - Styling
- **Lucide React** - Icons
- **Firebase SDK** - Authentication & Firestore

### Backend
- **Node.js** - Runtime environment
- **Express** - REST API server
- **WebSocket (ws)** - Real-time multiplayer
- **Firebase Admin SDK** - Server-side Firebase operations

### Database & Auth
- **Firebase Firestore** - NoSQL database
- **Firebase Authentication** - Google OAuth
- **Firebase Analytics** - Usage tracking

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Firebase project (see setup guide below)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd TypingArena
```

### 2. Install Dependencies

**Client:**
```bash
cd client
npm install
```

**Server:**
```bash
cd server
npm install
```

### 3. Firebase Setup

Follow the detailed [Firebase Setup Guide](./docs/firebase_setup.md) to:
1. Enable Google Authentication
2. Create Firestore Database
3. Configure Security Rules
4. Create Database Indexes

### 4. Environment Variables

**Server** (`server/.env`):
```env
PORT=3000
NODE_ENV=development
```

**Client** - Firebase config is already in `client/src/firebase/firebase.js`

### 5. Run the Application

**Start Server:**
```bash
cd server
npm run dev
```

**Start Client:**
```bash
cd client
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 📁 Project Structure

```
TypingArena/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── data/          # Lesson data
│   │   ├── firebase/      # Firebase configuration
│   │   ├── pages/         # Page components
│   │   ├── services/      # Firebase services
│   │   └── App.jsx        # Main app component
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/       # Firebase Admin config
│   │   ├── game/         # Game logic (Room, RoomManager)
│   │   └── index.js      # Express & WebSocket server
│   └── package.json
│
└── README.md
```

## 🎮 Usage

### For Users

1. **Sign In** - Click "Sign In" and use your Google account
2. **Practice** - Choose from 50+ lessons in Single Player mode
3. **Compete** - Join tournaments or challenge friends in multiplayer
4. **Track Progress** - View your stats and match history in your profile
5. **Climb Leaderboards** - See how you rank globally

### For Developers

**Adding New Lessons:**
Edit `client/src/data/lessons.js` and add to the appropriate category.

**Customizing UI:**
Styles are in TailwindCSS. Edit component files or `tailwind.config.js`.

**Firebase Rules:**
Security rules are in Firebase Console. See the setup guide.

## 💰 Google AdSense Integration

### Required Pages (Already Created)
- ✅ Privacy Policy - `/privacy`
- ✅ About Us - `/about`
- ✅ Contact - `/contact`
- ✅ Terms of Service - `/terms`

### AdSense Setup Steps

1. **Apply for AdSense**
   - Visit [Google AdSense](https://www.google.com/adsense)
   - Click "Get Started"
   - Enter your website URL (after deployment)
   - Fill out the required information

2. **Add AdSense Code**
   
   Add this to `client/index.html` in the `<head>` section:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
        crossorigin="anonymous"></script>
   ```
   *(Replace XXXXXXXXXX with your AdSense publisher ID)*

3. **Create Ad Units**
   
   In `client/src/components/AdBanner.jsx`:
   ```jsx
   import React, { useEffect } from 'react';

   const AdBanner = () => {
     useEffect(() => {
       try {
         (window.adsbygoogle = window.adsbygoogle || []).push({});
       } catch (e) {
         console.error('AdSense error:', e);
       }
     }, []);

     return (
       <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXX"
            data-ad-slot="YYYYYYYYYY"
            data-ad-format="auto"
            data-full-width-responsive="true">
       </ins>
     );
   };

   export default AdBanner;
   ```

4. **Place Ads in Layout**
   
   Add `<AdBanner />` in key locations like:
   - Between lesson selection and typing area
   - Sidebar of leaderboards
   - After tournament results

### AdSense Approval Tips

✅ **Quality Content** - 50+ unique lessons and educational content  
✅ **Required Pages** - Privacy Policy, About, Contact, Terms ✓  
✅ **Original Content** - Custom typing platform, not copied  
✅ **Traffic** - Get some organic traffic before applying  
✅ **Navigation** - Clear menu and footer navigation ✓  
✅ **Mobile Friendly** - Fully responsive design ✓  

## 🚀 Deployment

### Option 1: Vercel (Recommended for Frontend)

**Frontend:**
```bash
cd client
npm run build
vercel deploy
```

**Backend:** Deploy to Vercel Functions or separate service

### Option 2: Firebase Hosting

```bash
cd client
npm run build
firebase deploy --only hosting
```

**Backend:** Deploy to Cloud Run or other service

### Environment Variables for Production

Make sure to set these in your deployment platform:
- Firebase config (already in code)
- Server URL for client API calls
- AdSense publisher ID

## 📊 Database Schema

See [Firestore Schema](./docs/database_schema.md) for detailed information.

## 🔒 Security

- Firebase Authentication for user management
- Firestore Security Rules for data protection
- Input validation on both client and server
- HTTPS required in production
- Rate limiting on API endpoints

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 📞 Support

- Email: support@typearena.com
- Contact Form: http://localhost:5173/contact
- Issues: GitHub Issues

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Discord bot integration
- [ ] Custom lesson creator
- [ ] AI-powered difficulty adjustment
- [ ] Voice commands
- [ ] Accessibility improvements

## 💎 Acknowledgments

- Built with ❤️ using React and Firebase
- Icons by Lucide
- Design inspired by modern web apps
- Community feedback and contributions

---

**Made with 💻 by the TypeArena Team**

Start typing faster today! 🚀⌨️
