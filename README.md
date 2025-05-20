## Skribble.Space

It might make mindmaps. It might be a glorified notepad. Who knows

---

## Getting Started

To get the project up and running locally, follow these steps:

#### 1. Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```
#### 2. Run the Development Server
To start the development server, use the command:

```bash
npm run dev
```

> [!note]    
> By default, it will expose the application over your network. Meaning it probably isn't safe to use in a public café, etc.
> To disable, comment out the following lines in **vite.config.js**:
> ```js  
> server: {
>    host: '0.0.0.0'
>    port: 5173
> }
> ```
---
## Thanks to:
Adam, who has done all the hard work, purely because I was complaining I couldn't find mindmapping software I liked on iOS. Love you 💜

---

## ✅ TODOs:

- [x] **Gesture Control**
    - [x] Zoom Canvas
    - [ ] Rotate Canvas
    - [x] Move Canvas
- [ ] **Undo Redo**
- [ ] **Text Boxes**
- [ ] **Shapes**
  - [ ] Snap Arrows to Shapes
- [x] **Handwriting**
  - [ ] Snap Arrows to Text areas
    - [ ] Cluster text into zones for snapping
  - [ ] Character recognition for text
- [ ] **Images**
- [ ] **PDFs**
  - [ ] Import
  - [ ] Export
- [ ] **Full Text Search**
- [ ] **PWA**
- [ ] **Offline Storage**
  - [ ] Document storage and organisation
  - [ ] Settings Storage (Such as pen support)
- [x] **Strokes**
  - [ ] Cleaner variable width strokes
- [ ] **Background Customisation**
  - [ ] Grid
  - [ ] Lines
  - [ ] Solid Colour
