# Todo App

Sadə və təhlükəsiz todo tətbiqi - Vanilla JavaScript ilə hazırlanmışdır.

## Xüsusiyyətlər

- Todo əlavə et, işarələ və sil
- LocalStorage ilə avtomatik saxlama
- Modern və responsive dizayn
- XSS hücumlarından qorunma
- Sürətli və yüngül (xarici kitabxana yoxdur)

## Quraşdırma

```bash
git clone https://github.com/username/todo-app.git
cd todo-app
```

Faylları brauzerdə açın - heç bir əlavə konfiqurasiya lazım deyil!

## Fayl Strukturu

```
todo-app/
├── index.html    # HTML strukturu
├── style.css     # Dizayn və animasiyalar
└── script.js     # Əsas məntiq
```

## İstifadə

1. **Todo əlavə et**: Input-a yazın və Enter basın
2. **İşarələ**: Checkbox-a klikləyin
3. **Sil**: Zibil qutusu ikonuna klikləyin

## Təhlükəsizlik

XSS hücumlarından qorunma üçün:
- `textContent` istifadə edilir (`innerHTML` yox)
- DOM API ilə elementlər yaradılır
- İstifadəçi daxiletmələri HTML kimi render edilmir

## Texnologiyalar

- **HTML5** - Struktur
- **CSS3** - Dizayn (gradient, animasiyalar, responsive)
- **JavaScript ES6+** - Məntiq
- **LocalStorage** - Data saxlama

## Dizayn

**Rəng palitrası:**
- Qaranlıq mavi arxa fon
- Yaşıl-mavi (#00ffc4) vurğu rəngi
- Smooth animasiyalar və hover effektləri

**Responsive:**
- Desktop və mobil versiyalar
- Mobile-də düymə tam genişlikdə

## Lisenziya

This project is for educational purposes and is open source.
