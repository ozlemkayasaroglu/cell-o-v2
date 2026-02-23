import { useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FEFB]">
      <div className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-[#14B8A6] hover:text-[#0F766E] font-semibold flex items-center gap-2 transition-colors"
          >
            ← Geri Dön
          </button>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-8 font-baloo">
            Gizlilik Politikası
          </h1>

          <div className="space-y-6 text-[#475569]">
            <section>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
                Veri Toplama ve Kullanımı
              </h2>
              <p className="leading-relaxed">
                Bu uygulama hiçbir kişisel veri toplamaz. İstekli olarak verilen
                bilgiler (isim, avatar seçimi vb.) yalnızca cihazınızda yerel
                olarak saklanır.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
                Veri Depolama
              </h2>
              <p className="leading-relaxed mb-2">Tüm kullanıcı verileri:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Cihazınızda yerel olarak saklanır</li>
                <li>
                  localStorage ve AsyncStorage kullanılarak güvenli bir şekilde
                  depolanır
                </li>
                <li>Sunucuya hiçbir veri gönderilmez</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Reklam</h2>
              <p className="leading-relaxed mb-2">
                Uygulama içi reklamlar gösterilebilir. Bu reklamlar:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Google AdMob aracılığıyla gösterilir</li>
                <li>Çocukların gizlilik haklarına uygun olarak seçilmiştir</li>
                <li>İnternet bağlantısı gerektirir</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
                Çocukların Gizliliği
              </h2>
              <p className="leading-relaxed mb-2">Bu uygulama:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>13 yaşından büyük kullanıcılar içindir</li>
                <li>
                  Çocuklara yönelik olmayan, bilimsel ve eğitici içerik içerir
                </li>
                <li>Hiçbir çocuk verisi toplamaz veya saklamaz</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
                Dış Linkler
              </h2>
              <p className="leading-relaxed mb-2">
                Uygulama dış linklere sahip olabilir. Bu linkler:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Dış uygulamalara yönlendirme yapabilir</li>
                <li>
                  Dış linklerde farklı gizlilik politikaları geçerli olabilir
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
                Veri Silme
              </h2>
              <p className="leading-relaxed mb-2">
                Tüm veriler cihazınızda saklandığından:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Verileri silmek için uygulamayı kaldırabilirsiniz</li>
                <li>Yerel depolama otomatik olarak temizlenir</li>
                <li>Yedekleme veya geri yükleme özelliği yoktur</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
                Değişiklikler
              </h2>
              <p className="leading-relaxed">
                Gizlilik politikasında değişiklikler olduğunda uygulama
                güncellenerek duyurulacaktır.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-[#64748B]">
                <strong>Son Güncelleme: 2026</strong>
              </p>
              <p className="text-sm text-[#64748B] mt-2">
                Bu uygulama çocukların gizliliği için Google Play Store
                kurallarına uygun olarak tasarlanmıştır.
              </p>
            </div>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}
