# 🎡 Fortune Wheel

An interactive, colorful Fortune Wheel app built in a fun, kid-friendly style. Spin the wheel to randomly select a winner from your list of participants!

**Live demo:** [https://moral-together.github.io/FortuneWheel/](https://moral-together.github.io/FortuneWheel/)

---

## ✨ Features

- 🎨 **Vibrant design** — bright colors, glowing effects, animated starry background
- 🎡 **Smooth spin animation** — motion blur, speed-based glow, ease-out deceleration
- 🏆 **Winner celebration** — confetti, fireworks, winning segment pulse animation
- 🔊 **Sound effects** — spin tick, whoosh on launch, winner jingle (Web Audio API, no files needed)
- 👥 **Participant management** — add, remove, reset participants with smooth animations
- ✂️ **Two game modes:**
  - **Elimination** — winner is removed from the wheel after each spin
  - **Repeat** — winner stays on the wheel
- 🌍 **Multilingual UI** — English, Russian, Hebrew (with full RTL layout support)
- 📜 **Win history** — tracks all winners of the current session
- 💾 **Session storage** — data persists while the tab is open, resets on close (no database needed)
- 📱 **Responsive** — works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + Vite | UI framework and build tool |
| Canvas API | Wheel rendering and animation |
| Web Audio API | Sound effects (no audio files) |
| Framer Motion | UI animations (modals, lists) |
| sessionStorage | In-session data persistence |
| gh-pages | GitHub Pages deployment |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & run locally

```bash
git clone https://github.com/Moral-Together/FortuneWheel.git
cd FortuneWheel
npm install
npm run dev
```

Open [http://localhost:5173/FortuneWheel/](http://localhost:5173/FortuneWheel/)

### Build for production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Wheel.jsx           # Canvas wheel with animation
│   ├── SpinButton.jsx      # Launch button
│   ├── ParticipantPanel.jsx # Add/remove participants
│   ├── WinnerModal.jsx     # Winner announcement + confetti
│   ├── HistoryLog.jsx      # Session win history
│   ├── ModeToggle.jsx      # Elimination / Repeat toggle
│   └── LanguageSelector.jsx # EN / RU / HE switcher
├── hooks/
│   ├── useWheel.js         # Spin logic, winner calculation
│   ├── useSound.js         # Web Audio API sounds
│   └── useSession.js       # sessionStorage persistence
├── context/
│   └── LangContext.jsx     # i18n context provider
├── i18n/
│   └── translations.js     # EN, RU, HE translations
└── utils/
    ├── colors.js           # Segment color palette
    └── wheelDraw.js        # Canvas drawing functions
```

---

## 🌍 Supported Languages

| Language | Code | Direction |
|----------|------|-----------|
| English  | `en` | LTR (default) |
| Russian  | `ru` | LTR |
| Hebrew   | `he` | RTL |

---

## 🏢 About

This project was created by **[Moral Together](https://github.com/Moral-Together)** — a non-profit organization (NPO) dedicated to connecting communities and promoting shared values.

> *"Connecting for Godswill"*

Fortune Wheel is a free, open-source tool available for anyone to use, modify, and distribute freely.

---

## 📄 License

This project is licensed under the **MIT License** — free for personal and commercial use, modification, and distribution.

```
MIT License

Copyright (c) 2025 Moral Together

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
