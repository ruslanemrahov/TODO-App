# Secure Todo App - XSS Security Study

Vanilla JavaScript ilə hazırlanmış todo tətbiqi. Əsas məqsəd: XSS və JavaScript təhlükəsizlik zəifliklərini praktik öyrənmək.

## Nə Etdim?

1. Əvvəlcə zəif kod yazdım (innerHTML istifadə)
2. Müxtəif XSS hücumlarını test etdim
3. 20+ təhlükəsizlik layeri əlavə etdim
4. İndi heç bir XSS mümkün deyil

## Təhlükəsizlik Xüsusiyyətləri

- `textContent` istifadəsi (innerHTML yox)
- 21 XSS pattern detection
- Unicode homoglyph bloklama
- HTML entity escape
- Input validation və sanitization
- LocalStorage təhlükəsizliyi
- Double normalization check

## Bloklanmış Hücumlar

```javascript
<script>alert(1)</script>           // Classic XSS
<img src=x onerror="alert(1)">      // Event handler
javascript:alert(1)                  // Protocol
<scrіpt>alert(1)</scrіpt>           // Cyrillic bypass
data:text/html;base64,...            // Data URL
&#60;script&#62;                     // HTML entity
＜script＞                           // Fullwidth Unicode
```

## Texnologiyalar

- Vanilla JavaScript (heç bir framework)
- HTML5 & CSS3
- LocalStorage
- DOM API

## Quraşdırma

```bash
git clone https://github.com/username/secure-todo-app.git
cd secure-todo-app
```

Brauzerdə `index.html` açın - hazırdır!

## Struktur

```
├── index.html    # HTML
├── style.css     # Dizayn
└── script.js     # Təhlükəsizlik + Məntiq
```

## Öyrənmə Məqsədi

Bu layihə XSS və JavaScript təhlükəsizliyini praktik anlamaq üçün hazırlanıb. Real production tətbiqlərində əlavə server-side validation və CSP header-lər lazımdır.

---
