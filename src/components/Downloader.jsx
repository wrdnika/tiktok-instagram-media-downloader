import { useState, useEffect } from "react";
import {
  FaMoon,
  FaSun,
  FaPaste,
  FaDownload,
  FaTiktok,
  FaInstagram,
  FaCheckCircle,
} from "react-icons/fa";

export default function Downloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [platform, setPlatform] = useState(null);

  const tiktokApi = import.meta.env.VITE_TIKTOK_API;
  const instagramApi = import.meta.env.VITE_INSTAGRAM_API;

  // Deteksi platform setiap kali 'url' berubah
  useEffect(() => {
    if (url.includes("tiktok.com")) {
      setPlatform("tiktok");
    } else if (url.includes("instagram.com") || url.includes("ig.com")) {
      setPlatform("instagram");
    } else {
      setPlatform(null);
    }
  }, [url]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setStatus("Link berhasil ditempel!");
      setTimeout(() => setStatus(""), 2000);
    } catch {
      setStatus("Gagal membaca clipboard. silahkan tempel pada kolom input");
      setTimeout(() => setStatus(""), 2000);
    }
  };

  const handleDownload = async () => {
    if (!platform) {
      setStatus("Masukkan URL TikTok atau Instagram yang valid.");
      setTimeout(() => setStatus(""), 3000);
      return;
    }

    setLoading(true);
    setStatus("Memproses URL...");

    const apiEndpoint = platform === "tiktok" ? tiktokApi : instagramApi;

    try {
      const response = await fetch(
        `${apiEndpoint}?url=${encodeURIComponent(url)}`
      );
      if (!response.ok) throw new Error("Gagal fetch dari API.");

      const data = await response.json();
      let mediaList = [];

      if (platform === "tiktok") {
        const tResult = data?.result;

        // TikTok: slides → images → image → video_nowm
        if (Array.isArray(tResult?.slides) && tResult.slides.length > 0) {
          tResult.slides.forEach((slide) => {
            if (slide.url) mediaList.push(slide.url);
          });
        } else if (
          Array.isArray(tResult?.images) &&
          tResult.images.length > 0
        ) {
          tResult.images.forEach((imgUrl) => mediaList.push(imgUrl));
        } else if (typeof tResult?.image === "string" && tResult.image) {
          mediaList.push(tResult.image);
        } else if (tResult?.video_nowm) {
          mediaList.push(tResult.video_nowm);
        } else {
          throw new Error("Media TikTok tidak ditemukan.");
        }
      } else {
        // Instagram:
        const iResult = data?.result;
        const isReel = url.includes("/reel/");

        if (isReel) {
          // Jika Reel → hanya unduh video[0]
          if (Array.isArray(iResult?.video) && iResult.video.length > 0) {
            mediaList.push(iResult.video[0]);
          } else if (typeof iResult?.url === "string" && iResult.url) {
            mediaList.push(iResult.url);
          } else {
            throw new Error("Video Instagram tidak ditemukan.");
          }
        } else {
          // Bukan Reel → anggap post gambar/slider → hanya unduh thumb[]
          if (Array.isArray(iResult?.thumb) && iResult.thumb.length > 0) {
            iResult.thumb.forEach((imgUrl) => mediaList.push(imgUrl));
          } else if (typeof iResult?.url === "string" && iResult.url) {
            // fallback single media
            mediaList.push(iResult.url);
          } else {
            throw new Error("Gambar Instagram tidak ditemukan.");
          }
        }
      }

      // Mulai unduh semua media satu per satu
      setStatus(`Mengunduh ${mediaList.length} media...`);
      for (let i = 0; i < mediaList.length; i++) {
        const mediaUrl = mediaList[i];

        // Fetch media
        const resMedia = await fetch(mediaUrl);
        if (!resMedia.ok) throw new Error("Gagal mengunduh media.");

        // Baca Blob dan header Content-Type
        const blob = await resMedia.blob();
        let contentType =
          resMedia.headers.get("Content-Type") || blob.type || "";

        // Jika header tidak membantu, fallback pola URL RapidCDN
        if (!contentType || contentType === "application/octet-stream") {
          if (mediaUrl.includes("/thumb")) {
            contentType = "image/jpeg";
          } else if (mediaUrl.includes("/v2")) {
            contentType = "video/mp4";
          }
        }

        // Tentukan ekstensi
        let ext = "bin";
        if (contentType.startsWith("image/")) {
          const subtype = contentType.split("/")[1];
          ext = subtype === "jpeg" ? "jpg" : subtype;
        } else if (contentType.startsWith("video/")) {
          ext = contentType.split("/")[1];
        }

        // Buat object URL & trigger download
        const blobUrl = URL.createObjectURL(blob);
        const fileName = `rcdl-${platform}-${Math.floor(
          100000 + Math.random() * 900000
        )}-${i + 1}.${ext}`;

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(blobUrl);
      }

      setStatus("Semua media berhasil diunduh!");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setStatus(`Gagal: ${err.message}`);
      setTimeout(() => setStatus(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-300 ${
        darkMode ? "bg-[#1e1e1e]" : "bg-[#e0e5ec]"
      }`}
    >
      <div
        className={`p-8 rounded-3xl max-w-xl w-full space-y-6 text-center transition-all duration-300 ${
          darkMode
            ? "bg-[#1e1e1e] text-white shadow-neo-dark"
            : "bg-[#e0e5ec] text-gray-800 shadow-neo"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-2xl ${
                darkMode
                  ? "bg-[#1e1e1e] shadow-neo-dark"
                  : "bg-[#e0e5ec] shadow-neo"
              }`}
            >
              {platform === "instagram" ? (
                <FaInstagram className="text-2xl" />
              ) : (
                <FaTiktok className="text-2xl" />
              )}
            </div>
            <h1 className="text-2xl font-bold">
              {platform === "instagram"
                ? "Instagram Reel Downloader"
                : "TikTok Downloader"}
            </h1>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-2xl transition-all duration-300 hover:scale-105 ${
              darkMode
                ? "bg-[#1e1e1e] shadow-neo-dark hover:shadow-neo-inset-dark"
                : "bg-[#e0e5ec] shadow-neo hover:shadow-neo-inset"
            }`}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <FaSun className="text-lg" />
            ) : (
              <FaMoon className="text-lg" />
            )}
          </button>
        </div>

        {/* Subtitle */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            darkMode
              ? "bg-[#1e1e1e] text-green-400 shadow-neo-inset-dark"
              : "bg-[#e0e5ec] text-green-600 shadow-neo-inset"
          }`}
        >
          <FaCheckCircle />
          Tanpa Watermark • Gratis • Mudah • Aman
        </div>

        {/* Instructions */}
        <div
          className={`text-left text-sm p-6 rounded-2xl transition-all duration-300 ${
            darkMode
              ? "bg-[#1e1e1e] text-gray-300 shadow-neo-inset-dark"
              : "bg-[#e0e5ec] text-gray-600 shadow-neo-inset"
          }`}
        >
          <h2 className="font-semibold mb-3 text-center">📱 Cara Download:</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  darkMode
                    ? "bg-[#1e1e1e] text-blue-400 shadow-neo-dark"
                    : "bg-[#e0e5ec] text-blue-600 shadow-neo"
                }`}
              >
                1
              </span>
              <p>Buka TikTok/Reels Instagram, lalu salin link postingan.</p>
            </div>
            <div className="flex items-start gap-3">
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  darkMode
                    ? "bg-[#1e1e1e] text-blue-400 shadow-neo-dark"
                    : "bg-[#e0e5ec] text-blue-600 shadow-neo"
                }`}
              >
                2
              </span>
              <p>Tempel link ke kolom input di bawah.</p>
            </div>
            <div className="flex items-start gap-3">
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  darkMode
                    ? "bg-[#1e1e1e] text-blue-400 shadow-neo-dark"
                    : "bg-[#e0e5ec] text-blue-600 shadow-neo"
                }`}
              >
                3
              </span>
              <p>Tekan tombol Download dan tunggu semua media terunduh.</p>
            </div>
          </div>
        </div>

        {/* Input + Paste Button */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                className={`w-full p-4 rounded-2xl text-sm focus:outline-none transition-all duration-300 ${
                  darkMode
                    ? "bg-[#1e1e1e] text-white shadow-neo-inset-dark focus:shadow-neo-dark"
                    : "bg-[#e0e5ec] text-gray-700 shadow-neo-inset focus:shadow-neo"
                }`}
                placeholder="Tempel tautan TikTok atau Reels Instagram di sini..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button
              onClick={handlePaste}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                darkMode
                  ? "bg-[#1e1e1e] text-white shadow-neo-dark hover:shadow-neo-inset-dark"
                  : "bg-[#e0e5ec] text-gray-700 shadow-neo hover:shadow-neo-inset"
              }`}
            >
              <FaPaste />
              Paste
            </button>
          </div>

          {/* Download Button */}
          <button
            disabled={!platform || loading}
            onClick={handleDownload}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              loading
                ? darkMode
                  ? "bg-[#1e1e1e] text-gray-400 shadow-neo-inset-dark cursor-not-allowed"
                  : "bg-[#e0e5ec] text-gray-400 shadow-neo-inset cursor-not-allowed"
                : !platform
                ? darkMode
                  ? "bg-[#1e1e1e] text-gray-500 shadow-neo-inset-dark cursor-not-allowed"
                  : "bg-[#e0e5ec] text-gray-500 shadow-neo-inset cursor-not-allowed"
                : darkMode
                ? "bg-[#1e1e1e] shadow-neo-dark hover:shadow-neo-inset-dark hover:scale-105"
                : "bg-[#e0e5ec] shadow-neo hover:shadow-neo-inset hover:scale-105"
            }`}
          >
            <FaDownload className={loading ? "animate-bounce" : ""} />
            {loading
              ? "Memproses..."
              : `Download ${platform === "instagram" ? "Instagram" : "TikTok"}`}
          </button>
        </div>

        {/* Status Message */}
        <div
          className={`text-sm min-h-[24px] flex items-center justify-center transition-all duration-300 ${
            status
              ? darkMode
                ? "bg-[#1e1e1e] text-blue-400 p-3 rounded-xl shadow-neo-inset-dark"
                : "bg-[#e0e5ec] text-blue-600 p-3 rounded-xl shadow-neo-inset"
              : ""
          }`}
        >
          {status}
        </div>

        {/* Footer/Tips */}
        <div
          className={`text-xs p-4 rounded-2xl ${
            darkMode
              ? "bg-[#1e1e1e] text-gray-400 shadow-neo-inset-dark"
              : "bg-[#e0e5ec] text-gray-500 shadow-neo-inset"
          }`}
        >
          💡 <strong>Tips:</strong> Pastikan link yang Anda masukkan adalah link
          yang valid dan dapat diakses secara publik (bukan akun private).
        </div>
      </div>
    </div>
  );
}
