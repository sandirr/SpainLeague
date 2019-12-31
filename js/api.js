var base_url = "https://api.football-data.org/v2/"
let token = '4ee86df3c2364cd0a808828cd6c59e23'

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getArticles() {
  if ("caches" in window) {
    caches.match(base_url + "competitions/2014/standings?standingType=HOME", {
      headers: {
        'X-Auth-Token': token
      }
    }).then(function (response) {
      if (response) {
        response.json().then(data => {
          var articlesHTML = `
          <div>
            <table>
            <tr>
              <th colspan=3>Klub</th>
              <th>Menang</th>
              <th>Seri</th>
              <th>Kalah</>
              <th>Points</th>
            </tr>
          `;

          data.standings.forEach(article => {
            article.table.forEach(standProf => {
              let crestUrl = standProf.team.crestUrl.replace(/^http:\/\//i, 'https://');
              articlesHTML += `
                  <tr>
                    <td>${standProf.position}</td>
                    <td><img src='${crestUrl}' width='15px' /></td>
                    <td><a href='article.html?id=${standProf.team.id}'>${standProf.team.name}</a></td>
                    <td>${standProf.won}</td>
                    <td>${standProf.draw}</>
                    <td>${standProf.lost}</td>
                    <td>${standProf.points}</td>
                  </tr>
                  `;
            })
          });
          articlesHTML += `
            </table>
            </div>
          `
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("articles").innerHTML = articlesHTML;
        });
      }
    });
  }

  fetch(base_url + "competitions/2014/standings?standingType=HOME", {
    headers: {
      'X-Auth-Token': token
    }
  })
    .then(status)
    .then(json)
    .then(data => {
      // Objek/array JavaScript dari response.json() masuk lewat data.

      // Menyusun komponen card artikel secara dinamis
      var articlesHTML = `
      <div>
            <table>
            <tr>
              <th colspan=3>Klub</th>
              <th>Menang</th>
              <th>Seri</th>
              <th>Kalah</>
              <th>Points</th>
            </tr>
          `;

      data.standings.forEach(article => {
        article.table.forEach(standProf => {
          let crestUrl = standProf.team.crestUrl.replace(/^http:\/\//i, 'https://');
          articlesHTML += `
                  <tr>
                    <td>${standProf.position}</td>
                    <td><img src='${crestUrl}' width='15px' /></td>
                    <td><a href='article.html?id=${standProf.team.id}'>${standProf.team.name}</a></td>
                    <td>${standProf.won}</td>
                    <td>${standProf.draw}</>
                    <td>${standProf.lost}</td>
                    <td>${standProf.points}</td>
                  </tr>
                  `;
        })
      });
      articlesHTML += `
            </table>
            </div>
          `
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("articles").innerHTML = articlesHTML;
    })
    .catch(error);
}

function getArticleById() {
  return new Promise(resolve => {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if ("caches" in window) {
      caches.match(base_url + "teams/" + idParam, {
        headers: {
          'X-Auth-Token': token
        }
      }).then(response => {
        if (response) {
          response.json().then(data => {
            let crestUrl = data.crestUrl.replace(/^http:\/\//i, 'https://');
            // Objek JavaScript dari response.json() masuk lewat variabel data.
            // console.log(data);
            // Menyusun komponen card artikel secara dinamis
            var articleHTML = `
        <div class="card">
          <div class="center">
            <img src='${crestUrl}' width='90px' style="margin: 20px auto 0" class='center'/>
          </div>

            <h4 style="margin: 20px">Squad</h4>

            <table>
              <thead class="grey white-text">
                <th>Nama</th>
                <th>Posisi</th>
                <th>Nomor Punggung</th>
                <th>Kebangsaan</th>
              </thead>
        `
            data.squad.forEach(sq => {
              if (sq.position != null) {
                articleHTML += `
            <tr>
              <td>${sq.name}</td>
              <td>${sq.position}</td>
              <td>${sq.shirtNumber}</td>
              <td>${sq.nationality}</td>
            </tr>
            `
              } else {
                articleHTML += `
            <tr>
              <td>${sq.name}</td>
              <td colspan=3>Pelatih</td>
            </tr>
            `
              }
            })

            articleHTML += `
            </table>
            
          </div>
        `
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = articleHTML;

            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetch(base_url + "teams/" + idParam, {
      headers: {
        'X-Auth-Token': token
      }
    })
      .then(status)
      .then(json)
      .then(data => {
        let crestUrl = data.crestUrl.replace(/^http:\/\//i, 'https://')
        // Objek JavaScript dari response.json() masuk lewat variabel data.
        // console.log(data);
        // Menyusun komponen card artikel secara dinamis
        var articleHTML = `
        <div class="card">
          <div class="center">
            <img src='${crestUrl}' width='90px' style="margin: 20px auto 0" class='center'/>
          </div>

            <h4 style="margin: 20px">Squad</h4>

            <table>
              <thead class="grey white-text">
                <th>Nama</th>
                <th>Posisi</th>
                <th>Nomor Punggung</th>
                <th>Kebangsaan</th>
              </thead>
        `
        data.squad.forEach(sq => {
          if (sq.position != null) {
            articleHTML += `
            <tr>
              <td>${sq.name}</td>
              <td>${sq.position}</td>
              <td>${sq.shirtNumber}</td>
              <td>${sq.nationality}</td>
            </tr>
            `
          } else {
            articleHTML += `
            <tr>
              <td>${sq.name}</td>
              <td colspan=3>Pelatih</td>
            </tr>
            `
          }
        })

        articleHTML += `
            </table>
            
          </div>
        `
        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById("body-content").innerHTML = articleHTML;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
}

function getSavedArticles() {
  getAll().then(articles => {
    console.log(articles);
    // Menyusun komponen card artikel secara dinamis
    if (articles.length == 0) {
      let articlesHTML = `<div class='center'>
        <h4>Ups.., Belum ada profil klub yang disimpan</h4>
      </div>`;
      document.getElementById("body-content").innerHTML = articlesHTML;
      return;
    }
    let articlesHTML = `
    <div>
      <table>
      <tr>
        <th colspan=2>Klub</th>
        <th>Pelatih</th>
        <th>Aksi</th>
      </tr>
    `;
    articles.forEach(article => {
      // console.log(article.post_title)
      let crestUrl = article.crestUrl.replace(/^http:\/\//i, 'https://');
      articlesHTML += `
                  <tr>
                    <td><img src='${crestUrl}' width='15px' /></td>
                    <td><a href='./article.html?id=${article.id}&saved=true'>${article.name}</a></td>
                    `
      article.squad.forEach(e => {
        if (e.position == null) {
          articlesHTML += `
                <td>${e.name}</td>
        `;
        }
      })
      articlesHTML += `
        <td><button class='btn' onclick='deleteById(${article.id})'>Hapus</button></td>
        </tr>
        `
    });
    articlesHTML += `
            </table>
            </div>
          `
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = articlesHTML;
  });
}

// function getSavedArticleById() {
//   var urlParams = new URLSearchParams(window.location.search)
//   var idParam = urlParams.get("id")

//   getById(idParam).then(function (article) {
//     console.log(article)
//     let crestUrl = article.crestUrl.replace(/^http:\/\//i, 'https://');
//     var articleHTML = `
//         <div class="card">
//           <div class="center">
//             <img src='${crestUrl}' width='90px' style="margin: 20px auto 0" class='center'/>
//           </div>

//             <h4 style="margin: 20px">Squad</h4>

//             <table>
//               <thead class="grey white-text">
//                 <th>Nama</th>
//                 <th>Posisi</th>
//                 <th>Nomor Punggung</th>
//                 <th>Kebangsaan</th>
//               </thead>
//                ${snarkdown(article)}
//         `
//     article.squad.forEach(sq => {
//       if (sq.position != null) {
//         articleHTML += `
//             <tr>
//               <td>${sq.name}</td>
//               <td>${sq.position}</td>
//               <td>${sq.shirtNumber}</td>
//               <td>${sq.nationality}</td>
//             </tr>
//             `
//       } else {
//         articleHTML += `
//             <tr>
//               <td>${sq.name}</td>
//               <td colspan=3>Pelatih</td>
//             </tr>
//             `
//       }
//     })

//     articleHTML += `
//             </table>

//           </div>
//         `
//     // Sisipkan komponen card ke dalam elemen dengan id #content
//     document.getElementById("body-content").innerHTML = articleHTML;
//   });
// }