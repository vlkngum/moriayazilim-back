export default function PortfolioAddPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Portfolio Ekle</h1>
      <form className="bg-white rounded shadow p-6 max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Proje Adı</label>
          <input type="text" className="w-full border rounded px-3 py-2" placeholder="Proje adı" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Açıklama</label>
          <textarea className="w-full border rounded px-3 py-2" rows={4} placeholder="Proje açıklaması" />
        </div>
        <button type="submit" className="bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-800">Kaydet</button>
      </form>
    </main>
  );
} 