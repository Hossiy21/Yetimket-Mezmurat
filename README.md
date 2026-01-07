# የጥምቀት መዝሙሮች ስብስብ | Bole Debre Salem Mezmur Collection

A modern, responsive web application for Ethiopian Orthodox Tewahedo Church mezmur (hymns) collection from Bole Debre Salem Medhane'Alem Church.

## ✨ Features

- 🎵 **Complete Mezmur Collection**: Browse through authentic Ethiopian Orthodox hymns
- 🔍 **Advanced Search**: Full-text search in Amharic and English
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🌓 **Dark/Light Themes**: Beautiful Orthodox-themed color schemes
- ⭐ **Favorites System**: Save and organize your favorite mezmurs
- 🎨 **Professional UI**: Modern design with Ethiopian Orthodox aesthetic
- 📖 **Reading View**: Clean, focused reading experience
- 🔄 **Autocomplete**: Smart suggestions while searching
- 🖼️ **Custom Imagery**: Integrated church imagery and branding

## 🛠️ Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Custom Ethiopian fonts (Ben, Kefa)
- **Deployment**: GitHub Pages

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/orthodox-mezmur---bole-debre-salem.git
cd orthodox-mezmur---bole-debre-salem
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 📦 Build & Deployment

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

1. Install gh-pages (if not already installed):
```bash
npm install --save-dev gh-pages
```

2. Update your `package.json` with the deployment script:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy to GitHub Pages:
```bash
npm run deploy
```

## 🏗️ Project Structure

```
orthodox-mezmur---bole-debre-salem/
├── public/
│   ├── fonts/
│   │   ├── Benaiah.otf
│   │   ├── Benaiah.ttf
│   │   ├── Kefa-Regular.ttf
│   │   └── Keffa.ttf
│   └── img/
│       └── images.jpeg
├── src/
│   ├── App.tsx          # Main application component
│   ├── data.ts          # Mezmur data collection
│   ├── types.ts         # TypeScript type definitions
│   └── index.tsx        # Application entry point
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## 🎨 Features Overview

### Main Collection View
- Grid layout with beautiful mezmur cards
- Real-time search functionality
- Theme toggle (light/dark mode)
- Favorites management
- Responsive design

### Reading View
- Clean, distraction-free reading experience
- Sidebar with autocomplete search
- Navigation between mezmurs
- Font size adjustment
- Copy to clipboard functionality

### Search & Discovery
- Full-text search across titles and lyrics
- Amharic language support
- Real-time filtering
- No results state with helpful messaging

## 🌍 Language Support

- **Primary**: Amharic (አማርኛ)
- **Secondary**: English
- **Fonts**: Custom Ethiopian fonts (Ben for headings, Kefa for body text)

## 🎯 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari/Chrome

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Bole Debre Salem Medhane'Alem Church
- Ethiopian Orthodox Tewahedo Church
- All contributors and supporters

## 📞 Contact

- **Developer**: Hossiy Dev
- **Telegram**: [@hossiydev](https://t.me/hossiydev)
- **GitHub**: [Your GitHub Profile]

---

*"ቦሌ ደብረ ሳሌም መድኃኔዓለም መጥምቁ ቅዱስ ዮሐንስ ወአቡነ አረጋዊ ካቴድራል ፈለገ ዮርዳኖስ ሰንበት ትምህርት ቤት"*
