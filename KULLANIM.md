# Dört Bucak Tur — Kurulum ve Kullanım Kılavuzu

Bu proje, Dört Bucak Tur için hazırlanmış hac–umre tanıtım sitesi ve yönetim panelidir.
Sitede rezervasyon veya ödeme yoktur; ziyaretçiler telefon ve WhatsApp'a yönlendirilir.

> Umre fiyatları 14 günlük programlarda 4 kişilik oda kişi başıdır. 3 ve 2 kişilik
> odalarda 75 $, Ramazan umrelerinde 100 $ eklenir. Çıkış tarihini yönetim panelinden güncelleyin.
>
> **Görseller gerçek fotoğraftır** (Kâbe ve Mescid-i Nebevî). Unsplash'ten alınmıştır;
> Unsplash lisansı ticari kullanıma izin verir ve atıf zorunlu değildir. Kendi tur
> fotoğraflarınız hazır olduğunda yönetim panelinden değiştirmeniz önerilir.

## 1) Kurulum

Gereksinim: Node.js 18 veya üzeri.

```bash
npm install
cp .env.example .env.local   # değerleri düzenleyin (aşağıya bakın)
npm run build
npm start                    # http://localhost:3000
```

Geliştirme için: `npm run dev`

### .env.local ayarları

| Değişken | Açıklama |
|---|---|
| `SESSION_SECRET` | Oturum çerezini imzalayan gizli anahtar. **Mutlaka** uzun ve rastgele bir değerle değiştirin. |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Veritabanı ilk oluşturulurken açılacak yönetici hesabı. Şifre veritabanında bcrypt ile saklanır. |
| `SITE_URL` | Canlı alan adınız (sitemap ve Open Graph için). |

Yönetici hesabı yalnızca veritabanı **ilk kez** oluşturulurken açılır. Şifreyi sonradan
değiştirmek için veritabanını sıfırlayıp (içerik de silinir!) yeniden başlatabilir
veya veritabanındaki `admins` tablosunu güncelleyebilirsiniz.

## 2) Firma iletişim bilgileri

Telefon, WhatsApp, e-posta, adres, Instagram ve harita bağlantısı `lib/site.js`
dosyasındadır. Yer tutucuları gerçek bilgilerle değiştirin:

- `whatsapp`: uluslararası biçimde, yalnızca rakam — örn. `905XXXXXXXXX`.
  Numara girilene kadar WhatsApp düğmeleri iletişim sayfasına yönlendirir.
- `mapLink`: Google Maps paylaşım bağlantısı.

## 3) Yönetici girişi

- Adres: `/admin` (giriş ekranı: `/admin/giris`)
- Tüm `/admin` sayfaları oturum doğrulamasıyla korunur; oturum 8 saat sonra düşer.

## 4) Paket ekleme ve düzenleme

**Paketler** sekmesinde:

- **Yeni paket ekle** ile formu doldurun. Paket adını yazınca bağlantı (slug), SEO başlığı
  ve açıklaması otomatik önerilir; dilediğiniz gibi değiştirebilirsiniz. Türkçe karakterler
  bağlantıda otomatik dönüştürülür (ör. "Gençlik Umresi" → `genclik-umresi`).
- Fiyat alanlarını **boş bırakırsanız** sitede "Fiyat bilgisi için iletişime geçin" görünür;
  asla 0 gösterilmez.
- Liste alanlarında (dahil hizmetler, program akışı vb.) **"+ Yeni madde ekle"** ile satır
  ekleyin, ⠿ simgesinden **sürükleyerek** sıralayın.
- Görseller yüklenirken otomatik olarak küçültülür ve **WebP** biçimine dönüştürülür.
- Liste ekranından paketi **yayınla/pasif yap**, **öne çıkar** (ana sayfada görünür),
  **çoğalt**, **sil** (onay istenir) ve ↑↓ ile sıralayabilirsiniz.

## 5) Slider değiştirme

**Slider** sekmesinde her slayt için masaüstü ve mobil görsel, üst başlık, ana başlık,
açıklama, düğme metni/bağlantısı, sıra ve aktif/pasif durumu düzenlenir. Pasif slaytlar
sitede görünmez; hiç aktif slayt yoksa slider alanı tamamen gizlenir.

## 6) Teknik notlar

- **Altyapı:** Next.js (App Router, sunucu tarafı işleme) + Turso veritabanı.
  Veritabanı ilk çalıştırmada otomatik oluşturulur ve temsili içerikle doldurulur.
- **Arayüz kütüphaneleri:** slider için `embla-carousel-react` (+ `embla-carousel-autoplay`),
  ikonlar için `lucide-react`. Animasyon kütüphanesi kullanılmaz; belirme efektleri
  CSS ile yapılır ve yalnızca `<html class="js">` varken devreye girer — böylece
  JavaScript çalışmazsa içerik gizlenmiş olmaz.
- **Güvenlik:** şifreler bcrypt ile saklanır; oturum çerezi HMAC-SHA256 ile imzalanır,
  `httpOnly` ve üretimde `secure`'dur; yükleme ucu oturum ister; formlarda bal küpü
  (honeypot) spam koruması vardır; silmelerde onay ekranı gösterilir.
- **SEO:** her paketin kendi bağlantısı, başlık/açıklaması, Open Graph etiketleri,
  `sitemap.xml`, `robots.txt`, paketlerde TouristTrip ve SSS sayfasında FAQPage
  yapılandırılmış verisi bulunur.
- **Performans:** yazı tipleri yerelde barındırılır, görseller `next/image` ile
  AVIF/WebP servis edilir, gereksiz istemci JavaScript'i yoktur.
- İletişim formu, mesajı WhatsApp'ta hazırlayarak gönderir (e-posta sunucusu gerekmez).

## 7) Yayına alma kontrol listesi

- [ ] `.env.local` içindeki `SESSION_SECRET` ve yönetici şifresi değiştirildi
- [ ] `lib/site.js` içindeki tüm yer tutucular gerçek bilgilerle değiştirildi
- [ ] Umre çıkış tarihleri ve slider görselleri güncellendi
- [ ] `SITE_URL` canlı alan adına ayarlandı
- [ ] Site HTTPS ile yayınlanıyor (oturum çerezi için gerekli)
- [ ] `data/` klasörünün düzenli yedeği alınıyor

Not: Vize, pasaport, aşı ve resmî seyahat şartları değişebilir; sitedeki bilgilendirme
metinleri bu uyarıyı içerir. TÜRSAB, resmî yetki vb. bilgiler doğrulanmadan siteye
eklenmemiştir; belgeleriniz hazır olduğunda ilgili metinleri kendiniz ekleyebilirsiniz.
