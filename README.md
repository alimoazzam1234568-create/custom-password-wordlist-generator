<div align="center">

# ⚒️ WordForge

### Custom Password Wordlist Generator

**Generate customized password wordlists with flexible character sets, word placement, case variations, and leetspeak options.**

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status">
</p>

</div>

---

## 📖 About WordForge

**WordForge** is a modern, browser-based password wordlist generator built with React and TypeScript.

It allows users to generate customized wordlists using a base word, configurable character sets, password length settings, and optional variations. The application provides an interactive interface for configuring generation options, searching results, copying generated candidates, and exporting wordlists as text files.

WordForge is designed for educational purposes, authorized security assessments, password-policy demonstrations, and cybersecurity lab environments.

### 🎯 Why WordForge?

- Configure wordlist generation without complicated commands.
- Customize character sets and password patterns.
- Generate combinations or specify a custom generation limit.
- Search, browse, copy, and export results from one interface.
- Explore how predictable password patterns can affect password security.

## ✨ Features

### 🔤 1. Custom Base Word

Enter a base word to use as the foundation for your generated candidates.

Examples:

- `admin`
- `wordforge`
- `example`

### 📏 2. Password Length Control

Choose the desired total password length using the built-in slider.

**Available range:** 2–16 characters.

### 🔡 3. Character Set Selection

Choose which character groups to include in generated candidates.

| Character Set | Examples |
|---|---|
| Lowercase | `abcdefghijklmnopqrstuvwxyz` |
| Uppercase | `ABCDEFGHIJKLMNOPQRSTUVWXYZ` |
| Numbers | `0123456789` |
| Symbols | `!@#$%^&*` |
| Special Characters | Additional punctuation and special symbols |

### 📍 4. Word Position Options

Configure where the base word should appear.

- **Prefix:** Place the base word at the beginning.
- **Suffix:** Place the base word at the end.
- **Both:** Generate candidates using both placement styles.

### ⚙️ 5. Generation Modes

**All Combinations**

Systematically generates possible combinations according to the selected configuration, with a maximum result cap of 500,000.

**Custom Limit**

Specify the number of unique candidates to generate.

Quick-select limits include:

- 100
- 500
- 1,000
- 1,500
- 5,000
- 10,000

The actual number of results may depend on the available unique combinations and generation settings.

### 🔄 6. Case Mutations

Enable case variations to explore different capitalization patterns.

Examples:

- `admin`
- `Admin`
- `ADMIN`
- `aDmin`

The exact variants depend on the base word and implementation.

### 💻 7. Leetspeak Variations

Enable optional leetspeak substitutions that replace selected letters with visually similar numbers or symbols.

Examples of common substitutions include:

| Letter | Example Substitution |
|---|---|
| A | `4` or `@` |
| E | `3` |
| I | `1` |
| O | `0` |
| S | `5` |

Available substitutions depend on the generator's implementation.

### 📋 8. Results Management

Work with generated results using the built-in results panel.

- Browse generated candidates.
- Navigate through paginated results.
- Display up to 100 entries per page.
- Search and filter results.
- Copy individual candidates.
- Copy the complete result list.
- Export results as a `.txt` file.

### 📊 9. Generation Statistics

View generation information, including result counts, elapsed time, and generation speed where available.

### 🎨 10. Modern User Interface

WordForge includes:

- A dark interface.
- Gradient visual accents.
- Interactive controls.
- Animated visual elements.
- Responsive layouts.

---

## 🛠️ Technology Stack

WordForge uses the following technologies:

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type-safe application development |
| Vite | Development server and build tooling |
| CSS | Styling and responsive layouts |
| Lucide React | Interface icons |
| FileSaver.js | File-download support |

---

## 📋 Requirements

Before installing WordForge, make sure you have:

- **Node.js** installed.
- **npm**, included with Node.js.
- **Git**, if you want to clone the repository.
- A modern web browser.

Official resources:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Installation

Follow these steps to run WordForge locally.

### Step 1: Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/alimoazzam1234568-create/custom-password-wordlist-generator.git
```

### Step 2: Open the Project Directory

```bash
cd custom-password-wordlist-generator
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Development Server

```bash
npm run dev
```

Vite will display a local development URL in your terminal. Open that address in your browser.

The address is commonly:

```text
http://localhost:5173
```

### Step 5: Build for Production

To create a production build, run:

```bash
npm run build
```

The generated production files will typically be available in the `dist/` directory.

