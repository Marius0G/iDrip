# 💧 iDrip - AI Personal Stylist & Virtual Wardrobe

> Proiect realizat pentru cursul de Medii de Dezvoltare Software.

**iDrip** este o aplicație web mobile-first care funcționează ca o garderobă virtuală inteligentă. Utilizatorii își pot încărca poze cu propriile haine, iar cu ajutorul Inteligenței Artificiale, aplicația generează outfituri complete. Mai mult, iDrip recomandă piese vestimentare noi care se potrivesc cu stilul și bugetul utilizatorului, completând astfel garderoba existentă.

## ✨ Funcționalități Principale

* 👗 **Garderobă Digitală (Virtual Closet):** Încărcarea și gestionarea pieselor vestimentare pe care utilizatorul le deține deja.
* 🧠 **AI Outfit Generator:** Crearea automată de ținute din hainele existente.
* 🛍️ **Recomandări Personalizate:** Sugestii de achiziții noi (Smart Shopping) bazate pe stilul preferat și o limită de buget setată de utilizator.
* 🎨 **UI/UX Premium:** Design minimalist, alb-negru, cu efecte de "glassmorphism" (Apple-like style) și colțuri rotunjite, optimizat pentru experiența pe telefon (mobile-first).

## 🛠️ Tehnologii Folosite (Frontend)

Acest prototip se concentrează pe interfața cu utilizatorul (UI/UX) și arhitectura frontend:

* **Framework:** [React](https://reactjs.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Limbaj:** [TypeScript](https://www.typescriptlang.org/)
* **Stilizare:** [Tailwind CSS](https://tailwindcss.com/)
* **Componente UI:** [shadcn/ui](https://ui.shadcn.com/)

## 📂 Structura Proiectului

Proiectul folosește o arhitectură curată, bazată pe componente reutilizabile:

```text
/
├── components/     # Componente React reutilizabile (butoane, carduri, modale)
├── pages/          # Ecranele principale ale aplicației (Dashboard, Generator, etc.)
├── lib/            # Funcții utilitare și fișiere de configurare
├── styles/         # Fișiere CSS globale (inclusiv Tailwind setup)
└── assets/         # Imagini statice și iconițe (mock data)