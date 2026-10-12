# Expoguaviare Demo — temporal feria

4 módulos funcionales, 100% estático, offline. Sin build.

## Módulos
- **2 AgroMarket (img1-2):** catálogo yuca/cacao/asaí, carrito, pago simulado, QR pedido.
- **3 IA Rupestre (img1-3):** sube foto, análisis simulado Teachable Machine, historia Chiribiquete.
- **4 Ganadero (img1-4):** chapeta QR, peso, vacunas, alertas vencimiento.
- **1 PuntoGo POS (img2-1):** vende online/offline, inventario, fiados, ticket QR.

## Correr (elige una)
```powershell
# opción 1: doble clic en index.html
# opción 2:
python -m http.server 8080
# abrir http://localhost:8080
# opción 3:
npx serve .
```

## Para el instructor (guion 3 min)
1. PuntoGo: cambia a Offline, cobra un tinto + empanada, muestra ticket + fiado.
2. AgroMarket: agrega cacao al carrito, paga, muestra QR del pedido.
3. Ganadero: registra G-042 / 420kg, muestra alerta vacuna.
4. IA Rupestre: sube foto, analiza, lee historia.

## Subir a GitHub temporal
```powershell
gh repo create expoguaviare-demo --public --source=. --push
# o privado:
# gh repo create expoguaviare-demo --private --source=. --push
```

Borrar después de la feria: GitHub → Settings → Delete repository.