### Step 6: Preview the Production Build

```bash
npm run preview
```

Follow the local URL displayed in your terminal to preview the production build.

---

## 📚 How to Use WordForge

1. Open WordForge in your browser.
2. Enter your desired base word.
3. Select the password length.
4. Choose the character sets you want to use.
5. Configure the base word's position.
6. Select a generation mode.
7. Set a custom generation limit if required.
8. Enable case mutations or leetspeak options if desired.
9. Start generating candidates.
10. Browse or search the results.
11. Copy individual candidates or export the complete list as a text file.

**Tip:** Begin with a small generation limit to understand the output before creating larger wordlists.

---

## 📁 Project Structure

The main application files are organized approximately as follows:

```text
custom-password-wordlist-generator/
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
│
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    │
    ├── components/
    │   ├── CharSetToggle.tsx
    │   └── PasswordPreview.tsx
    │
    └── utils/
        ├── cn.ts
        └── generator.ts
```

### Important Files

| File | Description |
|---|---|
| `src/App.tsx` | Main application interface and state management |
| `src/utils/generator.ts` | Wordlist generation logic |
| `src/components/CharSetToggle.tsx` | Character-set selection component |
| `src/components/PasswordPreview.tsx` | Password candidate preview component |
| `src/index.css` | Global styling |
| `src/main.tsx` | React application entry point |
| `index.html` | Main HTML document |
| `package.json` | Project dependencies and scripts |
| `vite.config.ts` | Vite configuration |

*Note: The structure above reflects the supplied project information. Update it if the repository changes.*

---

## 📜 Available Commands

Run these commands from the project directory.

| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build |

---

## 🔐 Security and Responsible Use

WordForge is intended for legitimate educational and defensive cybersecurity activities.

### Responsible Use Guidelines

- Only use generated wordlists in environments you own or have explicit permission to assess.
- Do not use the application to attempt unauthorized access to accounts or systems.
- Never upload or share real users' passwords.
- Treat generated wordlists as potentially sensitive files.
- Store exported files securely and remove them when no longer needed.
- Use unique, strong passwords and a reputable password manager for real accounts.

### Important Security Information

WordForge generates candidate strings. It does not guarantee that a generated candidate is valid, secure, or associated with any particular account.

A wordlist generator is not a password-strength auditing system, and generating more candidates does not automatically improve security.

For defensive security assessments, use authorized test environments and follow the rules established by the system owner.

---

## 🧪 Testing and Verification

After installing dependencies, build the project:

```bash
npm run build
```

This checks whether the application can be built for production using the project's configured build process.

For future development, consider adding automated tests for:

- Password length validation.
- Character-set selection.
- Base word placement.
- Case mutation behavior.
- Leetspeak substitutions.
- Duplicate prevention.
- Generation limits.
- Empty or invalid input.
- Text-file exports.

---

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome.

### How to Contribute

1. Fork this repository.
2. Create a feature branch.

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make your changes.
4. Test your changes locally.

   ```bash
   npm run build
   ```

5. Commit your changes.

   ```bash
   git add .
   git commit -m "Describe your changes"
   ```

6. Push your branch.

   ```bash
   git push origin feature/your-feature
   ```

7. Open a Pull Request describing your changes.

When reporting bugs, include steps to reproduce the problem and relevant browser or Node.js versions. Never include real passwords or sensitive wordlists in issues.

---

## 🛣️ Future Improvements

Potential improvements for future versions include:

- Automated unit and integration tests.
- More export formats and configuration options.
- Improved accessibility and keyboard navigation.
- Custom character pools and exclusion rules.
- Additional generation statistics.
- Better handling of large result sets.
- A password-security educational guide.

These are proposed ideas and are not necessarily implemented in the current version.

---

## 📄 License

**No license has been specified in this documentation.**

If the repository does not contain a `LICENSE` file, users should not assume that they have permission to redistribute, modify, or commercially use the project.

The repository owner can add an appropriate license to define how the software may be used.

---

## 👨‍💻 Author

**GitHub:** [@alimoazzam1234568-create](https://github.com/alimoazzam1234568-create)

**Project Repository:** [Custom Password Wordlist Generator](https://github.com/alimoazzam1234568-create/custom-password-wordlist-generator)

---

<div align="center">

### ⚒️ WordForge

**Flexible wordlist generation for authorized security testing and cybersecurity education.**

⭐ If you find this project useful, consider giving the repository a star!

</div>
