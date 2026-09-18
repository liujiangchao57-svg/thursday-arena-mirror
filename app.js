(function () {
  "use strict";
  var API = "https://thursdayarena.com/api/public/v1";
  var lbList = document.getElementById("lb-list");
  var lbSource = document.getElementById("lb-source");
  var mList = document.getElementById("m-list");
  var mSource = document.getElementById("m-source");

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function loadLeaderboard() {
    lbSource.textContent = "GET " + API + "/leaderboard …";
    return fetch(API + "/leaderboard")
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (json) {
        var rows = (json && json.data) || [];
        lbList.innerHTML = "";
        rows.slice(0, 20).forEach(function (row) {
          var li = document.createElement("li");
          li.innerHTML =
            '<span class="rank">#' + esc(row.rank) + "</span>" +
            '<span class="handle">@' + esc(row.x_handle) + "</span>" +
            '<span class="score">' + esc(row.rating) +
            " · " + esc(row.wins) + "W/" + esc(row.losses) + "L</span>";
          lbList.appendChild(li);
        });
        lbSource.textContent =
          "Live from thursdayarena.com · showing " + Math.min(20, rows.length) + " / " + rows.length;
      })
      .catch(function (err) {
        lbSource.innerHTML = '<span class="err">Leaderboard fetch failed: ' + esc(err.message) + "</span>";
      });
  }

  function loadMatches() {
    mSource.textContent = "GET " + API + "/matches …";
    return fetch(API + "/matches")
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (json) {
        var rows = (json && json.data) || [];
        mList.innerHTML = "";
        rows.slice(0, 12).forEach(function (row) {
          var players = (row.players || [])
            .map(function (p) {
              return "@" + p.x_handle + " (" + p.outcome + ")";
            })
            .join(" vs ");
          var li = document.createElement("li");
          li.innerHTML =
            "<div><strong>" + esc(row.season || "Season") + "</strong> · " + esc(players) + "</div>" +
            '<div class="rank">' + esc(row.played_at || "") + "</div>";
          mList.appendChild(li);
        });
        mSource.textContent = "Live matches · showing " + Math.min(12, rows.length);
      })
      .catch(function (err) {
        mSource.innerHTML = '<span class="err">Matches fetch failed: ' + esc(err.message) + "</span>";
      });
  }

  function refresh() {
    return Promise.all([loadLeaderboard(), loadMatches()]);
  }

  document.getElementById("btn-refresh").addEventListener("click", refresh);
  refresh();
})();
