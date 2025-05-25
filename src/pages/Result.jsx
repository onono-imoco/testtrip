import Papa from "papaparse";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Result.css";

function Result() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const region = routerLocation.state?.region;
  const currentLocation = routerLocation.state?.location;
  const exclude = routerLocation.state?.exclude;

  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);

  // CSV読み込み（1回だけ）
  useEffect(() => {
    Papa.parse("/spotlight.csv", {
      download: true,
      header: true,
      complete: (result) => {
        setSpots(result.data);
      },
    });
  }, []);

  // スポットの選出処理
  useEffect(() => {
    if (spots.length === 0 || !region) {
      console.log("❌ regionが未設定 または spotsが未ロード");
      return;
    }

    const filteredSpots = spots.filter(
      (spot) => {
        const matchesRegion = region === "おまかせ" || spot.region === region;
        return matchesRegion && spot.name !== exclude;
      }
    );

    if (filteredSpots.length === 0) {
      console.warn("該当スポットが見つかりませんでした");
      return;
    }
    const randomSpot = filteredSpots[Math.floor(Math.random() * filteredSpots.length )];
    setSelectedSpot(randomSpot);
    localStorage.setItem("randomSpot", JSON.stringify(randomSpot));
  }, [spots, currentLocation, exclude]);



  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>あなたの行き先は...</h2>
      <h1 style={{ fontSize: "2.5rem", margin: "1rem 0" }}>
        {selectedSpot ? `${selectedSpot.name} ${selectedSpot.spot}` : "読み込み中..."}
      </h1>

      {selectedSpot ? (
        <div className="map-media-wrapper">
          <img
            src={`/images/${selectedSpot.spot}.jpg`}
            alt={selectedSpot.spot}
            onError={(e) => {
              e.target.src = "/images/default.jpg";
            }}
            style={{
              width: "600px",
              height: "400px",
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />
          <iframe
            title="Google Map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
            `${selectedSpot.name}  ${selectedSpot.spot}`
            )}&output=embed`}
            className="place-map"
            loading="lazy"
            allowFullScreen
          />
        </div>
      ) : (
        <p>画像を読み込み中...</p>
      )}

      <p style={{ marginTop: "1.5rem" }}>
        あなたの現在地: {currentLocation || "不明"}
      </p>

      <button
        onClick={() => {
          localStorage.removeItem("randomSpot");
          navigate("/roulette", {
            state: {
              region: desiredRegion,        // 行きたい地方
              location: currentLocation,    // 現在地（表示用）
              exclude: null                 // 初回なので除外なし
            }
          });
        }}
      >
        行ったことがあるのでもう一度選ぶ
      </button>

      <button
        onClick={() => {
          navigate("/resume", {
            state: {
              location: currentLocation,
            }
          });
        }}
      >
        ここに決定
      </button>
    </div>
  );
}

export default Result;
