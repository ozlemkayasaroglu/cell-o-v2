# Cell-o: Çocuklar için Bilimsel Deneyler Uygulaması

> **Bu uygulamayı kızım D. başta olmak üzere tüm meraklı çocuklara ithaf ediyorum.**

Bu proje, çocuklar için Türkçe, eğlenceli ve erişilebilir bilimsel deneyler sunan bir React + TypeScript uygulamasıdır. Kullanıcılar giriş/üye olma olmadan, ilerlemelerini ve profil bilgilerini tarayıcıda (localStorage) saklar.

## Özellikler

- **Türkçe ve çocuk dostu arayüz**
- **Deney kartları ve haftalık görevler**
- **Tamamlanan deneyler, XP ve rozet sistemi**
- **Yaş grubuna göre erişilebilirlik (4-7 yaş için sesli okuma)**
- **Kullanıcı profili, renkli takma ad ve avatar seçimi**
- **Tüm ilerleme ve profil bilgileri localStorage'da saklanır**
- **Giriş/üye olma yok, kullanıcı kaldığı yerden devam eder**
- **Modern ve hızlı arayüz (Vite, Tailwind CSS)**
- **SEO ve performans optimizasyonları**

## Kullanım

1. Projeyi klonlayın:
   ```sh
   git clone <repo-url>
   cd cello
   ```
2. Bağımlılıkları yükleyin:
   ```sh
   npm install
   ```
3. Geliştirme sunucusunu başlatın:
   ```sh
   npm run dev
   ```
4. Uygulamayı açın: [http://localhost:5173](http://localhost:5173)

## Veri Saklama

- Kullanıcı profili, tamamlanan deneyler ve tüm ilerleme **localStorage**'da saklanır.
- Kullanıcı tekrar siteye girdiğinde, kaldığı yerden devam eder.
- Farklı tarayıcı veya cihazda ya da localStorage temizlenirse veriler sıfırlanır.

## Erişilebilirlik ve Yaş Grupları

- 4-5 ve 6-7 yaş grubu için deney kartlarında ve açıklamalarda sesli okuma (hoparlör ikonu) bulunur.
- 8+ yaş için bu özellik gizlenir.

## Geliştirici Notları

- Proje Vite, React, TypeScript ve Tailwind CSS ile geliştirilmiştir.
- Kodda tüm hook'lar React kurallarına uygun şekilde sıralanmıştır.
- SEO ve performans için semantic HTML, lazy loading ve meta etiketler uygulanmıştır.

## Katkı ve Lisans

Katkıda bulunmak için PR gönderebilirsiniz. Lisans bilgisi için LICENSE dosyasına bakınız.

Aşağıda orijinal Vite/React template notları yer almaktadır:

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
