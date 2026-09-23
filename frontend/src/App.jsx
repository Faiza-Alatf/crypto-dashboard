import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

function App() {
  const [crypto, setCrypto] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchCrypto = async (manual = false) => {
    try {
      if (manual) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch("/api/crypto");

      if (!response.ok) {
        throw new Error("Failed to fetch crypto data");
      }

      const result = await response.json();

      setCrypto(result.data);
      setError("");

      setLastUpdated(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (err) {
      console.error(err);
      setError("Unable to load cryptocurrency data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCrypto();

    const interval = setInterval(() => {
      fetchCrypto();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`;
    }

    return `$${price.toFixed(6)}`;
  };

  const formatLargeNumber = (number) => {
    if (number >= 1e12) {
      return `$${(number / 1e12).toFixed(2)}T`;
    }

    if (number >= 1e9) {
      return `$${(number / 1e9).toFixed(2)}B`;
    }

    if (number >= 1e6) {
      return `$${(number / 1e6).toFixed(2)}M`;
    }

    return `$${number.toLocaleString()}`;
  };

  const filteredCrypto = crypto.filter((coin) =>
    `${coin.name} ${coin.symbol}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const chartData = crypto.slice(0, 10).map((coin) => ({
    name: coin.symbol,
    change: Number(coin.quote[0].percent_change_24h.toFixed(2)),
  }));

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <h2>Loading Crypto Market...</h2>
        <p>Fetching live market data</p>
      </div>
    );
  }

  return (
    <div className="app">

      {/* Header */}

      <header className="header">
        <div>
          <div className="brand">
            <div className="brand-icon">₿</div>

            <div>
              <h1>CryptoPulse</h1>
              <p>Live Cryptocurrency Market Dashboard</p>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <div className="status">
            <span className="status-dot"></span>
            Live Market
          </div>

          <button
            className="refresh-btn"
            onClick={() => fetchCrypto(true)}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>
      </header>

      {/* Error */}

      {error && <div className="error">{error}</div>}

      {/* Market Overview */}

      <section className="stats">

        <div className="stat-card">
          <div className="stat-top">
            <span>Total Coins</span>
            <span className="stat-icon">◈</span>
          </div>

          <h2>{crypto.length}</h2>

          <p className="stat-description">
            Cryptocurrencies tracked
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Top Cryptocurrency</span>
            <span className="stat-icon">★</span>
          </div>

          <h2>{crypto[0]?.symbol || "-"}</h2>

          <p className="stat-description">
            {crypto[0]?.name || "Loading"}
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Bitcoin Price</span>
            <span className="stat-icon">₿</span>
          </div>

          <h2>
            {crypto[0]
              ? formatPrice(crypto[0].quote[0].price)
              : "-"}
          </h2>

          <p
            className={
              crypto[0]?.quote[0].percent_change_24h >= 0
                ? "positive"
                : "negative"
            }
          >
            {crypto[0]
              ? `${crypto[0].quote[0].percent_change_24h >= 0 ? "+" : ""}${crypto[0].quote[0].percent_change_24h.toFixed(2)}% today`
              : "-"}
          </p>
        </div>

      </section>

      {/* Chart */}

      <section className="chart-section">

        <div className="section-header">
          <div>
            <h2>Market Performance</h2>
            <p>24-hour percentage change of top cryptocurrencies</p>
          </div>

          <span className="updated">
            Updated {lastUpdated}
          </span>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>

            <XAxis
              dataKey="name"
              stroke="#64748b"
              tick={{ fill: "#94a3b8" }}
            />

            <YAxis
              stroke="#64748b"
              tick={{ fill: "#94a3b8" }}
            />

            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #334155",
                borderRadius: "10px",
                color: "#fff",
              }}
            />

            <Bar
              dataKey="change"
              fill="#8b5cf6"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>

      </section>

      {/* Crypto Table */}

      <section className="table-section">

        <div className="table-header">

          <div>
            <h2>Top Cryptocurrencies</h2>
            <p>Live market prices and statistics</p>
          </div>

          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search coin or symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>#</th>
                <th>Cryptocurrency</th>
                <th>Price</th>
                <th>Market Cap</th>
                <th>24h Volume</th>
                <th>24h Change</th>
              </tr>
            </thead>

            <tbody>

              {filteredCrypto.map((coin) => {

                const change =
                  coin.quote[0].percent_change_24h;

                return (
                  <tr key={coin.id}>

                    <td className="rank">
                      {coin.cmc_rank}
                    </td>

                    <td>

                      <div className="coin-info">

                        <img
                          src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
                          alt={coin.name}
                          className="coin-logo"
                        />

                        <div>
                          <strong>{coin.name}</strong>

                          <span className="symbol">
                            {coin.symbol}
                          </span>
                        </div>

                      </div>

                    </td>

                    <td className="price">
                      {formatPrice(
                        coin.quote[0].price
                      )}
                    </td>

                    <td>
                      {formatLargeNumber(
                        coin.quote[0].market_cap
                      )}
                    </td>

                    <td>
                      {formatLargeNumber(
                        coin.quote[0].volume_24h
                      )}
                    </td>

                    <td>

                      <span
                        className={
                          change >= 0
                            ? "change positive-bg"
                            : "change negative-bg"
                        }
                      >
                        {change >= 0 ? "▲" : "▼"}{" "}
                        {Math.abs(change).toFixed(2)}%
                      </span>

                    </td>

                  </tr>
                );

              })}

            </tbody>

          </table>

          {filteredCrypto.length === 0 && (
            <div className="no-results">
              No cryptocurrency found.
            </div>
          )}

        </div>

      </section>

      <footer>
        Data provided by CoinMarketCap API
      </footer>

    </div>
  );
}

export default App;